import { CommandType } from "./../DiffConverter/Commands";
import { CommandController } from "./CommandController";
describe("CommandController", () => {
  let commandController: CommandController;

  beforeEach(() => {
    commandController = new CommandController();
  });

  it("should count command steps", () => {
    commandController.setCommands([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
    ]);

    expect(commandController.getTotalSteps()).toEqual(4);
  });

  it("should add commands", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
    ]);

    commandController.addCommands([[CommandType.DELETE, 3]]);

    expect(commandController.getTotalSteps()).toEqual(3);
  });

  it("should deliver command for single step", () => {
    commandController.setCommands([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
    ]);

    expect(commandController.getCommandAtStep(2)).toEqual([
      CommandType.INSERT,
      "cde",
    ]);

    expect(commandController.getCommandAtStep(3)).toEqual([
      CommandType.DELETE,
      3,
    ]);

    expect(commandController.getCommandAtStep(4)).toEqual([
      CommandType.SKIP,
      27,
    ]);
  });

  it("should deliver fast forward commands for step index", () => {
    commandController.setCommands([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
    ]);

    expect(commandController.getFastForwardCommands(0)).toEqual([]);

    expect(commandController.getFastForwardCommands(1)).toEqual([
      { type: CommandType.INSERT, payload: "ab", steps: 1 },
    ]);

    expect(commandController.getFastForwardCommands(2)).toEqual([
      { type: CommandType.INSERT, payload: "ab.", steps: 2 },
    ]);

    expect(commandController.getFastForwardCommands(3)).toEqual([
      { type: CommandType.INSERT, payload: "ab.cde", steps: 3 },
    ]);

    expect(commandController.getFastForwardCommands(4)).toEqual([
      { type: CommandType.INSERT, payload: "ab.cde", steps: 3 },
      { type: CommandType.DELETE, payload: 3, steps: 1 },
    ]);

    expect(commandController.getFastForwardCommands(5)).toEqual([
      { type: CommandType.INSERT, payload: "ab.cde", steps: 3 },
      { type: CommandType.DELETE, payload: 3, steps: 1 },
      { type: CommandType.SKIP, payload: 27, steps: 1 },
    ]);

    expect(commandController.getFastForwardCommands(6)).toEqual([
      { type: CommandType.INSERT, payload: "ab.cde", steps: 3 },
      { type: CommandType.DELETE, payload: 3, steps: 1 },
      { type: CommandType.SKIP, payload: 27, steps: 1 },
      { type: CommandType.INSERT, payload: "hello", steps: 1 },
    ]);

    expect(commandController.getFastForwardCommands(100)).toEqual([
      { type: CommandType.INSERT, payload: "ab.cde", steps: 3 },
      { type: CommandType.DELETE, payload: 3, steps: 1 },
      { type: CommandType.SKIP, payload: 27, steps: 1 },
      { type: CommandType.INSERT, payload: "hello", steps: 1 },
    ]);
  });

  it("should give correct showText entries", () => {
    commandController.setCommands([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.SHOW_TEXT, { message: "first text", level: 1, toc: true }],
      [CommandType.DELETE, 3],
      [CommandType.SHOW_TEXT, { message: "second text", title: "some title" }],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
      [CommandType.SHOW_TEXT, { message: "third text", level: 2 }],
      [CommandType.SHOW_TEXT, { message: "fourth text", toc: false }],
    ]);

    expect(commandController.getTextSteps()).toEqual([
      { content: "first text", stepNo: 4, level: 1, toc: true },
      { content: "second text", stepNo: 6, title: "some title", toc: true },
      { content: "third text", stepNo: 9, level: 2, toc: true },
      { content: "fourth text", stepNo: 10, toc: false },
    ]);
  });
});
