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

  it("should reset", async () => {
    player.setInitialText("Hello");
    player.addCommands([
      [CommandType.INSERT, "zz"],
      [CommandType.SHOW_TEXT, { message: "abc" }],
      [CommandType.INSERT, "zz"],
      [CommandType.HIGHLIGHT_LINES, { start: 3, end: 4 }],
    ]);
    await player.play();
    expect(player.getCursor()).toEqual(4);
    expect(player.getText()).toEqual("zzzzHello");
    expect(player.getTexts()).toEqual([{ text: "abc", stepIndex: 2 }]);
    expect(player.getHighlightedLines()).toEqual({ start: 3, end: 4 });
    expect(player.getCurrentStepIndex()).toEqual(4);
    expect([...player.getLinesTouchedByInsert()]).toEqual([1]);

    player.reset();
    expect(player.getCursor()).toEqual(0);
    expect(player.getText()).toEqual("Hello");
    expect(player.getTexts()).toEqual([]);
    expect(player.getHighlightedLines()).toEqual({ start: -1, end: -2 });
    expect(player.getCurrentStepIndex()).toEqual(0);
    expect([...player.getLinesTouchedByInsert()]).toEqual([]);
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
    expect([...player.getLinesTouchedByInsert()]).toEqual([2]);
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

  it("resets linesTouchedByInsert after show_text command", async () => {
    player.addCommands([
      [CommandType.INSERT, "W"],
      [CommandType.SHOW_TEXT, { message: "Text to be shown" }],
    ]);
    player.reset();
    await player.play();
    expect([...player.getLinesTouchedByInsert()]).toEqual([]);
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
    expect([...player.getLinesTouchedByInsert()]).toEqual([]);

    player.forwardTo(1);
    expect(player.getText()).toEqual("Hello\n");
    expect(player.getCursor()).toEqual(6);
    expect([...player.getLinesTouchedByInsert()]).toEqual([]);

    player.forwardTo(2);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);
    expect([...player.getLinesTouchedByInsert()]).toEqual([2]);

    player.forwardTo(5);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);
    expect([...player.getLinesTouchedByInsert()]).toEqual([2]);

    player.forwardTo(10);
    expect(player.getText()).toEqual("Hello\nworld");
    expect(player.getCursor()).toEqual(11);
    expect([...player.getLinesTouchedByInsert()]).toEqual([2]);
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

    player.forwardTo(3);
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
      [CommandType.INSERT, "wo.rld"],
      [CommandType.SHOW_TEXT, { message: "world" }],
      [CommandType.DELETE, 3],
      [CommandType.SHOW_TEXT, { message: "world2" }],
      [CommandType.SET_CURSOR, 3],
      [CommandType.SHOW_TEXT, { message: "world3" }],
      [CommandType.PAUSE, undefined],
      [CommandType.SHOW_TEXT, { message: "world4" }],
    ]);
    player.reset();

    player.forwardTo(2);
    expect(player.getCursor()).toEqual(6);
    expect(player.getTexts()).toEqual([{ text: "hello", stepIndex: 2 }]);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedShowTextEvent);
    dispatchEventSpy.mockClear();

    player.forwardTo(6);
    expect(player.getCursor()).toEqual(12);
    expect(player.getTexts()).toEqual([
      { text: "hello", stepIndex: 2 },
      { text: "world", stepIndex: 6 },
    ]);

    player.forwardTo(8);
    expect(player.getCursor()).toEqual(12);
    expect(player.getTexts()).toEqual(
      expect.arrayContaining([{ text: "world2", stepIndex: 8 }])
    );

    player.forwardTo(10);
    expect(player.getCursor()).toEqual(3);
    expect(player.getTexts()).toEqual(
      expect.arrayContaining([{ text: "world3", stepIndex: 10 }])
    );

    player.forwardTo(18);
    expect(player.getCursor()).toEqual(3);
    expect(player.getTexts()).toEqual(
      expect.arrayContaining([{ text: "world4", stepIndex: 12 }])
    );
  });

  it("should reset linesTouchedByInsert after show_text when forwarding", async () => {
    player.addCommands([
      [CommandType.INSERT, "hello"],
      [CommandType.SHOW_TEXT, { message: "world" }],
    ]);
    player.reset();

    player.forwardTo(2);
    expect([...player.getLinesTouchedByInsert()]).toEqual([]);
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

    expect(player.getTexts()).toEqual([
      { text: "Hello", stepIndex: 1 },
      { text: "World", stepIndex: 2 },
    ]);

    player.reset();
    expect(player.getTexts()).toEqual([]);
  });
});
