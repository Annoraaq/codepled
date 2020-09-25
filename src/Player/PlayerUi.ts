import { CommandType } from "./../DiffConverter/Commands";
import * as hljs from "highlight.js";
import { Command } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";
import { Player } from "./Player";

export class PlayerUi {
  private cursorText = '<span class="cursor"></span>';
  private ta: HTMLElement;
  private playButton: HTMLElement;
  private slider: HTMLInputElement;
  private speedButton: HTMLElement;
  private textbox: HTMLElement;

  private wasPlayingOnSliderMove = false;

  private textContinue: () => void;

  constructor(private player: Player = new Player()) {
    this.playButton = document.querySelector(".play");
    this.slider = <HTMLInputElement>document.querySelector(".slider");
    this.speedButton = document.querySelector(".speed");
    this.textbox = document.querySelector(".textbox-container");
    this.ta = document.querySelector("#codepled");

    addEventListener(
      "pause",
      () => (this.playButton.innerHTML = '<i class="fas fa-play"></i>'),
      false
    );
    addEventListener(
      "play",
      () => (this.playButton.innerHTML = '<i class="fas fa-pause"></i>'),
      false
    );
    addEventListener(
      "changeText",
      (event: any) => {
        this.ta.innerHTML =
          this.htmlEncode(event.detail.text.substr(0, event.detail.cursor)) +
          this.cursorText +
          this.htmlEncode(event.detail.text.substr(event.detail.cursor));
        this.highlight();
      },
      false
    );
    addEventListener(
      "changeCommandIndex",
      (event: any) => {
        this.slider.value = `${event.index}`;
      },
      false
    );
    addEventListener(
      "scrollTo",
      (event: any) => {
        const codepled = document.querySelector("#codepled");
        const clientHeight = codepled.clientHeight;
        const padding = parseFloat(
          window.getComputedStyle(codepled).getPropertyValue("padding-top")
        );
        const linesCount = (codepled.innerHTML.match(/\n/g) || []).length + 1;
        const lineHeight = (clientHeight - 2 * padding) / linesCount;

        document.querySelector(".code-container").scrollTop =
          lineHeight * (event.detail.line - 1) + padding;
      },
      false
    );
    addEventListener(
      "showText",
      (event: any) => {
        const isLastCommand = this.player.isLastCommand();
        this.disableControls();
        this.showMessage(event.detail.message).then(() => {
          this.enableControls();
          if (!isLastCommand) {
            this.player.play();
          }
        });
      },
      false
    );
  }

  addCommands(commands: Command[]): void {
    this.player.addCommands(commands);
  }

  init() {
    this.initPlayButton(this.playButton);
    this.initSpeedButton(this.speedButton);
    this.initSlider(this.slider);
    this.initTextbox(this.textbox);
    this.player.reset();
  }

  setInitialText(initialText: string) {
    this.player.setInitialText(initialText);
  }

  getCurrentCommandIndex(): number {
    return this.player.getCurrentCommandIndex();
  }

  setCursorPos(pos: number): void {
    this.player.cursor = pos;
  }

  isBlocked(): boolean {
    return this.player.isBlocked();
  }

  isPaused(): boolean {
    return this.player.isPaused();
  }

  getSpeed(): number {
    return this.player.speed;
  }

  async play() {
    return this.player.play();
  }

  private async showMessage(message: string) {
    (<HTMLElement>document.querySelector(".textbox-container")).style.display =
      "flex";
    document.querySelector(".textbox__content").innerHTML = message;
    return new Promise((resolve) => {
      this.textContinue = resolve;
    });
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
    block.innerHTML = block.innerHTML
      .split("\n")
      .map((ls) => `<div class="line">${ls}</div>`)
      .join("\n");

    const options = [{ ...this.player.highlightedLines, color: "#004212" }];

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
    slider.setAttribute("max", `${this.player.getCommands().length - 1}`);
    slider.value = "0";
    slider.onchange = (e) => {
      const sliderVal = Number((<HTMLInputElement>e.target).value);

      this.player.forwardTo(sliderVal);
      if (this.wasPlayingOnSliderMove) {
        this.player.play();
      }
    };
    slider.oninput = () => {
      if (!this.player.isPaused() || this.wasPlayingOnSliderMove) {
        this.wasPlayingOnSliderMove = true;
      } else {
        this.wasPlayingOnSliderMove = false;
      }
      this.player.pause();
    };
  }

  private initPlayButton(playButton: HTMLElement) {
    playButton.onclick = () => {
      if (this.player.isBlocked()) return;
      if (this.player.isPaused()) {
        this.player.play();
      } else {
        this.player.pause();
        this.wasPlayingOnSliderMove = false;
      }
    };
  }

  private initSpeedButton(speedButton: HTMLElement) {
    speedButton.onclick = () => {
      if (this.isBlocked()) return;
      this.player.speed = (this.player.speed + 1) % 4;
      if (this.player.speed == 0) this.player.speed = 1;
      const speedMeter = document.querySelector(".speedmeter");
      speedMeter.textContent = `${this.player.speed}`;
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
    this.player.block();
    this.slider.disabled = true;
    document.querySelector(".slider-container").classList.add("disabled");
  }

  private enableControls() {
    this.player.unblock();
    this.slider.disabled = false;
    document.querySelector(".slider-container").classList.remove("disabled");
  }
}
