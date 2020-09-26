import { Command, CommandType } from "../DiffConverter/Commands";

interface CommandIndex {
  index: number;
  offset: number;
}

export class CommandController {
  private commands: Command[] = [];
  private stepMapping: Map<number, CommandIndex> = new Map();

  addCommands(commands: Command[]) {
    this.setCommands([...this.commands, ...commands]);
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
          for (let i = 0; i < payload.length; i++) {
            this.stepMapping.set(stepNo, {
              index: commandIndex,
              offset: commandOffset,
            });
            stepNo++;
            commandOffset++;
          }
          break;
        case CommandType.DELETE:
          for (let i = 0; i < payload; i++) {
            this.stepMapping.set(stepNo, {
              index: commandIndex,
              offset: commandOffset,
            });
            stepNo++;
            commandOffset++;
          }
          break;
        default:
          this.stepMapping.set(stepNo, {
            index: commandIndex,
            offset: commandOffset,
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
    const { index, offset } = this.stepMapping.get(stepNo);
    const [commandType, payload] = this.commands[index];
    let newPayload = payload;
    switch (commandType) {
      case CommandType.INSERT:
        newPayload = payload[offset];
        break;
      case CommandType.DELETE:
        newPayload = 1;
        break;
    }
    return [commandType, newPayload];
  }

  getFastForwardCommands(stepNo: number): Command[] {
    const { index, offset } = this.stepMapping.get(stepNo);
    const ffCommands = this.commands.slice(0, index + 1);
    const [commandType, payload] = this.commands[index];
    let newPayload = payload;
    switch (commandType) {
      case CommandType.INSERT:
        newPayload = payload.substr(0, offset + 1);
        break;
      case CommandType.DELETE:
        newPayload = offset + 1;
        break;
    }
    ffCommands[ffCommands.length - 1][1] = newPayload;
    return ffCommands;
  }
}
