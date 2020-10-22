import { CommandType } from "./../DiffConverter/Commands";
import { CommandController } from "./CommandController";
describe("CommandController", () => {
  let commandController: CommandController;

  beforeEach(() => {
    commandController = new CommandController();
  });

  it("should count command steps", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
    ]);

    expect(commandController.getTotalSteps()).toEqual(8);
  });

  it("should add commands", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
    ]);

    commandController.addCommands([[CommandType.DELETE, 3]]);

    expect(commandController.getTotalSteps()).toEqual(11);
  });

  it("should deliver command for single step", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
    ]);

    expect(commandController.getCommandAtStep(2)).toEqual([
      CommandType.INSERT,
      "c",
    ]);

    expect(commandController.getCommandAtStep(5)).toEqual([
      CommandType.DELETE,
      1,
    ]);

    expect(commandController.getCommandAtStep(8)).toEqual([
      CommandType.SKIP,
      27,
    ]);
  });

  it("should deliver fast forward commands for step index", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
    ]);

    expect(commandController.getFastForwardCommands(0)).toEqual([]);

    expect(commandController.getFastForwardCommands(2)).toEqual([
      [CommandType.INSERT, "ab"],
    ]);

    expect(commandController.getFastForwardCommands(3)).toEqual([
      [CommandType.INSERT, "abc"],
    ]);

    expect(commandController.getFastForwardCommands(10)).toEqual([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "h"],
    ]);

    expect(commandController.getFastForwardCommands(6)).toEqual([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 1],
    ]);

    expect(commandController.getFastForwardCommands(100)).toEqual([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
    ]);
  });

  it("should give correct showText entries", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.SHOW_TEXT, { message: "first text" }],
      [CommandType.DELETE, 3],
      [CommandType.SHOW_TEXT, { message: "second text" }],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
      [CommandType.SHOW_TEXT, { message: "third text" }],
    ]);

    expect(commandController.getTextSteps()).toEqual([
      { content: "first text", stepNo: 6 },
      { content: "second text", stepNo: 10 },
      { content: "third text", stepNo: 17 },
    ]);
  });
});
