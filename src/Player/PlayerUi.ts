import * as hljs from "highlight.js";
import { Command } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";
import { PlayerEventType, Player } from "./Player";
import { template as playerTemplate } from "./PlayerTemplate";
import "../css/styles.css";
import { commands } from "../../codepleds/5-ways-shortest-path";
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

export class PlayerUi {
  private cursorText = '<span class="cursor"></span>';
  private textArea: HTMLElement;
  private playButton: HTMLElement;
  private fullscreenButton: HTMLElement;
  private slider: HTMLInputElement;
  private speedButton: HTMLElement;
  private tableOfContents: HTMLElement;
  private resumeButton: HTMLElement;

  private wasPlayingOnSliderMove = false;

  constructor(private selector: string, private player: Player = new Player()) {
    // console.log(JSON.stringify(commands));
    // (<HTMLElement>document.querySelector("#debug")).innerText = JSON.stringify(
    //   commands
    // );

    document.querySelector(selector).innerHTML = playerTemplate;

    this.playButton = document.querySelector(".play");
    this.slider = document.querySelector(".slider");
    this.speedButton = document.querySelector(".speed");
    this.textArea = document.querySelector(".codepled-editor");
    this.tableOfContents = document.querySelector(".table-of-contents");
    this.resumeButton = document.querySelector(".next-button");
    this.fullscreenButton = document.querySelector(".fullscreen");

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

  init(commands?: Command[], title?: string) {
    if (commands) {
      this.player.addCommands(commands);
    }
    if (title) {
      this.initTitle(title);
    }
    this.initPlayButton(this.playButton);
    this.initSpeedButton(this.speedButton);
    this.initSlider(this.slider);
    this.initToc(this.tableOfContents);
    this.initResumeButton(this.resumeButton);
    this.initFullscreenButton(this.fullscreenButton);
    this.player.reset();
    this.player.forwardTo(1);
  }

  setInitialText(initialText: string) {
    this.player.setInitialText(initialText);
  }

  private initTitle(title: string) {
    (<HTMLElement>(
      document.querySelector(this.selector + " .title a")
    )).innerText = title;
  }

  private highlight() {
    const codepled = document.querySelector(".codepled-editor");
    hljs.configure({ useBR: false });
    hljs.highlightBlock(<HTMLElement>codepled);
    const linesCount = Utils.countLines(codepled.innerHTML);
    this.setLines(linesCount);
    this.highlightLines(codepled);
  }

  private highlightLines(block: Element) {
    block.innerHTML = block.innerHTML
      .split("\n")
      .map((ls) => `<div class="line">${ls}\n</div>`)
      .join("");

    const options = [
      { ...this.player.getHighlightedLines(), color: "#33392f" },
    ];

    this.player.getLinesTouched().forEach((lineNo) => {
      options.push({
        start: lineNo,
        end: lineNo,
        color: "#33392f",
      });
    });

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
      let classes = "line";
      if (this.player.getLinesTouched().has(i)) {
        classes += " highlighted";
      }
      innerStr += `<span class="${classes}">${i}</span><br />`;
    }
    const linesContainer = document.querySelector(".lines");
    linesContainer.innerHTML = innerStr;
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

  private initResumeButton(resumeButton: HTMLElement) {
    resumeButton.style.display = "none";
    resumeButton.onclick = () => {
      this.player.play();
    };
    resumeButton.onclick = () => {
      this.player.play();
    };
    addEventListener("keydown", (event) => {
      if (event.key == " ") {
        event.preventDefault();
        if (this.player.isPaused()) {
          this.player.play();
        }
      }
    });
  }

  private initSpeedButton(speedButton: HTMLElement) {
    speedButton.onclick = () => {
      this.player.increaseSpeed();
      const speedMeter = document.querySelector(".speedmeter");
      speedMeter.textContent = `${this.player.getSpeed()}`;
    };
  }

  private initFullscreenButton(fullscreenButton: HTMLElement) {
    if (!Utils.isFullscreenSupported()) {
      fullscreenButton.style.display = "none";
    }
    this.updateFullscreenButton();
    fullscreenButton.onclick = () => {
      if (Utils.isFullscreen()) {
        Utils.closeFullscreen();
      } else {
        Utils.enterFullscreen();
      }
    };
    document.documentElement.addEventListener("fullscreenchange", () => {
      this.updateFullscreenButton();
    });
  }

  private updateFullscreenButton(): void {
    const icon = this.fullscreenButton.querySelector("i");
    if (!Utils.isFullscreen()) {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    } else {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    }
  }

  private initToc(tableOfContents: HTMLElement) {
    const tocClose: HTMLElement = tableOfContents.querySelector(".toc__close");
    const tocOpen: HTMLElement = document.querySelector(".toc__open");

    tocClose.onclick = () => {
      this.closeToc();
    };

    tocOpen.style.display = "none";
    tocOpen.onclick = () => {
      tableOfContents.style.display = "flex";
      tocOpen.style.display = "none";
    };

    this.createTableOfContents();
  }

  private closeToc() {
    const tocOpen: HTMLElement = document.querySelector(".toc__open");
    this.tableOfContents.style.display = "none";
    tocOpen.style.display = "flex";
  }

  private onPause = () => {
    this.playButton.innerHTML = '<i class="fas fa-play"></i>';
    this.resumeButton.style.display = "block";
  };

  private onPlay = () => {
    if (this.isPortraitMode()) {
      this.closeToc();
    }
    this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
    this.resumeButton.style.display = "none";
  };

  private isPortraitMode(): boolean {
    const matchMediaResult = matchMedia(
      "only screen and (max-width: 800px), (orientation: portrait)"
    );
    return matchMediaResult.matches;
  }

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
    const clientHeight = this.textArea.clientHeight;
    const padding = parseFloat(
      window.getComputedStyle(this.textArea).getPropertyValue("padding-top")
    );
    const linesCount = Utils.countLines(this.textArea.innerHTML);
    const lineHeight = (clientHeight - 2 * padding) / linesCount;

    document.querySelector(".code-container").scrollTop =
      lineHeight * (event.detail.line - 1) + padding;
  };

  private onShowText = (_event: CustomEvent) => {
    this.createTableOfContents();

    const textboxContent = <HTMLElement>(
      document.querySelector(".textbox__content")
    );
    let newContent = "";
    this.player.getTexts().forEach(({ text }, index) => {
      const isLastEntry = index === this.player.getTexts().length - 1;
      let classes = "section";
      if (isLastEntry) {
        classes += " active";
      }
      newContent += `<div class="${classes}">${text}</div>`;
    });

    textboxContent.innerHTML = newContent;

    this.scrollToLastSection(textboxContent);

    document.querySelectorAll(".section").forEach((section, index) => {
      const isLastEntry = index === this.player.getTexts().length - 1;
      if (!isLastEntry) {
        (<HTMLElement>section).onclick = () => {
          this.player.forwardTo(this.player.getTexts()[index]?.stepIndex);
        };
      }
    });
  };

  private scrollToLastSection(textboxContent: HTMLElement): void {
    const lastSection = <HTMLElement>document.querySelector(".section.active");

    textboxContent.scrollTop =
      textboxContent.scrollHeight -
      (lastSection ? lastSection.clientHeight : 0);
  }

  private createTableOfContents() {
    const tocContent = document.querySelector(".toc__bookmarks");
    tocContent.innerHTML = "";

    const lastIndexInRange = this.getLastIndexInRange();

    this.player
      .getTextSteps()
      .filter(({ toc }) => toc)
      .forEach(({ title, content, stepNo, level }, index) => {
        const bookmarkElem = document.createElement("li");
        const bookmarkLink = document.createElement("button");
        bookmarkElem.classList.add("bookmark");
        if (level === 2) {
          bookmarkElem.classList.add("bookmark--level2");
        }
        bookmarkElem.appendChild(bookmarkLink);
        bookmarkLink.innerHTML = `
            <div class="bookmark__icon"><i class="fas fa-align-left"></i></div>
            <div class="bookmark__title">${
              title ? title : Utils.stripHtml(content.substr(0, 20))
            }</div>`;
        tocContent.appendChild(bookmarkElem);
        bookmarkLink.onclick = () => {
          this.player.forwardTo(stepNo);
        };
        if (index == lastIndexInRange) {
          bookmarkElem.classList.add("active");
        } else {
          bookmarkElem.classList.remove("active");
        }
      });
  }

  private getLastIndexInRange(): number {
    let lastIndexInRange = -1;
    this.player
      .getTextSteps()
      .filter(({ toc }) => toc)
      .forEach(({ stepNo }, index) => {
        if (stepNo <= this.player.getCurrentStepIndex()) {
          lastIndexInRange = index;
        }
      });
    return lastIndexInRange;
  }
}
