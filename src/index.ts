import { displayText } from "./displayText";
import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { input } from "./input";
import { transformed } from "./transformed";
import { DiffConverter } from "./DiffConverter/DiffConverter";
import { PlayerUi } from "./Player/PlayerUi";
const dmp = new DiffMatchPatch();
const diff = dmp.diff_main(input, transformed);
const diffConverter = new DiffConverter();

const player = new PlayerUi();
player.setInitialText(input);
// player.addCommands([[4, 23]]);
player.addCommands(diffConverter.createCommandsFastForward(diff));
// player.addCommands([
//   // [3, { start: 3, end: 4 }],
//   // [2, displayText],
// ]);
player.init();
