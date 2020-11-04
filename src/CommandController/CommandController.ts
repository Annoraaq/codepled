import {
  Command,
  CommandType,
  FastForwardCommand,
} from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";

interface Subcommand {
  index: number;
  offset: number;
  length: number;
}

interface Chunk {
  offset: number;
  length: number;
}

export interface TextStep {
  title?: string;
  content: string;
  stepNo: number;
}

export class CommandController {
  private commands: Command[] = [];
  private stepMapping: Map<number, Subcommand> = new Map();
  private textSteps: TextStep[] = [];
  private stepNo: number;

  getTextSteps(): TextStep[] {
    return this.textSteps;
  }

  addCommands(commands: Command[]) {
    this.setCommands([...this.commands, ...commands]);
  }

  setCommands(commands: Command[]) {
    this.commands = commands;
    this.stepMapping = new Map<number, Subcommand>();
    this.stepNo = 0;

    for (
      let commandIndex = 0;
      commandIndex < this.commands.length;
      commandIndex++
    ) {
      const [commandType, payload] = this.commands[commandIndex];

      switch (commandType) {
        case CommandType.INSERT:
          this.mapInsertCommand(payload, commandIndex);
          break;
        case CommandType.SHOW_TEXT:
          this.textSteps.push({
            title: payload.title,
            content: payload.message,
            stepNo: this.stepNo + 1,
          });
        default:
          this.addStepMapping(commandIndex, 0, 1);
          break;
      }
    }
  }

  getTotalSteps(): number {
    return this.stepMapping.size;
  }

  getCommandAtStep(stepNo: number): Command {
    const { index, offset, length } = this.stepMapping.get(stepNo);
    const [commandType, payload] = this.commands[index];

    const transformPayload = () => {
      if (commandType === CommandType.INSERT) {
        return payload.substr(offset - length + 1, length);
      }
      return payload;
    };

    return [commandType, transformPayload()];
  }

  getFastForwardCommands(stepNoExclusive: number): FastForwardCommand[] {
    if (stepNoExclusive === 0) return [];
    if (stepNoExclusive > this.getTotalSteps())
      stepNoExclusive = this.getTotalSteps();
    const lastSubcommand = this.stepMapping.get(stepNoExclusive - 1);
    const ffCommands = this.cloneCommandsAsFastForward().slice(
      0,
      lastSubcommand.index + 1
    );
    const lastCommand = ffCommands[ffCommands.length - 1];
    switch (lastCommand.type) {
      case CommandType.INSERT:
        lastCommand.payload = lastCommand.payload.substr(
          0,
          lastSubcommand.offset + 1
        );
        lastCommand.steps = this.getStepsForInsert(lastCommand.payload);
        break;
    }
    return ffCommands;
  }

  private addStepMapping(commandIndex: number, offset: number, length: number) {
    this.stepMapping.set(this.stepNo, {
      index: commandIndex,
      offset,
      length,
    });
    this.stepNo++;
  }

  private mapInsertCommand(payload: string, commandIndex: number) {
    const chunks: Chunk[] = this.getChunksForInsert(payload);
    chunks.forEach(({ offset, length }) => {
      this.addStepMapping(commandIndex, offset, length);
    });
  }

  private cloneCommandsAsFastForward(): FastForwardCommand[] {
    let cloned: FastForwardCommand[] = [];
    this.commands.forEach(([type, payload]) => {
      let steps = 1;
      if (type === CommandType.INSERT) {
        steps = this.getStepsForInsert(payload);
      }
      cloned.push({ type, payload, steps });
    });
    return cloned;
  }

  private getStepsForInsert(payload: string): number {
    return this.getChunksForInsert(payload).length;
  }

  private getChunksForInsert(payload: string): Chunk[] {
    let commandOffset = 0;
    let currentAlphanumericSequence = "";
    let chunks: Chunk[] = [];

    const addCurrentAlphanumericSequence = (offset: number) => {
      chunks.push({ offset, length: currentAlphanumericSequence.length });
      currentAlphanumericSequence = "";
    };

    const mustFlushAlphanumericSequence = () =>
      currentAlphanumericSequence.length > 0;

    for (let i = 0; i < payload.length; i++) {
      const isLastCharacter = i == payload.length - 1;

      if (!Utils.isAlphanumeric(payload[i])) {
        if (mustFlushAlphanumericSequence()) {
          addCurrentAlphanumericSequence(commandOffset - 1);
        }
        chunks.push({ offset: commandOffset, length: 1 });
      } else {
        currentAlphanumericSequence += payload[i];
        if (isLastCharacter) {
          addCurrentAlphanumericSequence(commandOffset);
        }
      }
      commandOffset++;
    }
    return chunks;
  }
}
