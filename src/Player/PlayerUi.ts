import * as hljs from "highlight.js";
import { Command } from "../DiffConverter/Commands";
import { PlayerEventType, Player } from "./Player";

export class PlayerUi {
  private cursorText = '<span class="cursor"></span>';
  private textArea: HTMLElement;
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
    this.textArea = document.querySelector("#codepled");

    addEventListener(PlayerEventType.PAUSE, this.onPause);
    addEventListener(PlayerEventType.PLAY, this.onPlay);
    addEventListener(PlayerEventType.CHANGE_TEXT, this.onChangeText);
    addEventListener(
      PlayerEventType.CHANGE_COMMAND_INDEX,
      this.onChangeCommandIndex
    );
    addEventListener(PlayerEventType.SCROLL_TO, this.onScrollTo);
    addEventListener(PlayerEventType.SHOW_TEXT, this.onShowText);
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

  private async showMessage(message: string) {
    this.textbox.style.display = "flex";
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

    const options = [
      { ...this.player.getHighlightedLines(), color: "#004212" },
    ];

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
    slider.setAttribute("max", `${this.player.getCommandCount()}`);
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
      if (!this.player.isPaused()) {
        this.wasPlayingOnSliderMove = false;
      }
      this.player.playPause();
    };
  }

  private initSpeedButton(speedButton: HTMLElement) {
    speedButton.onclick = () => {
      this.player.increaseSpeed();
      const speedMeter = document.querySelector(".speedmeter");
      speedMeter.textContent = `${this.player.getSpeed()}`;
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
    this.slider.disabled = true;
    document.querySelector(".slider-container").classList.add("disabled");
  }

  private enableControls() {
    this.player.unblock();
    this.slider.disabled = false;
    document.querySelector(".slider-container").classList.remove("disabled");
  }

  private onPause = () =>
    (this.playButton.innerHTML = '<i class="fas fa-play"></i>');

  private onPlay = () =>
    (this.playButton.innerHTML = '<i class="fas fa-pause"></i>');

  private onChangeText = (event: CustomEvent) => {
    this.textArea.innerHTML =
      this.htmlEncode(event.detail.text.substr(0, event.detail.cursor)) +
      this.cursorText +
      this.htmlEncode(event.detail.text.substr(event.detail.cursor));
    this.highlight();
  };

  private onChangeCommandIndex = (event: CustomEvent) => {
    this.slider.value = `${event.detail.index}`;
  };

  private onScrollTo = (event: CustomEvent) => {
    const codepled = document.querySelector("#codepled");
    const clientHeight = codepled.clientHeight;
    const padding = parseFloat(
      window.getComputedStyle(codepled).getPropertyValue("padding-top")
    );
    const linesCount = (codepled.innerHTML.match(/\n/g) || []).length + 1;
    const lineHeight = (clientHeight - 2 * padding) / linesCount;

    document.querySelector(".code-container").scrollTop =
      lineHeight * (event.detail.line - 1) + padding;
  };

  private onShowText = (event: CustomEvent) => {
    const isLastCommand = this.player.isLastCommand();
    this.disableControls();
    this.showMessage(event.detail.message).then(() => {
      this.enableControls();
      if (!isLastCommand) {
        this.player.play();
      }
    });
  };
}
