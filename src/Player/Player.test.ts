import { TestUtils } from "./../Utils/TestUtils";
import { CommandType } from "../DiffConverter/Commands";
import { PlayerEventType, Player } from "./Player";

TestUtils.fixCustomEventConstructor();

describe("Player", () => {
  let player: Player;
  let dispatchEventSpy = jest.spyOn(global, "dispatchEvent");

  beforeEach(() => {
    dispatchEventSpy.mockClear();
  });
  it("should set current command index", () => {
    player.addCommands([
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ]);
    player.setCurrentStepIndex(4);
    expect(player.getCurrentStepIndex()).toEqual(4);
  });
  let playerUiMock = {
    init: jest.fn(),
    setInitialText: jest.fn(),
    addCommands: jest.fn(),
    play: jest.fn(),
  };

  beforeEach(() => {
    playerUiMock.init.mockReset();
    playerUiMock.setInitialText.mockReset();
    playerUiMock.addCommands.mockReset();
    playerUiMock.play.mockReset();
    player = new Player();
  });

  it("should detect last command", () => {
    player.addCommands([
      [CommandType.SKIP, 1],
      [CommandType.SKIP, 1],
    ]);
    player.setCurrentStepIndex(0);
    expect(player.isLastCommand()).toEqual(false);
    player.setCurrentStepIndex(1);
    expect(player.isLastCommand()).toEqual(true);
  });

  it("processes multiple delete commands", async () => {
    const expectedScrollToEvent = new CustomEvent(PlayerEventType.SCROLL_TO, {
      detail: {
        line: 1,
      },
    });

    player.setInitialText("Hello\nWorld!\nLast line");
    player.addCommands([
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ]);
    player.reset();
    await player.play();

    expect(player.getText()).toEqual("World!\nLast line");
    expect(player.getCursor()).toEqual(0);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedScrollToEvent);
  });

  it("processes multiple skip commands and jumps into the correct line for delete", async () => {
    const expectedScrollToEvent = new CustomEvent(PlayerEventType.SCROLL_TO, {
      detail: {
        line: 2,
      },
    });

    player.setInitialText("Hello\nWorld!\nLast line");
    player.addCommands([[CommandType.SKIP, 10]]);
    player.reset();
    await player.play();

    expect(player.getText()).toEqual("Hello\nWorld!\nLast line");
    expect(player.getCursor()).toEqual(10);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedScrollToEvent);
  });

  it("processes insert commands", async () => {
    const expectedScrollToEvent = new CustomEvent(PlayerEventType.SCROLL_TO, {
      detail: {
        line: 2,
      },
    });
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.INSERT, "w"],
      [CommandType.INSERT, "o"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "l"],
      [CommandType.INSERT, "d"],
    ]);
    player.reset();
    await player.play();

    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedScrollToEvent);
  });

  it("processes show_text command", async () => {
    const expectedShowTextEvent = new CustomEvent(PlayerEventType.SHOW_TEXT, {
      detail: {
        message: "Text to be shown",
      },
    });
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SHOW_TEXT, { message: "Text to be shown" }],
      [CommandType.INSERT, "W"],
    ]);
    player.reset();
    await player.play();
    expect(player.getText()).toEqual("WHello\n");
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedShowTextEvent);
  });

  it("processes show_text command and pause", async () => {
    const expectedShowTextEvent = new CustomEvent(PlayerEventType.SHOW_TEXT, {
      detail: {
        message: "Text to be shown",
      },
    });
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SHOW_TEXT, { message: "Text to be shown", pause: true }],
      [CommandType.INSERT, "W"],
    ]);
    player.reset();
    await player.play();
    expect(player.getText()).toEqual("Hello\n");
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedShowTextEvent);
  });

  it("should increase speed ", async () => {
    player.reset();
    await player.play();

    expect(player.getSpeed()).toEqual(1);
    player.increaseSpeed();
    expect(player.getSpeed()).toEqual(2);
    player.increaseSpeed();
    expect(player.getSpeed()).toEqual(3);
    player.increaseSpeed();
    expect(player.getSpeed()).toEqual(1);
  });

  it("processes set_cursor commands", async () => {
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.SET_CURSOR, 0],
    ]);
    player.reset();
    await player.play();

    expect(player.getText()).toEqual("Hello\n");
    expect(player.getCursor()).toEqual(0);
  });

  it("should play on playPause if paused", () => {
    player.reset();
    player.playPause();

    expect(player.isPaused()).toEqual(false);
  });

  it("should pause on playPause if playing", () => {
    player.reset();
    player["isPlaying"] = true;
    player.playPause();

    expect(player.isPaused()).toEqual(true);
  });

  it("should get command length", async () => {
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.INSERT, "w"],
      [CommandType.INSERT, "o"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "l"],
      [CommandType.INSERT, "d"],
    ]);
    player.reset();

    expect(player.getCommandCount()).toEqual(6);
  });

  it("should forward to", async () => {
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.INSERT, "world"],
      [CommandType.DELETE, 3],
    ]);
    player.reset();

    player.forwardTo(0);
    expect(player.getText()).toEqual("Hello\n");
    expect(player.getCursor()).toEqual(0);

    player.forwardTo(1);
    expect(player.getText()).toEqual("Hello\n");
    expect(player.getCursor()).toEqual(6);

    player.forwardTo(2);
    expect(player.getText()).toEqual("Hello\nw");
    expect(player.getCursor()).toEqual(7);

    player.forwardTo(3);
    expect(player.getText()).toEqual("Hello\nwo");
    expect(player.getCursor()).toEqual(8);

    player.forwardTo(9);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);

    player.forwardTo(10);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);
  });

  it("should set cursor when forward to", async () => {
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.INSERT, "world"],
      [CommandType.SET_CURSOR, 2],
      [CommandType.INSERT, "ll"],
    ]);
    player.reset();

    player.forwardTo(7);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(2);
  });

  it("should forward to show_text", async () => {
    const expectedShowTextEvent = new CustomEvent(PlayerEventType.SHOW_TEXT, {
      detail: {
        message: "",
      },
    });
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.SHOW_TEXT, { message: "hello" }],
      [CommandType.INSERT, "world"],
      [CommandType.SHOW_TEXT, { message: "world" }],
      [CommandType.DELETE, 3],
    ]);
    player.reset();

    player.forwardTo(2);
    expect(player.getCursor()).toEqual(6);
    expect(player.getTexts()).toEqual(["hello"]);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedShowTextEvent);
    dispatchEventSpy.mockClear();

    player.forwardTo(8);
    expect(player.getCursor()).toEqual(11);
    expect(player.getTexts()).toEqual(["hello", "world"]);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedShowTextEvent);
  });

  it("processes pause command", async () => {
    const expectedEvent = new CustomEvent(PlayerEventType.PAUSE);
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.PAUSE, undefined],
      [CommandType.INSERT, "W"],
    ]);
    player.reset();
    await player.play();
    expect(player.getText()).toEqual("Hello\n");
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedEvent);
  });

  it("should keep a text stack", async () => {
    player.addCommands([
      [CommandType.SHOW_TEXT, { message: "Hello" }],
      [CommandType.SHOW_TEXT, { message: "World" }],
    ]);
    player.reset();
    expect(player.getTexts()).toEqual([]);
    await player.play();

    expect(player.getTexts()).toEqual(["Hello", "World"]);

    player.reset();
    expect(player.getTexts()).toEqual([]);
  });
});
