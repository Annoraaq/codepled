import {
  Command,
  CommandType,
  FastForwardCommand,
} from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";

interface CommandIndex {
  index: number;
  offset: number;
  length: number;
}

export class CommandController {
  private commands: Command[] = [];
  private stepMapping: Map<number, CommandIndex> = new Map();
  private commandIndexToSteps: Map<number, number> = new Map();
  private textSteps: { content: string; stepNo: number }[] = [];

  getTextSteps(): { content: string; stepNo: number }[] {
    return this.textSteps;
  }

  addCommands(commands: Command[]) {
    this.setCommands([...this.commands, ...commands]);
  }

  private getStepsForInsert(payload: string) {
    let steps = 0;
    let current = "";
    for (let i = 0; i < payload.length; i++) {
      if (!Utils.isAlphanumeric(payload[i])) {
        if (current.length > 0) {
          steps++;
          current = "";
        }
        steps++;
      } else {
        current += payload[i];
        if (i == payload.length - 1) {
          steps++;
          current = "";
        }
      }
    }
    return steps;
  }

  private mapInsertCommand(
    payload: string,
    commandIndex: number,
    stepNo: number
  ): number {
    let commandOffset = 0;
    let current = "";
    for (let i = 0; i < payload.length; i++) {
      if (!Utils.isAlphanumeric(payload[i])) {
        if (current.length > 0) {
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset - 1,
            length: current.length,
          });
          stepNo++;
          current = "";
        }
        this.stepMapping.set(stepNo, {
          index: commandIndex,
          offset: commandOffset,
          length: 1,
        });
        stepNo++;
      } else {
        current += payload[i];
        if (i == payload.length - 1) {
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset,
            length: current.length,
          });
          stepNo++;
          current = "";
        }
      }
      commandOffset++;
    }
    return stepNo;
  }

  setCommands(commands: Command[]) {
    this.commands = commands;
    this.stepMapping = new Map<number, CommandIndex>();

    let stepNo = 0;
    for (
      let commandIndex = 0;
      commandIndex < this.commands.length;
      commandIndex++
    ) {
      const [commandType, payload] = this.commands[commandIndex];
      let commandOffset = 0;

      switch (commandType) {
        case CommandType.INSERT:
          stepNo = this.mapInsertCommand(payload, commandIndex, stepNo);
          break;
        case CommandType.DELETE:
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset,
            length: payload,
          });
          stepNo++;
          commandOffset += payload;
          break;
        case CommandType.SHOW_TEXT:
          this.textSteps.push({ content: payload.message, stepNo: stepNo + 1 });
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset,
            length: 1,
          });
          stepNo++;
          break;
        default:
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset,
            length: 1,
          });
          stepNo++;
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
    let newPayload = payload;
    switch (commandType) {
      case CommandType.INSERT:
        newPayload = payload.substr(offset - length + 1, length);
        break;
      case CommandType.DELETE:
        newPayload = payload;
        break;
    }
    return [commandType, newPayload];
  }

  getFastForwardCommands(stepNoExclusive: number): FastForwardCommand[] {
    if (stepNoExclusive === 0) return [];
    if (stepNoExclusive > this.getTotalSteps())
      stepNoExclusive = this.getTotalSteps();
    const lastCommandInfo = this.stepMapping.get(stepNoExclusive - 1);
    const ffCommands = this.cloneCommandsAsFastForward().slice(
      0,
      lastCommandInfo.index + 1
    );
    const lastCommand = ffCommands[ffCommands.length - 1];
    switch (lastCommand.type) {
      case CommandType.INSERT:
        lastCommand.payload = lastCommand.payload.substr(
          0,
          lastCommandInfo.offset + 1
        );
        lastCommand.steps = this.getStepsForInsert(lastCommand.payload);
        break;
    }
    return ffCommands;
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
}
