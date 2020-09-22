import { Command, Commands } from "./Commands";
import { Diff, DiffConverter } from "./DiffConverter";

let diffConverter: DiffConverter;

beforeEach(() => {
  diffConverter = new DiffConverter();
});

test("converts deletes", () => {
  const diff: Diff = [Commands.DELETE, "hello"];
  const expectedCommands: Command[] = [
    [Commands.DELETE, 1],
    [Commands.DELETE, 1],
    [Commands.DELETE, 1],
    [Commands.DELETE, 1],
    [Commands.DELETE, 1],
  ];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});

test("converts skips", () => {
  const diff: Diff = [Commands.SKIP, "hello"];
  const expectedCommands: Command[] = [[Commands.SKIP, 5]];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});

test("converts inserts", () => {
  const diff: Diff = [Commands.INSERT, "asd"];
  const expectedCommands: Command[] = [
    [Commands.INSERT, "a"],
    [Commands.INSERT, "s"],
    [Commands.INSERT, "d"],
  ];
  expect(diffConverter.createCommands([diff])).toEqual(expectedCommands);
});
