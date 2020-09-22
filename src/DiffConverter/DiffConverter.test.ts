import { Command } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

let diffConverter: DiffConverter;

beforeEach(() => {
  diffConverter = new DiffConverter();
});

test("converts deletes", () => {
  const diff: Diff = [diffConverter.CMD_DELETE, "hello"];
  const expectedCommands: Command[] = [
    [diffConverter.CMD_DELETE, 1],
    [diffConverter.CMD_DELETE, 1],
    [diffConverter.CMD_DELETE, 1],
    [diffConverter.CMD_DELETE, 1],
    [diffConverter.CMD_DELETE, 1],
  ];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});

test("converts skips", () => {
  const diff: Diff = [diffConverter.CMD_SKIP, "hello"];
  const expectedCommands: Command[] = [[diffConverter.CMD_SKIP, 5]];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});

test("converts inserts", () => {
  const diff: Diff = [diffConverter.CMD_INSERT, "asd"];
  const expectedCommands: Command[] = [
    [diffConverter.CMD_INSERT, "a"],
    [diffConverter.CMD_INSERT, "s"],
    [diffConverter.CMD_INSERT, "d"],
  ];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});
