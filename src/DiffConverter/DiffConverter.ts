import { Command, CommandType } from "./Commands";

export type Diff = [CommandType, string];

export class DiffConverter {
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
}
