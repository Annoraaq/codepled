import { Command, CommandType } from "./../DiffConverter/Commands";
import { Player } from "./Player";

describe("Player", () => {
  let player: Player;
  let playerUiMock = {
    init: jest.fn(),
    setInitialText: jest.fn(),
    addCommands: jest.fn(),
  };

  beforeEach(() => {
    playerUiMock.init.mockReset();
    playerUiMock.setInitialText.mockReset();
    playerUiMock.addCommands.mockReset();
    player = new Player(<any>playerUiMock);
  });

  it("should init", () => {
    player.init();
    expect(playerUiMock.init).toHaveBeenCalledTimes(1);
  });

  it("should set initil text", () => {
    player.setInitialText("initial text");
    expect(playerUiMock.setInitialText).toHaveBeenCalledWith("initial text");
  });

  it("should add commands", () => {
    const commands: Command[] = [[CommandType.DELETE, 1]];
    player.addCommands(commands);
    expect(playerUiMock.addCommands).toHaveBeenCalledWith(commands);
  });
});
