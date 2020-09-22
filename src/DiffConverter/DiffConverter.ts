import { Command } from "./Commands";

export type Diff = [number, String];

export class DiffConverter {
  CMD_DELETE = -1;
  CMD_INSERT = 1;
  CMD_SKIP = 0;

  createCommands(diff: Diff[]): Command[] {
    const commands: Command[] = [];
    diff.forEach((d: Diff) => {
      if (d[0] === -1) {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([this.CMD_DELETE, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([this.CMD_SKIP, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([this.CMD_INSERT, d[1][i]]);
        }
      }
    });
    return commands;
  }
}
