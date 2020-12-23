import { Command, CommandType, DiffCommandType } from "./Commands";

export type Diff = [DiffCommandType, string];

export class DiffConverter {
  createCommandsFastForward(diff: Diff[]): Command[] {
    const commands: Command[] = [];
    diff.forEach(([commandType, commandPayload]: Diff) => {
      switch (commandType) {
        case DiffCommandType.DELETE:
          commands.push([CommandType.DELETE, commandPayload.length]);
          break;
        case DiffCommandType.SKIP:
          commands.push([CommandType.SKIP, commandPayload.length]);
          break;
        case DiffCommandType.INSERT:
          commands.push([CommandType.INSERT, commandPayload]);
          break;
      }
    });
    return commands;
  }
}
