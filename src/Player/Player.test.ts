import { CommandType } from "../DiffConverter/Commands";
import { Player } from "./Player";

describe("Player", () => {
  let player: Player;
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

  it("should play", () => {
    // player.play();
  });
});
