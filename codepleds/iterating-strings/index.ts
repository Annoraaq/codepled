import { input as input1 } from "./input1";
import { input as input2 } from "./input2";
import { input as input3 } from "./input3";
import { input as input4 } from "./input4";
import { input as input5 } from "./input5";
import { input as input6 } from "./input6";
import { input as input7 } from "./input7";
import { Command, CommandType } from "../../src/DiffConverter/Commands";

export const commands: Command[] = [
  [
    CommandType.SHOW_TEXT,
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
    CommandType.SHOW_TEXT,
    {
      title: "How to Access a Single Character of a String",
      message:
        "<h2>How to Access a Single Character of a String</h2>" +
        "<p>Nowadays with ECMAScript 2015 (ES6), there are two ways of accessing a single character.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "charAt()",
      level: 2,
      message:
        "<h3>charAt()</h3>" +
        "<p>This method of the string object has been around for some time now and can be seen as the classic approach. It’s supported even in oldest browsers.</p>",
      pause: false,
    },
  ],
  [CommandType.CREATE_DIFF, { source: "", target: input1 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
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
  [CommandType.CREATE_DIFF, { source: input1, target: input2 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Which method is preferable?",
      level: 2,
      message:
        "<h3>Which method is preferable?</h3>" +
        "<p>A downside of <strong>charAt()</strong> might be readability. However, it’s compatible with old browsers like IE7. Another argument against bracket notation is it can’t be used for assigning a character.</p>",
      pause: true,
    },
  ],
  [CommandType.CREATE_DIFF, { source: input2, target: input3 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      toc: false,
      message:
        "<p>This can be confusing, especially because there won’t be a warning.</p>" +
        "<p>In my personal opinion, bracket notation is more convenient to write and read. Compatibility issues should be solved by transpiling instead of not using the desired feature.</p>",
      pause: true,
    },
  ],
  [
    CommandType.SHOW_TEXT,
    {
      title: "Popular Ways to Iterate Strings",
      message:
        "<h2>Popular Ways to Iterate Strings</h2>" +
        "<p>The following list of techniques doesn’t claim to be complete. It’ll show some of the most frequently used approaches.</p>" +
        "<p>In order to demonstrate the processing of the single characters of our string, we’ll use the following function.</p>",
      pause: false,
    },
  ],
  [CommandType.REPLACE_ALL, ""],
  [CommandType.CREATE_DIFF, { source: "", target: input4 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      title: "for loop",
      level: 2,
      message:
        "<h3>for loop</h3>" +
        "<p>The classic approach — a simple for loop. While a bit cumbersome to write and read, this is the fastest known method.</p>",
      pause: false,
    },
  ],
  [CommandType.CREATE_DIFF, { source: input4, target: input5 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
    {
      title: "for…of",
      level: 2,
      message:
        "<h3>for…of</h3>" +
        "<p>This statement was introduced with ECMAScript 2015 and can be used with iterable objects. It’s more convenient to write than a classic for loop if you don’t care about the current index in the loop body.</p>",
      pause: false,
    },
  ],
  [CommandType.CREATE_DIFF, { source: input5, target: input6 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
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
  [CommandType.CREATE_DIFF, { source: input6, target: input7 }],
  [CommandType.SET_CURSOR, 0],
  [CommandType.PAUSE, undefined],
  [
    CommandType.SHOW_TEXT,
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
    CommandType.SHOW_TEXT,
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
