import * as hljs from "highlight.js";
import { Command } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";

export class Player {
  private SPEED: { [key: number]: number } = { 3: 10, 2: 50, 1: 100 };
  private CMD_DELETE = -1;
  private CMD_INSERT = 1;
  private CMD_SKIP = 0;
  private CMD_SHOW_TEXT = 2;
  private CMD_HIGHLIGHT_LINES = 3;
  private CMD_SCROLL_TO = 4;
  private cursorText = '<span class="cursor"></span>';
  private ta = document.querySelector("#codepled");
  private playButton: HTMLElement;
  private slider: HTMLInputElement;
  private speedButton: HTMLElement;
  private textbox: HTMLElement;
  private highlightedLines = { start: -1, end: -2 };
  private commands: Command[];

  private speed = 1;
  private trueText: string;
  private currentCommandIndex = 0;
  private isPlaying = false;
  private wasPlayingOnSliderMove = false;
  private cursor = 0;
  private _isBlocked = false;

  private textContinue: () => void;
  private initialText = "";

  constructor() {
    this.commands = [];
    this.playButton = <HTMLElement>document.querySelector(".play");
    this.slider = <HTMLInputElement>document.querySelector(".slider");
    this.speedButton = <HTMLElement>document.querySelector(".speed");
    this.textbox = <HTMLElement>document.querySelector(".textbox-container");
  }

  addCommands(commands: Command[]): void {
    this.commands = [...this.commands, ...commands];
  }

  init() {
    this.initPlayButton(this.playButton);
    this.initSpeedButton(this.speedButton);
    this.initSlider(this.slider);
    this.initTextbox(this.textbox);
    this.reset();
  }

  setCurrentCommandIndex(newIndex: number) {
    this.currentCommandIndex = newIndex;
    this.slider.value = `${newIndex}`;
  }

  setInitialText(initialText: string) {
    this.initialText = initialText;
  }

  getCurrentCommandIndex(): number {
    return this.currentCommandIndex;
  }

  setCursorPos(pos: number): void {
    this.cursor = pos;
  }

  isBlocked(): boolean {
    return this._isBlocked;
  }

  async play() {
    if (this.currentCommandIndex >= this.commands.length) {
      this.currentCommandIndex = 0;
    }
    if (this.currentCommandIndex == 0) {
      this.reset();
    }
    this.isPlaying = true;
    this.playButton.innerHTML = '<i class="fas fa-pause"></i>';

    while (this.currentCommandIndex < this.commands.length && this.isPlaying) {
      this.processCommand(this.commands[this.currentCommandIndex]);
      this.setCurrentCommandIndex(this.currentCommandIndex + 1);
      if (this.currentCommandIndex >= this.commands.length) {
        this.pause();
        this.isPlaying = false;
      }
      await Utils.sleep(this.SPEED[this.speed]);
    }
  }

  public isPaused(): boolean {
    return !this.isPlaying;
  }

  private reset() {
    this.cursor = 0;
    this.setText(this.ta, this.initialText, this.cursor);
    this.highlightedLines = { start: -1, end: -2 };
  }

  private forwardTo(targetIndex: number) {
    if (this.currentCommandIndex == 0) this.reset();

    while (this.currentCommandIndex < targetIndex) {
      this.processCommand(this.commands[this.currentCommandIndex]);
      this.setCurrentCommandIndex(this.currentCommandIndex + 1);
      if (this.currentCommandIndex >= this.commands.length) {
        this.pause();
        break;
      }
    }
  }

  private processCommand([commandNo, payload]: any[]) {
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
      this.pause();
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
      this.scrollTo(payload);
    }
  }

  private scrollTo(line: number) {
    const codepled = document.querySelector("#codepled");
    const clientHeight = codepled.clientHeight;
    const padding = parseFloat(
      window.getComputedStyle(codepled).getPropertyValue("padding-top")
    );
    const linesCount = (codepled.innerHTML.match(/\n/g) || []).length + 1;
    const lineHeight = (clientHeight - 2 * padding) / linesCount;

    document.querySelector(".code-container").scrollTop =
      lineHeight * line + padding;
  }

  private getCursorLine() {
    const codepled = document.querySelector("#codepled");
    const beforeCursor = codepled.innerHTML.substr(
      0,
      codepled.innerHTML.indexOf(this.cursorText)
    );
    return (beforeCursor.match(/\n/g) || []).length;
  }

  private async showMessage(message: string) {
    (<HTMLElement>document.querySelector(".textbox-container")).style.display =
      "flex";
    document.querySelector(".textbox__content").innerHTML = message;
    return new Promise((resolve) => {
      this.textContinue = resolve;
    });
  }

  private pause() {
    this.isPlaying = false;
    this.playButton.innerHTML = '<i class="fas fa-play"></i>';
  }

  private setText(ctrl: Element, text: string, cursor: number) {
    ctrl.innerHTML =
      this.htmlEncode(text.substr(0, cursor)) +
      this.cursorText +
      this.htmlEncode(text.substr(cursor));
    this.trueText = text;
    this.highlight();
  }

  private highlight() {
    hljs.configure({ useBR: false });

    const block = document.querySelector("#codepled");
    hljs.highlightBlock(<HTMLElement>block);
    const linesCount = (block.innerHTML.match(/\n/g) || []).length + 1;
    this.setLines(linesCount);
    this.highlightLines(block);
  }

  private highlightLines(block: Element) {
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

  private setLines(lineCount: number) {
    let innerStr = "";
    for (let i = 1; i <= lineCount; i++) {
      innerStr += i + "<br />";
    }
    const linesContainer = document.querySelector(".lines");
    if (linesContainer) {
      linesContainer.innerHTML = innerStr;
    }
  }

  private htmlEncode(value: string) {
    var div = document.createElement("div");
    var text = document.createTextNode(value);
    div.appendChild(text);
    return div.innerHTML;
  }

  private initSlider(slider: HTMLInputElement) {
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
      this.pause();
    };
  }

  private initPlayButton(playButton: HTMLElement) {
    playButton.onclick = () => {
      if (this._isBlocked) return;
      if (!this.isPlaying) {
        this.play();
      } else {
        this.pause();
        this.wasPlayingOnSliderMove = false;
      }
    };
  }

  private initSpeedButton(speedButton: HTMLElement) {
    if (this._isBlocked) return;
    speedButton.onclick = () => {
      this.speed = (this.speed + 1) % 4;
      if (this.speed == 0) this.speed = 1;
      const speedMeter = document.querySelector(".speedmeter");
      speedMeter.textContent = `${this.speed}`;
    };
  }

  private initTextbox(textbox: HTMLElement) {
    textbox.style.display = "none";

    textbox.querySelector("i").onclick = () => {
      if (this.textContinue) {
        textbox.style.display = "none";
        this.textContinue();
      }
    };
  }

  private disableControls() {
    this._isBlocked = true;
    this.slider.disabled = true;

    document.querySelector(".slider-container").classList.add("disabled");
  }

  private enableControls() {
    this._isBlocked = false;
    this.slider.disabled = false;
    document.querySelector(".slider-container").classList.remove("disabled");
  }
}
