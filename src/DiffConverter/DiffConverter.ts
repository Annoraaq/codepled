import { Command, Commands } from "./Commands";

export type Diff = [number, String];

export class DiffConverter {
  createCommands(diff: Diff[]): Command[] {
    const commands: Command[] = [];
    diff.forEach((d: Diff) => {
      if (d[0] === -1) {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([Commands.DELETE, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([Commands.SKIP, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([Commands.INSERT, d[1][i]]);
        }
      }
    });
    return commands;
  }
}
