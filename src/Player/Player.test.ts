import { CommandType } from "../DiffConverter/Commands";
import { Player } from "./Player";

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
    player.setCurrentCommandIndex(4);
    expect(player.getCurrentCommandIndex()).toEqual(4);
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
    player.setCurrentCommandIndex(0);
    expect(player.isLastCommand()).toEqual(false);
    player.setCurrentCommandIndex(1);
    expect(player.isLastCommand()).toEqual(true);
  });

  it("processes multiple delete commands", async () => {
    var expectedScrollToEvent = new CustomEvent("scrollTo", {
      detail: {
        line: 0,
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
    dispatchEventSpy.mockClear();
    await player.play();
    expect(player.getText()).toEqual("World!\nLast line");
    expect(player.getCursor()).toEqual(0);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expectedScrollToEvent);
  });
});
