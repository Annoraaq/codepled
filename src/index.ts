import { Player } from "./Player/Player";
import { displayText } from "./displayText";
import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { input } from "./input";
import { transformed } from "./transformed";
import { DiffConverter } from "./DiffConverter/DiffConverter";
const dmp = new DiffMatchPatch();
const diff = dmp.diff_main(input, transformed);
const diffConverter = new DiffConverter();

const player = new Player();
player.setInitialText(input);
player.init();
player.addCommands(diffConverter.createCommands(diff));
player.addCommands([
  [3, { start: 3, end: 4 }],
  [2, displayText],
]);
