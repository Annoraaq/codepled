import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { input as input1 } from "./../assets/linked-list/input1";
import { input as input2 } from "./../assets/linked-list/input2";
import { input as input3 } from "./../assets/linked-list/input3";
import { input as input4 } from "./../assets/linked-list/input4";
import { input as input5 } from "./../assets/linked-list/input5";
import { DiffConverter } from "./DiffConverter/DiffConverter";
import { PlayerUi } from "./Player/PlayerUi";
const dmp = new DiffMatchPatch();
const diff1 = dmp.diff_main("", input1);
const diff2 = dmp.diff_main(input1, input2);
const diff3 = dmp.diff_main(input2, input3);
const diff4 = dmp.diff_main(input3, input4);
const diff5 = dmp.diff_main(input4, input5);
const diffConverter = new DiffConverter();

const player = new PlayerUi();
player.setInitialText("");
player.addCommands([
  [
    2,
    {
      message: `A simple approach for a singly linked list is the following data structure:`,
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff1),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      message: `It is a simple list node object that contains data as well as a pointer to the next element in the list. But as simple as this data structure might be the complexity comes with the operations. <br />
     <h3>Insertion</h3>The complexity in both runtime and code depends on where you want to insert an element into the list. It is fairly easy to append an element to the beginning of the list in O(1). If you want to add an element after any node than you can do this in O(1) if you have a pointer to that node. Otherwise you first need to traverse the list to find the node which is only possible in O(n).
    `,
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff2),
  [6, undefined],
  [5, 0],
  [
    2,
    {
      message: `<h2>Random access</h2>
    To access an element at any given index in the list you have to start at the head and follow the list until you reached the specified index. This operation has O(n) time complexity.
    `,
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff3),
  [5, 0],
  [
    2,
    {
      message: `<h2>Find</h2>
    Finding a specific element is similar to accessing a random element. The only difference is that you need to compare the data of the current element with the one you are looking for. The runtime complexity of this operation is O(n).
    `,
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff4),
  [5, 0],
  [
    2,
    {
      message: `<h2>Random removal</h2>
    Removing any element from the list is a combination of finding the element and its predecessor and updating the next pointers. This operations also has a runtime complexity of O(n) caused by the find operation.
    `,
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff5),
]);
player.init();
