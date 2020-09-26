import { TestUtils } from "../Utils/TestUtils";
import { Utils } from "../Utils/Utils";
import { mocked } from "ts-jest/utils";
import { Command, CommandType } from "../DiffConverter/Commands";
import { PlayerUi } from "./PlayerUi";
import * as hljs from "highlight.js";
import { PlayerEventType, Player } from "./Player";
jest.mock("highlight.js");
jest.mock("../Utils/Utils");

TestUtils.fixCustomEventConstructor();

const mockedHljs = mocked(hljs, true);
const mockedUtils = mocked(Utils, true);

let playerUi: PlayerUi;
let player: Player;

describe("PlayerUi", () => {
  beforeEach(() => {
    mockedHljs.configure.mockReset();
    document.body.innerHTML = `
    <div class="container">
      <div class="code-container">
        <div class="inner-container">
          <div class="lines"></div>
          <div id="codepled" class="language-js"></div>
        </div>
      </div>
      <div class="textbox-container">
        <div class="textbox__content"></div>
        <button class="button next-button">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="slider-container">
        <div class="play"><i class="fas fa-play"></i></div>
        <div class="play speed">
          <span class="speedmeter">1</span><i class="fas fa-tachometer-alt"></i>
        </div>
        <div class="sliderbox">
          <input type="range" min="0" max="99" value="50" class="slider" />
        </div>
      </div>
    </div>
  `;
    player = new Player();
    playerUi = new PlayerUi(player);
    mockedUtils.sleep.mockImplementation(() => Promise.resolve());
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

  it("should handle a changeText event", () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");

    playerUi.init();

    dispatchEvent(
      new CustomEvent(PlayerEventType.CHANGE_TEXT, {
        detail: {
          text: "Hello\nWorld",
          cursor: 7,
        },
      })
    );

    expect(textArea.innerHTML).toEqual(
      '<div class="line">Hello</div>\n<div class="line">W<span class="cursor"></span>orld</div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
  });

  it("processes show_text command", async () => {
    jest.spyOn(player, "isLastCommand").mockReturnValue(false);
    const unblockSpy = jest.spyOn(player, "unblock");
    const slider = <HTMLInputElement>document.querySelector(".slider");
    const sliderContainer = document.querySelector(".slider-container");
    const textboxContainer = <HTMLElement>(
      document.querySelector(".textbox-container")
    );
    const textboxContent = <HTMLElement>(
      document.querySelector(".textbox__content")
    );
    playerUi.init();
    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: {
          message: "Text to be shown",
        },
      })
    );

    expect(slider.disabled).toEqual(true);
    expect(sliderContainer.classList.contains("disabled")).toEqual(true);
    expect(textboxContainer.style.display).toEqual("flex");
    expect(textboxContent.innerHTML).toEqual("Text to be shown");
    textboxContainer.querySelector("i").click();
    await TestUtils.tick();
    expect(textboxContainer.style.display).toEqual("none");

    expect(unblockSpy).toHaveBeenCalled();
    expect(slider.disabled).toEqual(false);
    expect(sliderContainer.classList.contains("disabled")).toEqual(false);
  });

  it("should resume playing after show_text", async () => {
    jest.spyOn(player, "isLastCommand").mockReturnValue(false);
    const playSpy = jest.spyOn(player, "play");
    const textboxContainer = <HTMLElement>(
      document.querySelector(".textbox-container")
    );

    playerUi.init();
    dispatchEvent(
      new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: {
          message: "Text to be shown",
        },
      })
    );
    textboxContainer.querySelector("i").click();
    await TestUtils.tick();
    expect(playSpy).toHaveBeenCalled();
  });

  it("should highlight line", async () => {
    const textArea = document.querySelector("#codepled");
    const highlightStyle = 'style="background-color: rgb(0, 66, 18);"';

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
      '<div class="line"><span class="cursor"></span>Hello</div>\n' +
        `<div class="line" ${highlightStyle}>World</div>\n` +
        `<div class="line" ${highlightStyle}>Line 3</div>`
    );
  });

  it("should scroll to", () => {
    const textArea = document.querySelector("#codepled");
    const paddingTop = 10;
    const lineHeight = 10;
    const linesCount = 100;
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
});
