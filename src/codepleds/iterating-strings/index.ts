import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { input as input1 } from "./input1";
import { input as input2 } from "./input2";
import { input as input3 } from "./input3";
import { input as input4 } from "./input4";
import { input as input5 } from "./input5";
import { input as input6 } from "./input6";
import { input as input7 } from "./input7";
import { DiffConverter } from "../../DiffConverter/DiffConverter";
import { Command } from "../../DiffConverter/Commands";

const dmp = new DiffMatchPatch();
const diff1 = dmp.diff_main("", input1);
const diff2 = dmp.diff_main(input1, input2);
const diff3 = dmp.diff_main(input2, input3);
const diff4 = dmp.diff_main("", input4);
const diff5 = dmp.diff_main(input4, input5);
const diff6 = dmp.diff_main(input5, input6);
const diff7 = dmp.diff_main(input6, input7);
const diffConverter = new DiffConverter();

export const commands: Command[] = [
  [
    2,
    {
      title: "Introduction",
      message:
        "<h1>How to Iterate Through Strings in JavaScript</h1>" +
        "<p>For many things in JavaScript, there’s not a single way to achieve them. A thing as simple as iterating over each character in a string is one of them. Let’s explore some methods and discuss their upsides and downsides.</p>" +
        "<p>Before we start, we need to come back to a much more basic question.</p>",
      pause: true,
    },
  ],
  [
    2,
    {
      title: "How to Access a Single Character of a String",
      message:
        "<h2>How to Access a Single Character of a String</h2>" +
        "<p>Nowadays with ECMAScript 2015 (ES6), there are two ways of accessing a single character.</p>",
      pause: true,
    },
  ],
  [
    2,
    {
      title: "charAt()",
      level: 2,
      message:
        "<h3>charAt()</h3>" +
        "<p>This method of the string object has been around for some time now and can be seen as the classic approach. It’s supported even in oldest browsers.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff1),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "Bracket notation",
      level: 2,
      message:
        "<h3>Bracket notation</h3>" +
        "<p>The second method is accessing a character via bracket notation.</p>" +
        "<p>This approach has been introduced with ECMAScript 2015 and seems to be more convenient. Furthermore, it allows you to treat a string like an array-like structure. This enables a couple of iteration methods, as we’ll see soon.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff2),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "Which method is preferable?",
      level: 2,
      message:
        "<h3>Which method is preferable?</h3>" +
        "<p>A downside of <strong>charAt()</strong> might be readability. However, it’s compatible with old browsers like IE7. Another argument against bracket notation is it can’t be used for assigning a character.</p>",
      pause: true,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff3),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      toc: false,
      message:
        "<p>This can be confusing, especially because there won’t be a warning.</p>" +
        "<p>In my personal opinion, bracket notation is more convenient to write and read. Compatibility issues should be solved by transpiling instead of not using the desired feature.</p>",
      pause: true,
    },
  ],
  [
    2,
    {
      title: "Popular Ways to Iterate Strings",
      message:
        "<h2>Popular Ways to Iterate Strings</h2>" +
        "<p>The following list of techniques doesn’t claim to be complete. It’ll show some of the most frequently used approaches.</p>" +
        "<p>In order to demonstrate the processing of the single characters of our string, we’ll use the following function.</p>",
      pause: false,
    },
  ],
  [7, ""],
  ...diffConverter.createCommandsFastForward(diff4),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "for loop",
      level: 2,
      message:
        "<h3>for loop</h3>" +
        "<p>The classic approach — a simple for loop. While a bit cumbersome to write and read, this is the fastest known method.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff5),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "for…of",
      level: 2,
      message:
        "<h3>for…of</h3>" +
        "<p>This statement was introduced with ECMAScript 2015 and can be used with iterable objects. It’s more convenient to write than a classic for loop if you don’t care about the current index in the loop body.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff6),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "forEach()",
      level: 2,
      message:
        "<h3>forEach()</h3>" +
        "<p>This is the functional version of a <strong>for</strong> loop. Many people prefer it over <strong>for…of</strong> and <strong>for</strong> loops because it’s a higher-order function, and it helps to stick to a programming style that leverages immutability (see the Airbnb style guide in the references).</p>" +
        "<p>One downside is you need to convert the string into an array before iterating. If performance really matters in your use case (and it usually doesn’t), it might not be your first choice.</p>",
      pause: false,
    },
  ],
  ...diffConverter.createCommandsFastForward(diff7),
  [5, 0],
  [6, undefined],
  [
    2,
    {
      title: "Conclusion",
      message:
        "<h2>Conclusion</h2>" +
        "<p>As with many techniques in JavaScript, it’s mainly a matter of taste when deciding which one to use. However, be aware of the speed impacts of the string-to-array conversion as well as the compatibility issues of the bracket notation.</p>" +
        "<p>I advise you to pick the most readable technique and only care for speed optimization if you have a performance problem and to solve compatibility issues through transpiling.</p>",
      pause: true,
    },
  ],
  [
    2,
    {
      title: "References",
      message:
        "<h2>References</h2>" +
        "<ul>" +
        '<li><a href="https://github.com/airbnb/javascript#iterators-and-generators">Airbnb JavaScript Style Guide: Iterators and Generators</a></li>' +
        '<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Character_access">MDN Web Docs: Character access</a></li>' +
        "</ul>",
      pause: true,
    },
  ],
];
