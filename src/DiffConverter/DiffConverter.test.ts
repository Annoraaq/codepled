import { Command, CommandType } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

let diffConverter: DiffConverter;

beforeEach(() => {
  diffConverter = new DiffConverter();
});

test("converts deletes", () => {
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

test("converts skips", () => {
  const diff: Diff = [CommandType.SKIP, "hello"];
  const expectedCommands: Command[] = [[CommandType.SKIP, 5]];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});

test("converts inserts", () => {
  const diff: Diff = [CommandType.INSERT, "asd"];
  const expectedCommands: Command[] = [
    [CommandType.INSERT, "a"],
    [CommandType.INSERT, "s"],
    [CommandType.INSERT, "d"],
  ];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});
