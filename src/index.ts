import { PlayerUi } from "./Player/PlayerUi";
import { commands } from "./codepleds/5-ways-shortest-path";
import "./styles.css";

if (document.querySelector("#codepled")) {
  const player = new PlayerUi();
  player.setInitialText("");
  player.addCommands(commands);
  player.init();

  (function incCounter() {
    if (
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      fetch("https://us-central1-codepled.cloudfunctions.net/incCount");
    }
  })();
}
