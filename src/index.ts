import { PlayerUi } from "./Player/PlayerUi";
import { commands } from "../codepleds/stacks-and-queues";
import "./styles.css";

const player = new PlayerUi("#my-codepled");
player.init(commands, "Stacks and Queues");

(function incCounter() {
  if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    fetch("https://us-central1-codepled.cloudfunctions.net/incCount");
  }
})();
