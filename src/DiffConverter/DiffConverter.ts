import { Command, CommandType } from "./Commands";

export type Diff = [CommandType, string];

export class DiffConverter {
  createCommands(diff: Diff[]): Command[] {
    const commands: Command[] = [];
    diff.forEach(([commandType, commandPayload]: Diff) => {
      switch (commandType) {
        case CommandType.DELETE:
          commands.push(...this.transformDelete(commandPayload));
          break;
        case CommandType.SKIP:
          commands.push([CommandType.SKIP, commandPayload.length]);
          break;
        case CommandType.INSERT:
          for (let i = 0; i < commandPayload.length; i++) {
            commands.push([CommandType.INSERT, commandPayload[i]]);
          }
          break;
      }
    });
    return commands;
  }

  createCommandsFastForward(diff: Diff[]): Command[] {
    const commands: Command[] = [];
    diff.forEach(([commandType, commandPayload]: Diff) => {
      switch (commandType) {
        case CommandType.DELETE:
          commands.push([CommandType.DELETE, commandPayload.length]);
          break;
        case CommandType.SKIP:
          commands.push([CommandType.SKIP, commandPayload.length]);
          break;
        case CommandType.INSERT:
          commands.push([CommandType.INSERT, commandPayload]);
          break;
      }
    });
    return commands;
  }

  private transformDelete(commandPayload: string) {
    const commands: Command[] = [];
    for (let i = 0; i < commandPayload.length; i++) {
      commands.push([CommandType.DELETE, 1]);
    }
    return commands;
  }
}
