import { Command } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";
import { PlayerUi } from "./PlayerUi";

export class Player {
  constructor(private playerUi: PlayerUi = new PlayerUi()) {}

  init() {
    this.playerUi.init();
  }

  setInitialText(initialText: string) {
    this.playerUi.setInitialText(initialText);
  }

  addCommands(commands: Command[]) {
    this.playerUi.addCommands(commands);
  }

  async play() {}
}
