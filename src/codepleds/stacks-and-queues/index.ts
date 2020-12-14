import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { input as input1 } from "./input1";
import { input as input2 } from "./input2";
import { input as input3 } from "./input3";
import { input as input4 } from "./input4";
import { input as input5 } from "./input5";
import { input as input6 } from "./input6";
import { input as input7 } from "./input7";
import { DiffConverter } from "../../DiffConverter/DiffConverter";
import { Command, CommandType } from "../../DiffConverter/Commands";
import { formatDiagnosticsWithColorAndContext } from "typescript";

const dmp = new DiffMatchPatch();
const diff1 = dmp.diff_main("", input1);
const diff2 = dmp.diff_main("", input2);
const diff3 = dmp.diff_main("", input3);
const diff4 = dmp.diff_main(input3, input4);
const diff5 = dmp.diff_main(input4, input5);
const diff6 = dmp.diff_main(input5, input6);
const diff7 = dmp.diff_main(input6, input7);
const diffConverter = new DiffConverter();

export const commands: Command[] = [
  [
    CommandType.SHOW_TEXT,
    {
      title: "Introduction",
      message:
        "<h1>Basic Interview Data Structures in JavaScript: Stacks and Queues</h1>" +
        "<p>Stacks and queues are commonly used in interview questions, and certain problems can be solved very efficiently by using them. Two very famous algorithms that rely on stacks and queues are depth-first search and breadth-first search, both used to traverse a graph.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Stacks",
      message:
        "<h2>Stacks</h2>" +
        "<p>A stack is a so-called last in first out (lifo) data structure that works like a pile of plates. You can easily take the plate on top of the pile, but if you want to take a plate from the bottom, you first have to remove all of the plates on top of it.</p>" +
        "<p>As in my previous article, I will give you the run-time complexity for the following operations:</p>" +
        "<ul>" +
        "<li><strong>Insertion</strong> (push): O(1)</li>" +
        "<li><strong>Random access</strong> (access any element): O(n)<sup>*</sup></li>" +
        "<li><strong>Access first</strong> (peek — access most recently added element): O(1)</li>" +
        "<li><strong>Find</strong> (find a specific element): O(n)</li>" +
        "<li><strong>Random removal</strong> (remove any element): O(n)</li>" +
        "<li><strong>Remove first</strong> (pop — remove most recently added element): O(1)</li>" +
        "</ul>" +
        "<p><strong>Note:</strong> If you use JavaScript arrays as a stack, random access can be done in O(1).</p>" +
        "<p>The important operations for a stack are <strong>insert (push)</strong>, <strong>remove first (pop)</strong>, and <strong>access first (peek)</strong>. These are the efficient operations of a stack. If you find yourself using different operations a lot, a stack is probably the wrong data structure for your purpose.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Stacks in JavaScript",
      level: 2,
      message:
        "<h3>Stacks in JavaScript</h3>" +
        "<p>JavaScript comes with dynamic arrays out of the box. These can be used as a stack very easily:</p>" +
        "<p>Note that since we are using a JS array, we can access any element within O(1) and not only the last one.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff1),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Queues",
      message:
        "<h2>Queues</h2>" +
        "<p>A queue is a so-called first in first out (fifo) data structure that works like a queue in front of a cinema. The person that arrives at the cinema first will be the first one to get a ticket. On the other hand, the person last arriving will also be the last person to receive a ticket.</p>" +
        "<p>As in my previous article, I will give you the run-time complexity for the following operations:</p>" +
        "<ul>" +
        "<li><strong>Insertion</strong> (enqueue): O(1)</li>" +
        "<li><strong>Random access</strong> (access any element): O(n)</li>" +
        "<li><strong>Access last</strong> (access least recently added element): O(1)</li>" +
        "<li><strong>Find</strong> (find a specific element): O(n)</li>" +
        "<li><strong>Random removal</strong> (remove any element): O(n)</li>" +
        "<li><strong>Remove last</strong> (dequeue — remove least recently added element): O(1)</li>" +
        "</ul>" +
        "<p>The essential and efficient operations for a queue are <strong>insert (enqueue)</strong>, <strong>remove last (dequeue)</strong>, and <strong>access last (peek)</strong>. Similar to stacks, you shouldn’t use this data structure if you don’t need the mentioned operations.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Queues in JavaScript",
      level: 2,
      message:
        "<h3>Queues in JavaScript</h3>" +
        "<p>You could implement a queue with a JavaScript array as follows.</p>",
      pause: false,
    },
  ],
  [CommandType.REPLACE_ALL, ""],
  ...diffConverter.createCommandsFastForward(diff2),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      toc: false,
      message:
        "<p>However, there is one downside to this solution: shift takes O(n) in the worst case because all array elements have to be copied over by one position.</p>" +
        "<p>There are several third-party solutions implementing a queue in an efficient way. However, you can’t use them during an interview. You should tell your interviewer you know about this limitation in JavaScript and clarify if you can simply use arrays as a queue, pretending that shift takes only O(1). If that’s not an option, you can implement a queue (and also a stack) efficiently using a linked list.</p>" +
        "<p>However, you can also implement a queue right from scratch. You need the following data structure for this.</p>",
      pause: false,
    },
  ],
  [CommandType.REPLACE_ALL, ""],
  ...diffConverter.createCommandsFastForward(diff3),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      toc: false,
      message: "<p>We embed this in a queue factory function.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff4),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      toc: false,
      message:
        "<p>We need this factory function in order to have a closure that holds head and tail of the queue.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Insertion (enqueue)",
      level: 2,
      message:
        "<h3>Insertion (enqueue)</h3>" +
        "<p>To insert a new element to the queue, you simply need to attach it as the new head of our list-like data structure.</p>",
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff5),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Remove last (dequeue)",
      level: 2,
      message:
        "<h3>Remove last (dequeue)</h3>" +
        "<p>Removing the last recently added element from a queue can be done by returning and removing the tail of the list.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff6),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      toc: false,
      message:
        "<p>It is fairly straightforward, but we have to be careful with null pointers.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Access last (peek)",
      level: 2,
      message:
        "<h3>Access last (peek)</h3>" +
        "<p>To access the last recently used element of the queue, we need to simply return the tail of our list. We only need to account for the tail being null.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff7),
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
];
