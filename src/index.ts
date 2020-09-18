import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import * as hljs from "highlight.js";
import { input } from "./input";
import { transformed } from "./transformed";
import { displayText } from "./displayText";

(function () {
  const SPEED = { 3: 10, 2: 50, 1: 100 };
  const CMD_DELETE = -1;
  const CMD_INSERT = 1;
  const CMD_SKIP = 0;
  const CMD_SHOW_TEXT = 2;
  const CMD_HIGHLIGHT_LINES = 3;
  const CMD_SCROLL_TO = 4;
  const cursorText = '<span class="cursor"></span>';
  const dmp = new DiffMatchPatch();
  const diff = dmp.diff_main(input, transformed);
  const ta = document.querySelector("#codepled");
  const playButton = document.querySelector(".play");
  const slider = document.querySelector(".slider");
  const speedButton = document.querySelector(".speed");
  const textbox = document.querySelector(".textbox-container");
  let highlightedLines = { start: -1, end: -2 };
  const commands = [
    ...createCommands(diff),
    [CMD_HIGHLIGHT_LINES, { start: 3, end: 4 }],
    [2, displayText],
  ];

  let speed = 1;
  let trueText: string;
  let currentCommandIndex = 0;
  let isPlaying = false;
  let wasPlayingOnSliderMove = false;
  let cursor = 0;
  let isBlocked = false;
  let textContinue: string;

  initPlayButton(playButton);
  initSpeedButton(speedButton);
  initSlider(slider);
  initTextbox(textbox);
  init();

  function init() {
    cursor = 0;
    setText(ta, input, cursor);
    highlightedLines = { start: -1, end: -2 };
  }

  async function play() {
    if (currentCommandIndex >= commands.length) {
      currentCommandIndex = 0;
    }
    if (currentCommandIndex == 0) {
      init();
    }
    isPlaying = true;

    while (currentCommandIndex < commands.length && isPlaying) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) stop();
      // @ts-ignore
      await sleep(SPEED[speed]);
    }
  }

  // @ts-ignore
  function forwardTo(targetIndex) {
    if (currentCommandIndex == 0) init();

    while (currentCommandIndex < targetIndex) {
      processCommand(commands[currentCommandIndex]);
      setCurrentCommandIndex(currentCommandIndex + 1);
      if (currentCommandIndex >= commands.length) {
        stop();
        break;
      }
    }
  }

  // @ts-ignore
  function processCommand([commandNo, payload]) {
    if (commandNo === CMD_INSERT) {
      const newText =
        trueText.substr(0, cursor) + payload + trueText.substr(cursor);
      cursor += payload.length;
      setText(ta, newText, cursor);
      scrollTo(getCursorLine());
    } else if (commandNo === CMD_DELETE) {
      const newText =
        trueText.substr(0, cursor) + trueText.substr(cursor + payload);
      setText(ta, newText, cursor);
      scrollTo(getCursorLine());
    } else if (commandNo === CMD_SKIP) {
      cursor += payload;
      setText(ta, trueText, cursor);
      scrollTo(getCursorLine());
    } else if (commandNo === CMD_SHOW_TEXT) {
      isPlaying = false;
      const isLastCommand = currentCommandIndex == commands.length - 1;
      disableControls();
      showMessage(payload).then(() => {
        enableControls();
        if (!isLastCommand) {
          play();
        }
      });
    } else if (commandNo === CMD_HIGHLIGHT_LINES) {
      highlightedLines = payload;
      setText(ta, trueText, cursor);
    } else if (commandNo === CMD_SCROLL_TO) {
      scrollTo(payload);
    }
  }

  // @ts-ignore
  function scrollTo(line) {
    const codepled = document.querySelector("#codepled");
    const clientHeight = codepled.clientHeight;
    const padding = parseFloat(
      window.getComputedStyle(codepled).getPropertyValue("padding-top")
    );
    const linesCount = (codepled.innerHTML.match(/\n/g) || []).length;
    const lineHeight = (clientHeight - 2 * padding) / linesCount;
    document.querySelector(".code-container").scrollTop =
      lineHeight * (line - 1) + padding;
  }

  function getCursorLine() {
    const codepled = document.querySelector("#codepled");
    const beforeCursor = codepled.innerHTML.substr(
      0,
      codepled.innerHTML.indexOf(cursorText)
    );
    return (beforeCursor.match(/\n/g) || []).length;
  }

  // @ts-ignore
  async function showMessage(message) {
    // @ts-ignore
    document.querySelector(".textbox-container").style.display = "flex";
    document.querySelector(".textbox__content").innerHTML = message;
    return new Promise((resolve) => {
      // @ts-ignore
      textContinue = resolve;
    });
  }

  function stop() {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }

  // @ts-ignore
  function setCurrentCommandIndex(newIndex) {
    currentCommandIndex = newIndex;
    // @ts-ignore
    slider.value = newIndex;
  }

  // @ts-ignore
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // @ts-ignore
  function setText(ctrl, text, cursor) {
    ctrl.innerHTML =
      htmlEncode(text.substr(0, cursor)) +
      cursorText +
      htmlEncode(text.substr(cursor));
    trueText = text;
    highlight();
  }

  // @ts-ignore
  function setCursor(ctrl, cursorPos) {
    ctrl.innerHTML =
      htmlEncode(trueText.substr(0, cursor)) +
      cursorText +
      htmlEncode(trueText.substr(cursor));
  }

  function highlight() {
    hljs.configure({ useBR: false });

    document.querySelectorAll("#codepled").forEach((block) => {
      // @ts-ignore
      hljs.highlightBlock(block);
      const linesCount = (block.innerHTML.match(/\n/g) || []).length;
      setLines(linesCount);
      highlightLines(block);
    });
  }

  // @ts-ignore
  function highlightLines(block) {
    block.innerHTML = block.innerHTML.replace(
      /([ \S]*\n|[ \S]*$)/gm,
      // @ts-ignore
      (match) => `<div class="line">${match}</div>`
    );

    const options = [{ ...highlightedLines, color: "#004212" }];

    const lines = block.querySelectorAll(".line");
    for (let option of options) {
      for (let i = option.start; i <= option.end; i++) {
        lines[i - 1].style.backgroundColor = option.color;
      }
    }
  }

  // @ts-ignore
  function setLines(lineCount) {
    let innerStr = "";
    for (let i = 1; i <= lineCount; i++) {
      innerStr += i + "<br />";
    }
    const linesContainer = document.querySelector(".lines");
    if (linesContainer) {
      linesContainer.innerHTML = innerStr;
    }
  }

  // @ts-ignore
  function htmlEncode(value) {
    var div = document.createElement("div");
    var text = document.createTextNode(value);
    div.appendChild(text);
    return div.innerHTML;
  }

  // @ts-ignore
  function initSlider(slider) {
    slider.setAttribute("max", commands.length - 1);
    slider.value = 0;
    // @ts-ignore
    slider.onchange = function (e) {
      if (this.value < currentCommandIndex) {
        currentCommandIndex = 0;
      }

      forwardTo(this.value);
      if (wasPlayingOnSliderMove) {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        play();
      }
      console.log(this.value, commands.length);
    };
    // @ts-ignore
    slider.oninput = function (e) {
      if (isPlaying || wasPlayingOnSliderMove) {
        wasPlayingOnSliderMove = true;
      } else {
        wasPlayingOnSliderMove = false;
      }
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      isPlaying = false;
    };
  }

  // @ts-ignore
  function initPlayButton(playButton) {
    playButton.onclick = () => {
      if (isBlocked) return;
      if (!isPlaying) {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        play();
      } else {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        wasPlayingOnSliderMove = false;
      }
    };
  }

  // @ts-ignore
  function initSpeedButton(speedButton) {
    if (isBlocked) return;
    speedButton.onclick = () => {
      speed = (speed + 1) % 4;
      if (speed == 0) speed = 1;
      const speedMeter = document.querySelector(".speedmeter");
      // @ts-ignore
      speedMeter.textContent = speed;
    };
  }

  // @ts-ignore
  function createCommands(diff) {
    // @ts-ignore
    const commands = [];
    // @ts-ignore
    diff.forEach((d) => {
      if (d[0] === -1) {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([CMD_DELETE, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([CMD_SKIP, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([CMD_INSERT, d[1][i]]);
        }
      }
    });
    // @ts-ignore
    return commands;
  }

  // @ts-ignore
  function initTextbox(textbox) {
    textbox.style.display = "none";

    textbox.querySelector("i").onclick = () => {
      if (textContinue) {
        textbox.style.display = "none";
        // @ts-ignore
        textContinue();
      }
    };
  }

  function disableControls() {
    isBlocked = true;
    // @ts-ignore
    slider.disabled = true;

    document.querySelector(".slider-container").classList.add("disabled");
  }

  function enableControls() {
    isBlocked = false;
    // @ts-ignore
    slider.disabled = false;
    document.querySelector(".slider-container").classList.remove("disabled");
  }
})();
