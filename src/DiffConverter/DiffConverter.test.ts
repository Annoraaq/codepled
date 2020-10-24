import { Command, CommandType } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

describe("DiffConverter", () => {
  let diffConverter: DiffConverter;
  beforeEach(() => {
    diffConverter = new DiffConverter();
  });

  it("converts skips for fast forward", () => {
    const diff: Diff = [CommandType.SKIP, "hello"];
    const expectedCommands: Command[] = [[CommandType.SKIP, 5]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge inserts for fast forward", () => {
    const diff: Diff = [CommandType.INSERT, "asd"];
    const expectedCommands: Command[] = [[CommandType.INSERT, "asd"]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge deletes for fast forward", () => {
    const diff: Diff = [CommandType.DELETE, "asd"];
    const expectedCommands: Command[] = [[CommandType.DELETE, 3]];
    expect(diffConverter.createCommandsFastForward([diff])).toEqual(
      expectedCommands
    );
  });

  it("should merge commands for fast forward", () => {
    const diffs: Diff[] = [
      [CommandType.INSERT, "Hello World"],
      [CommandType.SKIP, "Hello"],
      [CommandType.DELETE, "asd"],
      [CommandType.DELETE, "asd"],
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
