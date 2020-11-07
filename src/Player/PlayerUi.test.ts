import { TestUtils } from "../Utils/TestUtils";
import { Utils } from "../Utils/Utils";
import { mocked } from "ts-jest/utils";
import { Command, CommandType } from "../DiffConverter/Commands";
import { PlayerUi } from "./PlayerUi";
import * as hljs from "highlight.js";
import { PlayerEventType, Player } from "./Player";
jest.mock("highlight.js");

TestUtils.fixCustomEventConstructor();

const mockedHljs = mocked(hljs, true);

let playerUi: PlayerUi;
let player: Player;

describe("PlayerUi", () => {
  beforeEach(() => {
    mockedHljs.configure.mockReset();
    document.body.innerHTML = `
    <div class="container">
      <div class="table-of-contents">
        <div class="toc__open"><i class="fas fa-angle-right"></i></div>
        <header class="toc__title">
            Table of Contents
        </header>
        <div class="toc__content">
          <ul class="toc__bookmarks">
          </ul>
          <div class="toc__close"><i class="fas fa-angle-left"></i></div>
        </div>
      </div>
      <div class="textbox-container">
        <div class="textbox__content"></div>
        <button class="button next-button">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="code-container">
        <div class="inner-container">
          <div class="lines"></div>
          <div id="codepled" class="language-js"></div>
        </div>
      </div>
      <div class="slider-container">
        <div class="play"><i class="fas fa-play"></i></div>
        <div class="play speed">
          <span class="speedmeter">1</span><i class="fas fa-tachometer-alt"></i>
        </div>
        <div class="sliderbox">
          <input type="range" min="0" max="99" value="50" class="slider" />
        </div>
        <button class="play fullscreen">
          <i class="fas fa-expand"></i>
        </button>
      </div>
    </div>
  `;
    player = new Player();
    playerUi = new PlayerUi(player);
    jest.spyOn(Utils, "sleep").mockImplementation(() => Promise.resolve());
    jest.spyOn(Utils, "stripHtml").mockImplementation((a) => `[NO_HTML]${a}`);
    mockedHljs.configure.mockReset();
    mockedHljs.highlightBlock.mockReset();
  });

  it("should add commands", () => {
    const addCommandSpy = spyOn(player, "addCommands");
    const commands: Command[] = [
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ];
    playerUi.addCommands(commands);
    expect(addCommandSpy).toHaveBeenCalledWith(commands);
  });

  it("should set initial text", () => {
    const setInitalTextSpy = spyOn(player, "setInitialText");
    playerUi.setInitialText("initial text");
    expect(setInitalTextSpy).toHaveBeenCalledWith("initial text");
  });

  it("should init slider", () => {
    const slider = <HTMLInputElement>document.querySelector(".slider");
    jest.spyOn(player, "getCommandCount").mockReturnValue(2);
    playerUi.init();
    expect(slider.max).toEqual("2");
  });

  it("should init resumeButton", () => {
    const resumeButton = <HTMLInputElement>(
      document.querySelector(".next-button")
    );
    playerUi.init();
    expect(resumeButton.style.display).toEqual("none");
  });

  it("should handle a changeText event", () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_TEXT, {
        detail: {
          text: "Hello\nWorld\nLine3",
          cursor: 7,
        },
      })
    );

    expect(textArea.innerHTML).toEqual(
      '<div class="line">Hello\n</div><div class="line">W<span class="cursor"></span>orld\n</div><div class="line">Line3\n</div>'
    );
    expect(TestUtils.removeWhitespace(linesContainer.innerHTML)).toEqual(
      TestUtils.removeWhitespace(
        `<span class="line">1</span><br>
         <span class="line">2</span><br>
         <span class="line">3</span><br>`
      )
    );
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
  });

  it("processes show_text command", async () => {
    jest.spyOn(player, "getTexts").mockReturnValue([
      { text: "Hello", stepIndex: 0 },
      { text: "World", stepIndex: 1 },
    ]);
    const textboxContent = <HTMLElement>(
      document.querySelector(".textbox__content")
    );

    const scrollHeight = 111;

    jest
      .spyOn(textboxContent, "scrollHeight", "get")
      .mockImplementation(() => scrollHeight);
    playerUi.init();
    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: {
          message: "whatever",
        },
      })
    );

    expect(textboxContent.innerHTML).toEqual(
      '<div class="section">Hello</div>' +
        '<div class="section active">World</div>'
    );
    expect(textboxContent.scrollTop).toEqual(scrollHeight);
  });

  it("should highlight line", async () => {
    const textArea = document.querySelector("#codepled");
    const highlightStyle = 'style="background-color: rgb(51, 57, 47);"';

    playerUi.init();
    jest
      .spyOn(player, "getHighlightedLines")
      .mockReturnValue({ start: 2, end: 3 });
    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_TEXT, {
        detail: {
          text: "Hello\nWorld\nLine 3",
          cursor: 0,
        },
      })
    );
    await TestUtils.tick();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>Hello\n</div>' +
        `<div class="line" ${highlightStyle}>World\n</div>` +
        `<div class="line" ${highlightStyle}>Line 3\n</div>`
    );
  });

  it("should highlight freshly inserted lines", async () => {
    const textArea = document.querySelector("#codepled");
    const lines = document.querySelector(".lines");
    const highlightStyle = 'style="background-color: rgb(51, 57, 47);"';

    playerUi.init();
    jest.spyOn(player, "getLinesTouched").mockReturnValue(new Set([2, 3]));
    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_TEXT, {
        detail: {
          text: "Hello\nWorld\nLine 3",
          cursor: 0,
        },
      })
    );
    await TestUtils.tick();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>Hello\n</div>' +
        `<div class="line" ${highlightStyle}>World\n</div>` +
        `<div class="line" ${highlightStyle}>Line 3\n</div>`
    );
    expect(TestUtils.removeWhitespace(lines.innerHTML)).toEqual(
      TestUtils.removeWhitespace(
        `<span class="line">1</span><br>
       <span class="linehighlighted">2</span><br>
       <span class="linehighlighted">3</span><br>`
      )
    );
  });

  it("should scroll to", () => {
    const textArea = document.querySelector("#codepled");
    const paddingTop = 10;
    const lineHeight = 10;
    const linesCount = 101;
    const clientHeight = linesCount * lineHeight + 2 * paddingTop;
    const codeContainer = document.querySelector(".code-container");

    let initialText = "";
    for (let i = 1; i <= 100; i++) {
      if (i == 100) {
        initialText += `Line ${i}`;
      } else {
        initialText += `Line ${i}\n`;
      }
    }

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        <any>{
          getPropertyValue: jest.fn(() => paddingTop),
        }
    );

    jest
      .spyOn(textArea, "clientHeight", "get")
      .mockImplementation(() => clientHeight);
    playerUi.init();
    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_TEXT, {
        detail: {
          text: initialText,
          cursor: 0,
        },
      })
    );
    dispatchEvent(
      new CustomEvent(PlayerEventType.SCROLL_TO, {
        detail: {
          line: 50,
        },
      })
    );

    expect(codeContainer.scrollTop).toEqual(lineHeight * 49 + paddingTop);
  });

  it("should increase speed", async () => {
    const increaseSpeedSpy = jest.spyOn(player, "increaseSpeed");

    const speedButton = <HTMLElement>document.querySelector(".speed");
    const speedMeter = document.querySelector(".speedmeter");

    playerUi.init();
    expect(speedMeter.textContent).toEqual("1");

    speedButton.click();
    await TestUtils.tick();
    expect(increaseSpeedSpy).toHaveBeenCalled();
  });

  it("should show speed after click", async () => {
    const speedButton = <HTMLElement>document.querySelector(".speed");
    const speedMeter = document.querySelector(".speedmeter");
    jest.spyOn(player, "getSpeed").mockReturnValue(3);

    playerUi.init();
    speedButton.click();
    await TestUtils.tick();

    expect(speedMeter.textContent).toEqual("3");
  });

  it("should play/pause", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");
    const playPauseSpy = jest.spyOn(player, "playPause");

    playerUi.init();
    playButton.click();
    await TestUtils.tick();
    expect(playPauseSpy).toHaveBeenCalled();
  });

  it("should show the correct play icon", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");

    playerUi.init();
    playButton.click();
    await TestUtils.tick();

    dispatchEvent(new CustomEvent(PlayerEventType.PAUSE));

    expect(playButton.innerHTML).toEqual('<i class="fas fa-play"></i>');
  });

  it("should show the correct pause icon", () => {
    const playButton = <HTMLElement>document.querySelector(".play");

    playerUi.init();
    dispatchEvent(new CustomEvent(PlayerEventType.PLAY));

    expect(playButton.innerHTML).toEqual('<i class="fas fa-pause"></i>');
  });

  it("should init with play icon", () => {
    const playButton = <HTMLElement>document.querySelector(".play");
    jest.spyOn(player, "isPaused").mockReturnValue(true);

    playerUi.init();
    expect(playButton.innerHTML).toEqual('<i class="fas fa-play"></i>');
  });

  it("should forward on slider change", async () => {
    const forwardToSpy = jest.spyOn(player, "forwardTo");
    const playSpy = jest.spyOn(player, "play");
    const slider = <HTMLInputElement>document.querySelector(".slider");
    jest.spyOn(player, "isPaused").mockReturnValue(false);

    playerUi.setInitialText("Hello\nWorld\nLine 3");
    playerUi.addCommands([
      [CommandType.SKIP, 2],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
    ]);
    playerUi.init();

    slider.value = "5";
    slider.oninput(undefined);
    slider.onchange(<any>{ target: slider });
    expect(forwardToSpy).toHaveBeenCalledWith(5);
    expect(playSpy).toHaveBeenCalledTimes(1);

    slider.value = "3";
    slider.oninput(undefined);
    slider.onchange(<any>{ target: slider });
    expect(forwardToSpy).toHaveBeenCalledWith(3);
    expect(playSpy).toHaveBeenCalledTimes(2);

    slider.value = "10";
    slider.oninput(undefined);
    slider.onchange(<any>{ target: slider });
    expect(playSpy).toHaveBeenCalledTimes(3);
  });

  it("should not play when forward on slider change if paused", async () => {
    const forwardToSpy = jest.spyOn(player, "forwardTo");
    const playSpy = jest.spyOn(player, "play");
    const slider = <HTMLInputElement>document.querySelector(".slider");
    jest.spyOn(player, "isPaused").mockReturnValue(true);

    playerUi.setInitialText("Hello\nWorld\nLine 3");
    playerUi.addCommands([
      [CommandType.SKIP, 2],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
    ]);
    playerUi.init();

    slider.value = "5";
    slider.oninput(undefined);
    slider.onchange(<any>{ target: slider });
    expect(forwardToSpy).toHaveBeenCalledWith(5);
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("should handle changeCommandIndex event", async () => {
    const slider = <HTMLInputElement>document.querySelector(".slider");
    jest.spyOn(player, "getCommandCount").mockReturnValue(7);

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_COMMAND_INDEX, {
        detail: { index: 5 },
      })
    );

    expect(slider.value).toEqual("5");
  });

  it("should jump to step index on section click", async () => {
    jest.spyOn(player, "getTexts").mockReturnValue([
      { text: "some text", stepIndex: 3 },
      { text: "some other text", stepIndex: 28 },
    ]);
    const forwardSpy = jest.spyOn(player, "forwardTo").mockImplementation();

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: { text: "Hello" },
      })
    );

    const sections = document.querySelectorAll(".section");
    expect(sections.length).toEqual(2);

    expect(sections[0].classList.contains("active")).toEqual(false);

    expect(sections[1].classList.contains("active")).toEqual(true);

    (<HTMLElement>sections[0]).click();

    expect(forwardSpy).toHaveBeenCalledWith(3);

    (<HTMLElement>sections[1]).click();

    expect(forwardSpy).not.toHaveBeenCalledWith(28);
  });

  it("should highlight the correct table of contents", async () => {
    jest.spyOn(player, "getTextSteps").mockReturnValue([
      { title: "some title", content: "some text", stepNo: 3 },
      { content: "some other text", stepNo: 28 },
    ]);

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: { text: "" },
      })
    );

    const expectedHtml = `
    <li class="bookmark">
      <button>
        <div class="bookmark__icon"><i class="fas fa-align-left"></i></div>
        <div class="bookmark__title">some title</div>
      </button>
    </li>
    <li class="bookmark">
      <button>
        <div class="bookmark__icon"><i class="fas fa-align-left"></i></div>
        <div class="bookmark__title">[NO_HTML]some other text</div>
      </button>
    </li>`;

    expect(
      TestUtils.removeWhitespace(
        document.querySelector(".toc__bookmarks").innerHTML
      )
    ).toEqual(TestUtils.removeWhitespace(expectedHtml));
  });

  it("should forward on click on bookmark", async () => {
    jest.spyOn(player, "getTextSteps").mockReturnValue([
      { content: "some text", stepNo: 3 },
      { content: "some other text", stepNo: 28 },
    ]);
    const forwardSpy = jest.spyOn(player, "forwardTo").mockImplementation();

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: { text: "" },
      })
    );

    const bookmarks = document.querySelectorAll(".bookmark button");
    (<HTMLElement>bookmarks[1]).click();
    expect(forwardSpy).toHaveBeenCalledWith(28);
  });

  it("should hide toc when click on close", async () => {
    const toc = <HTMLElement>document.querySelector(".table-of-contents");
    const openToc = <HTMLElement>document.querySelector(".toc__open");
    playerUi.init();

    expect(openToc.style.display).toEqual("none");

    const closeToc = <HTMLElement>document.querySelector(".toc__close");
    closeToc.click();
    expect(toc.style.display).toEqual("none");
    expect(openToc.style.display).toEqual("flex");

    openToc.click();
    expect(toc.style.display).toEqual("flex");
    expect(openToc.style.display).toEqual("none");
  });

  it("should resume playing when clicking on resume button", async () => {
    const resumeButton = <HTMLElement>document.querySelector(".next-button");
    const playSpy = jest.spyOn(player, "play");
    playerUi.init();

    resumeButton.click();
    expect(playSpy).toHaveBeenCalled();
  });

  it("should resume playing when pressing spacebar", async () => {
    const playSpy = jest.spyOn(player, "play");
    playerUi.init();

    const keyDownEvent = new KeyboardEvent("keydown", {
      key: " ",
    });
    spyOn(keyDownEvent, "preventDefault");
    dispatchEvent(keyDownEvent);

    expect(playSpy).toHaveBeenCalled();
    expect(keyDownEvent.preventDefault).toHaveBeenCalled();
  });

  it("should not resume playing when pressing spacebar and player is not paused", async () => {
    const playSpy = jest.spyOn(player, "play");
    jest.spyOn(player, "isPaused").mockReturnValue(false);
    playerUi.init();

    const keyDownEvent = new KeyboardEvent("keydown", {
      key: " ",
    });
    dispatchEvent(keyDownEvent);

    expect(playSpy).not.toHaveBeenCalled();
  });

  it("should show resume button on pause event", async () => {
    const resumeButton = <HTMLElement>document.querySelector(".next-button");
    playerUi.init();
    expect(resumeButton.style.display).toEqual("none");

    dispatchEvent(new CustomEvent(PlayerEventType.PAUSE));

    expect(resumeButton.style.display).toEqual("block");
  });

  it("should hide resume button on play event", async () => {
    const resumeButton = <HTMLElement>document.querySelector(".next-button");
    playerUi.init();
    dispatchEvent(new CustomEvent(PlayerEventType.PAUSE));
    expect(resumeButton.style.display).toEqual("block");

    dispatchEvent(new CustomEvent(PlayerEventType.PLAY));

    expect(resumeButton.style.display).toEqual("none");
  });

  it("should enter full screen on click", async () => {
    jest.spyOn(Utils, "isFullscreen").mockReturnValue(false);
    jest.spyOn(Utils, "enterFullscreen").mockClear();
    jest.spyOn(Utils, "closeFullscreen").mockClear();
    const fullscreenButton = <HTMLElement>document.querySelector(".fullscreen");
    const fullscreenButtonIcon = <HTMLElement>(
      document.querySelector(".fullscreen i")
    );
    playerUi.init();

    expect(fullscreenButtonIcon.classList.contains("fa-expand")).toBeTruthy();
    expect(fullscreenButtonIcon.classList.contains("fa-compress")).toBeFalsy();

    fullscreenButton.click();

    expect(fullscreenButtonIcon.classList.contains("fa-expand")).toBeFalsy();
    expect(fullscreenButtonIcon.classList.contains("fa-compress")).toBeTruthy();
    expect(Utils.enterFullscreen).toHaveBeenCalled();
    expect(Utils.closeFullscreen).not.toHaveBeenCalled();
  });

  it("should leave full screen on click", async () => {
    jest.spyOn(Utils, "isFullscreen").mockReturnValue(true);
    jest.spyOn(Utils, "enterFullscreen").mockClear();
    jest.spyOn(Utils, "closeFullscreen").mockClear();
    const fullscreenButton = <HTMLElement>document.querySelector(".fullscreen");
    const fullscreenButtonIcon = <HTMLElement>(
      document.querySelector(".fullscreen i")
    );
    playerUi.init();
    expect(fullscreenButtonIcon.classList.contains("fa-expand")).toBeFalsy();
    expect(fullscreenButtonIcon.classList.contains("fa-compress")).toBeTruthy();

    fullscreenButton.click();

    expect(fullscreenButtonIcon.classList.contains("fa-expand")).toBeTruthy();
    expect(fullscreenButtonIcon.classList.contains("fa-compress")).toBeFalsy();
    expect(Utils.enterFullscreen).not.toHaveBeenCalled();
    expect(Utils.closeFullscreen).toHaveBeenCalled();
  });
});
