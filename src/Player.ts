import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import * as hljs from "highlight.js";
import { input } from "./input";
import { transformed } from "./transformed";
import { displayText } from "./displayText";

export class Player {
  private SPEED: { [key: number]: number } = { 3: 10, 2: 50, 1: 100 };
  private CMD_DELETE = -1;
  private CMD_INSERT = 1;
  private CMD_SKIP = 0;
  private CMD_SHOW_TEXT = 2;
  private CMD_HIGHLIGHT_LINES = 3;
  private CMD_SCROLL_TO = 4;
  private cursorText = '<span class="cursor"></span>';
  private dmp = new DiffMatchPatch();
  private diff = this.dmp.diff_main(input, transformed);
  private ta = document.querySelector("#codepled");
  private playButton = <HTMLElement>document.querySelector(".play");
  private slider = <HTMLInputElement>document.querySelector(".slider");
  private speedButton = <HTMLElement>document.querySelector(".speed");
  private textbox = <HTMLElement>document.querySelector(".textbox-container");
  private highlightedLines = { start: -1, end: -2 };
  private commands: any[];

  private speed = 1;
  private trueText: string;
  private currentCommandIndex = 0;
  private isPlaying = false;
  private wasPlayingOnSliderMove = false;
  private cursor = 0;
  private isBlocked = false;
  private textContinue: () => void;

  constructor() {
    this.commands = [
      ...this.createCommands(this.diff),
      [this.CMD_HIGHLIGHT_LINES, { start: 3, end: 4 }],
      [2, displayText],
    ];
    this.initPlayButton(this.playButton);
    this.initSpeedButton(this.speedButton);
    this.initSlider(this.slider);
    this.initTextbox(this.textbox);
    this.init();
  }

  init() {
    this.cursor = 0;
    this.setText(this.ta, input, this.cursor);
    this.highlightedLines = { start: -1, end: -2 };
  }

  async play() {
    if (this.currentCommandIndex >= this.commands.length) {
      this.currentCommandIndex = 0;
    }
    if (this.currentCommandIndex == 0) {
      this.init();
    }
    this.isPlaying = true;
    this.playButton.innerHTML = '<i class="fas fa-pause"></i>';

    while (this.currentCommandIndex < this.commands.length && this.isPlaying) {
      this.processCommand(this.commands[this.currentCommandIndex]);
      this.setCurrentCommandIndex(this.currentCommandIndex + 1);
      if (this.currentCommandIndex >= this.commands.length) {
        this.stop();
        this.isPlaying = false;
      }
      await this.sleep(this.SPEED[this.speed]);
    }
  }

  forwardTo(targetIndex: number) {
    if (this.currentCommandIndex == 0) this.init();

    while (this.currentCommandIndex < targetIndex) {
      this.processCommand(this.commands[this.currentCommandIndex]);
      this.setCurrentCommandIndex(this.currentCommandIndex + 1);
      if (this.currentCommandIndex >= this.commands.length) {
        this.stop();
        break;
      }
    }
  }

  processCommand([commandNo, payload]: any[]) {
    if (commandNo === this.CMD_INSERT) {
      const newText =
        this.trueText.substr(0, this.cursor) +
        payload +
        this.trueText.substr(this.cursor);
      this.cursor += payload.length;
      this.setText(this.ta, newText, this.cursor);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === this.CMD_DELETE) {
      const newText =
        this.trueText.substr(0, this.cursor) +
        this.trueText.substr(this.cursor + payload);
      this.setText(this.ta, newText, this.cursor);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === this.CMD_SKIP) {
      this.cursor += payload;
      this.setText(this.ta, this.trueText, this.cursor);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === this.CMD_SHOW_TEXT) {
      this.stop();
      const isLastCommand =
        this.currentCommandIndex == this.commands.length - 1;
      this.disableControls();
      this.showMessage(payload).then(() => {
        this.enableControls();
        if (!isLastCommand) {
          this.play();
        }
      });
    } else if (commandNo === this.CMD_HIGHLIGHT_LINES) {
      this.highlightedLines = payload;
      this.setText(this.ta, this.trueText, this.cursor);
    } else if (commandNo === this.CMD_SCROLL_TO) {
      scrollTo(payload);
    }
  }

  scrollTo(line: number) {
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

  getCursorLine() {
    const codepled = document.querySelector("#codepled");
    const beforeCursor = codepled.innerHTML.substr(
      0,
      codepled.innerHTML.indexOf(this.cursorText)
    );
    return (beforeCursor.match(/\n/g) || []).length;
  }

  async showMessage(message: string) {
    (<HTMLElement>document.querySelector(".textbox-container")).style.display =
      "flex";
    document.querySelector(".textbox__content").innerHTML = message;
    return new Promise((resolve) => {
      this.textContinue = resolve;
    });
  }

  stop() {
    this.isPlaying = false;
    this.playButton.innerHTML = '<i class="fas fa-play"></i>';
  }

  setCurrentCommandIndex(newIndex: number) {
    this.currentCommandIndex = newIndex;
    (<HTMLInputElement>this.slider).value = `${newIndex}`;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setText(ctrl: Element, text: string, cursor: number) {
    ctrl.innerHTML =
      this.htmlEncode(text.substr(0, cursor)) +
      this.cursorText +
      this.htmlEncode(text.substr(cursor));
    this.trueText = text;
    this.highlight();
  }

  setCursor(ctrl: Element, cursorPos: number) {
    ctrl.innerHTML =
      this.htmlEncode(this.trueText.substr(0, this.cursor)) +
      this.cursorText +
      this.htmlEncode(this.trueText.substr(this.cursor));
  }

  highlight() {
    hljs.configure({ useBR: false });

    document.querySelectorAll("#codepled").forEach((block) => {
      hljs.highlightBlock(<HTMLElement>block);
      const linesCount = (block.innerHTML.match(/\n/g) || []).length;
      this.setLines(linesCount);
      this.highlightLines(block);
    });
  }

  highlightLines(block: Element) {
    block.innerHTML = block.innerHTML.replace(
      /([ \S]*\n|[ \S]*$)/gm,
      // @ts-ignore
      (match) => `<div class="line">${match}</div>`
    );

    const options = [{ ...this.highlightedLines, color: "#004212" }];

    const lines = block.querySelectorAll(".line");
    for (let option of options) {
      for (let i = option.start; i <= option.end; i++) {
        (<HTMLElement>lines[i - 1]).style.backgroundColor = option.color;
      }
    }
  }

  setLines(lineCount: number) {
    let innerStr = "";
    for (let i = 1; i <= lineCount; i++) {
      innerStr += i + "<br />";
    }
    const linesContainer = document.querySelector(".lines");
    if (linesContainer) {
      linesContainer.innerHTML = innerStr;
    }
  }

  htmlEncode(value: string) {
    var div = document.createElement("div");
    var text = document.createTextNode(value);
    div.appendChild(text);
    return div.innerHTML;
  }

  initSlider(slider: HTMLInputElement) {
    slider.setAttribute("max", `${this.commands.length - 1}`);
    slider.value = "0";
    slider.onchange = (e) => {
      const sliderVal = Number((<HTMLInputElement>e.target).value);
      if (sliderVal < this.currentCommandIndex) {
        this.currentCommandIndex = 0;
      }

      this.forwardTo(sliderVal);
      if (this.wasPlayingOnSliderMove) {
        this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
        this.play();
      }
    };
    slider.oninput = (e) => {
      if (this.isPlaying || this.wasPlayingOnSliderMove) {
        this.wasPlayingOnSliderMove = true;
      } else {
        this.wasPlayingOnSliderMove = false;
      }
      this.stop();
    };
  }

  initPlayButton(playButton: HTMLElement) {
    playButton.onclick = () => {
      if (this.isBlocked) return;
      if (!this.isPlaying) {
        this.play();
      } else {
        this.stop();
        this.wasPlayingOnSliderMove = false;
      }
    };
  }

  initSpeedButton(speedButton: HTMLElement) {
    if (this.isBlocked) return;
    speedButton.onclick = () => {
      this.speed = (this.speed + 1) % 4;
      if (this.speed == 0) this.speed = 1;
      const speedMeter = document.querySelector(".speedmeter");
      speedMeter.textContent = `${this.speed}`;
    };
  }

  createCommands(diff: any[]) {
    const commands: any[] = [];
    diff.forEach((d) => {
      if (d[0] === -1) {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([this.CMD_DELETE, 1]);
        }
      } else if (d[0] === 0) {
        commands.push([this.CMD_SKIP, d[1].length]);
      } else {
        for (let i = 0; i < d[1].length; i++) {
          commands.push([this.CMD_INSERT, d[1][i]]);
        }
      }
    });
    return commands;
  }

  initTextbox(textbox: HTMLElement) {
    textbox.style.display = "none";

    textbox.querySelector("i").onclick = () => {
      if (this.textContinue) {
        textbox.style.display = "none";
        this.textContinue();
      }
    };
  }

  disableControls() {
    this.isBlocked = true;
    this.slider.disabled = true;

    document.querySelector(".slider-container").classList.add("disabled");
  }

  enableControls() {
    this.isBlocked = false;
    this.slider.disabled = false;
    document.querySelector(".slider-container").classList.remove("disabled");
  }
}
