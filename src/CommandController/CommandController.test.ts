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

    expect(commandController.getTotalSteps()).toEqual(6);
  });

  it("should add commands", () => {
    commandController.setCommands([
      [CommandType.INSERT, "abcde"],
      [CommandType.DELETE, 3],
    ]);

    commandController.addCommands([[CommandType.DELETE, 3]]);

    expect(commandController.getTotalSteps()).toEqual(7);
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

    expect(commandController.getCommandAtStep(5)).toEqual([
      CommandType.DELETE,
      1,
    ]);

    expect(commandController.getCommandAtStep(6)).toEqual([
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
      [CommandType.INSERT, "ab"],
    ]);

    expect(commandController.getFastForwardCommands(2)).toEqual([
      [CommandType.INSERT, "ab."],
    ]);

    expect(commandController.getFastForwardCommands(3)).toEqual([
      [CommandType.INSERT, "ab.cde"],
    ]);

    expect(commandController.getFastForwardCommands(4)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 1],
    ]);

    expect(commandController.getFastForwardCommands(5)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 2],
    ]);

    expect(commandController.getFastForwardCommands(6)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
    ]);

    expect(commandController.getFastForwardCommands(7)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
    ]);

    expect(commandController.getFastForwardCommands(8)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
    ]);

    expect(commandController.getFastForwardCommands(100)).toEqual([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.DELETE, 3],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
    ]);
  });

  it("should give correct showText entries", () => {
    commandController.setCommands([
      [CommandType.INSERT, "ab.cde"],
      [CommandType.SHOW_TEXT, { message: "first text" }],
      [CommandType.DELETE, 3],
      [CommandType.SHOW_TEXT, { message: "second text" }],
      [CommandType.SKIP, 27],
      [CommandType.INSERT, "hello"],
      [CommandType.SHOW_TEXT, { message: "third text" }],
    ]);

    expect(commandController.getTextSteps()).toEqual([
      { content: "first text", stepNo: 4 },
      { content: "second text", stepNo: 8 },
      { content: "third text", stepNo: 11 },
    ]);
  });
});
