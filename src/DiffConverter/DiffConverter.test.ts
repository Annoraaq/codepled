import { Command, CommandType, DiffCommandType } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

describe("DiffConverter", () => {
  let diffConverter: DiffConverter;
  beforeEach(() => {
    diffConverter = new DiffConverter();
  });

  it("converts skips for fast forward", () => {
    const diff: Diff = [DiffCommandType.SKIP, "hello"];
    const expectedCommands: Command[] = [[CommandType.SKIP, 5]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge inserts for fast forward", () => {
    const diff: Diff = [DiffCommandType.INSERT, "asd"];
    const expectedCommands: Command[] = [[CommandType.INSERT, "asd"]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge deletes for fast forward", () => {
    const diff: Diff = [DiffCommandType.DELETE, "asd"];
    const expectedCommands: Command[] = [[CommandType.DELETE, 3]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge commands for fast forward", () => {
    const diffs: Diff[] = [
      [DiffCommandType.INSERT, "Hello World"],
      [DiffCommandType.SKIP, "Hello"],
      [DiffCommandType.DELETE, "asd"],
      [DiffCommandType.DELETE, "asd"],
    ];
    const expectedCommands: Command[] = [
      [CommandType.INSERT, "Hello World"],
      [CommandType.SKIP, 5],
      [CommandType.DELETE, 3],
      [CommandType.DELETE, 3],
    ];
    expect(diffConverter.createCommandsFastForward(diffs)).toEqual(
      expectedCommands
    );
  });
});
