import { Command, CommandType } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

describe("DiffConverter", () => {
  let diffConverter: DiffConverter;
  beforeEach(() => {
    diffConverter = new DiffConverter();
  });
  it("converts deletes", () => {
    const diff: Diff = [CommandType.DELETE, "hello"];
    const expectedCommands: Command[] = [
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ];
    expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
  });

  it("converts skips", () => {
    const diff: Diff = [CommandType.SKIP, "hello"];
    const expectedCommands: Command[] = [[CommandType.SKIP, 5]];
    expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
  });

  it("converts inserts", () => {
    const diff: Diff = [CommandType.INSERT, "asd"];
    const expectedCommands: Command[] = [
      [CommandType.INSERT, "a"],
      [CommandType.INSERT, "s"],
      [CommandType.INSERT, "d"],
    ];
    expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
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
});
