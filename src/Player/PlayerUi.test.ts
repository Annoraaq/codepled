import { TestUtils } from "../Utils/TestUtils";
import { Utils } from "../Utils/Utils";
import { mocked } from "ts-jest/utils";
import { CommandType } from "../DiffConverter/Commands";
import { PlayerUi } from "./PlayerUi";
import * as hljs from "highlight.js";
jest.mock("highlight.js");
jest.mock("../Utils/Utils");

const mockedHljs = mocked(hljs, true);
const mockedUtils = mocked(Utils, true);

let player: PlayerUi;

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
    player = new PlayerUi();
    mockedUtils.sleep.mockImplementation(() => Promise.resolve());
  });

  it("processes multiple delete commands", async () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");
    const codeContainer = document.querySelector(".code-container");
    const paddingTop = 10;
    const clientHeight = 30;
    const lineHeight = clientHeight - 2 * paddingTop;

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        <any>{
          getPropertyValue: jest.fn(() => 10),
        }
    );
    jest.spyOn(textArea, "clientHeight", "get").mockImplementation(() => 30);
    player.setInitialText("Hello\nWorld!\nLast line");
    player.addCommands([
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ]);
    player.init();
    mockedHljs.configure.mockReset();
    mockedHljs.highlightBlock.mockReset();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>World!</div>\n<div class="line">Last line</div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
    expect(codeContainer.scrollTop).toEqual(lineHeight * 0 + paddingTop);
  });

  it("processes multiple skip commands and jumps into the correct line for delete", async () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");
    const codeContainer = document.querySelector(".code-container");
    const paddingTop = 10;
    const clientHeight = 30;
    const linesCount = 2;
    const lineHeight = (clientHeight - 2 * paddingTop) / linesCount;

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        <any>{
          getPropertyValue: jest.fn(() => 10),
        }
    );
    jest.spyOn(textArea, "clientHeight", "get").mockImplementation(() => 30);
    player.setInitialText("Hello\nWorld!");
    player.addCommands([
      [CommandType.SKIP, 10],
      [CommandType.DELETE, 1],
    ]);
    player.init();
    mockedHljs.configure.mockReset();
    mockedHljs.highlightBlock.mockReset();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line">Hello</div>\n<div class="line">Worl<span class="cursor"></span>!</div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
    expect(codeContainer.scrollTop).toEqual(lineHeight * 1 + paddingTop);
  });

  it("processes multiple skip commands", async () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");
    const codeContainer = document.querySelector(".code-container");
    const paddingTop = 10;
    const clientHeight = 30;
    const linesCount = 2;
    const lineHeight = (clientHeight - 2 * paddingTop) / linesCount;

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        <any>{
          getPropertyValue: jest.fn(() => 10),
        }
    );
    jest.spyOn(textArea, "clientHeight", "get").mockImplementation(() => 30);
    player.setInitialText("Hello\nWorld!");
    player.addCommands([[CommandType.SKIP, 10]]);
    player.init();
    mockedHljs.configure.mockReset();
    mockedHljs.highlightBlock.mockReset();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line">Hello</div>\n<div class="line">Worl<span class="cursor"></span>d!</div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
    expect(codeContainer.scrollTop).toEqual(lineHeight * 1 + paddingTop);
  });

  it("processes insert commands", async () => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");
    const codeContainer = document.querySelector(".code-container");
    const paddingTop = 10;
    const clientHeight = 30;
    const linesCount = 2;
    const lineHeight = (clientHeight - 2 * paddingTop) / linesCount;

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        <any>{
          getPropertyValue: jest.fn(() => 10),
        }
    );
    jest.spyOn(textArea, "clientHeight", "get").mockImplementation(() => 30);
    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SKIP, 6],
      [CommandType.INSERT, "w"],
      [CommandType.INSERT, "o"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "l"],
      [CommandType.INSERT, "d"],
    ]);
    player.init();
    mockedHljs.configure.mockReset();
    mockedHljs.highlightBlock.mockReset();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line">Hello</div>\n<div class="line">world<span class="cursor"></span></div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(mockedHljs.configure).toHaveBeenCalled();
    expect(mockedHljs.highlightBlock).toHaveBeenCalledWith(textArea);
    expect(codeContainer.scrollTop).toEqual(lineHeight * 1 + paddingTop);
  });

  it("processes show_text command", async (done) => {
    const textArea = document.querySelector("#codepled");
    const linesContainer = document.querySelector(".lines");
    const slider = <HTMLInputElement>document.querySelector(".slider");
    const sliderContainer = document.querySelector(".slider-container");
    const textboxContainer = <HTMLElement>(
      document.querySelector(".textbox-container")
    );
    const textboxContent = <HTMLElement>(
      document.querySelector(".textbox__content")
    );

    player.setInitialText("Hello\n");
    player.addCommands([[CommandType.SHOW_TEXT, "Text to be shown"]]);
    player.init();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>Hello</div>\n<div class="line"></div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(player.isPaused()).toEqual(true);
    expect(player.isBlocked()).toEqual(true);
    expect(slider.disabled).toEqual(true);
    expect(sliderContainer.classList.contains("disabled")).toEqual(true);

    expect(textboxContainer.style.display).toEqual("flex");
    expect(textboxContent.innerHTML).toEqual("Text to be shown");
    textboxContainer.querySelector("i").click();
    await TestUtils.tick();
    expect(textboxContainer.style.display).toEqual("none");

    expect(player.isBlocked()).toEqual(false);
    expect(slider.disabled).toEqual(false);
    expect(sliderContainer.classList.contains("disabled")).toEqual(false);
    done();
  });

  it("should resume playing after show_text", async () => {
    const textArea = document.querySelector("#codepled");
    const textboxContainer = <HTMLElement>(
      document.querySelector(".textbox-container")
    );

    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SHOW_TEXT, "Text to be shown"],
      [CommandType.DELETE, 1],
    ]);
    player.init();
    await player.play();
    textboxContainer.querySelector("i").click();
    await TestUtils.tick();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>ello</div>\n<div class="line"></div>'
    );
  });
  it("should highlight line", async () => {
    const textArea = document.querySelector("#codepled");
    const highlightStyle = 'style="background-color: rgb(0, 66, 18);"';

    player.setInitialText("Hello\nWorld\nLine 3");
    player.addCommands([[CommandType.HIGHLIGHT_LINES, { start: 2, end: 3 }]]);
    player.init();
    await player.play();
    expect(textArea.innerHTML).toEqual(
      '<div class="line"><span class="cursor"></span>Hello</div>\n' +
        `<div class="line" ${highlightStyle}>World</div>\n` +
        `<div class="line" ${highlightStyle}>Line 3</div>`
    );
  });

  fit("should scroll to", async () => {
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
    player.setInitialText(initialText);
    player.addCommands([[CommandType.SCROLL_TO, 50]]);
    player.init();
    await player.play();

    expect(codeContainer.scrollTop).toEqual(lineHeight * 49 + paddingTop);
  });

  it("should increase speed", async () => {
    const speedButton = <HTMLElement>document.querySelector(".speed");
    const speedMeter = document.querySelector(".speedmeter");

    player.init();
    expect(player.getSpeed()).toEqual(1);
    expect(speedMeter.textContent).toEqual("1");

    speedButton.click();
    await TestUtils.tick();

    expect(player.getSpeed()).toEqual(2);
    expect(speedMeter.textContent).toEqual("2");

    speedButton.click();
    await TestUtils.tick();

    expect(player.getSpeed()).toEqual(3);
    expect(speedMeter.textContent).toEqual("3");

    speedButton.click();
    await TestUtils.tick();

    expect(player.getSpeed()).toEqual(1);
    expect(speedMeter.textContent).toEqual("1");
  });

  it("should not increase speed if blocked", async () => {
    const speedButton = <HTMLElement>document.querySelector(".speed");
    const speedMeter = document.querySelector(".speedmeter");

    player.setInitialText("Hello\n");
    player.addCommands([
      [CommandType.SHOW_TEXT, "Text to be shown"],
      [CommandType.DELETE, 1],
    ]);
    player.init();
    await player.play();

    expect(player.isBlocked()).toEqual(true);

    speedButton.click();
    await TestUtils.tick();

    expect(player.getSpeed()).toEqual(1);
    expect(speedMeter.textContent).toEqual("1");
  });

  it("should play", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");

    const playSpy = spyOn(player, "play");

    player.setInitialText("Hello\n");
    player.addCommands([[CommandType.SKIP, 1]]);
    player.init();
    expect(player.isPaused()).toEqual(true);
    playButton.click();
    await TestUtils.tick();
    expect(playSpy).toHaveBeenCalledTimes(1);
  });
  it("should pause", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");

    player.init();
    player["isPaused"] = () => true;
    playButton.click();
    await TestUtils.tick();
    expect(player.isPaused()).toEqual(true);
  });

  it("should not pause if blocked", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");
    player["_isBlocked"] = true;
    player["isPaused"] = () => false;
    player.init();

    playButton.click();
    await TestUtils.tick();
    expect(player.isPaused()).toEqual(false);
  });

  it("should not play if blocked", async () => {
    const playButton = <HTMLElement>document.querySelector(".play");
    player["_isBlocked"] = true;
    player["isPaused"] = () => true;
    player.init();

    playButton.click();
    await TestUtils.tick();
    expect(player.isPaused()).toEqual(true);
  });

  it("should forward on slider change", async () => {
    const slider = <HTMLInputElement>document.querySelector(".slider");
    const textArea = document.querySelector("#codepled");
    player.setInitialText("Hello\nWorld\nLine 3");
    player.addCommands([
      [CommandType.SKIP, 2],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
      [CommandType.INSERT, "r"],
    ]);
    player.init();

    slider.value = "5";
    slider.onchange(<any>{ target: slider });
    expect(textArea.innerHTML).toEqual(
      '<div class="line">Herr<span class="cursor"></span>o</div>\n' +
        '<div class="line">World</div>\n' +
        '<div class="line">Line 3</div>'
    );

    slider.value = "3";
    slider.onchange(<any>{ target: slider });
    expect(textArea.innerHTML).toEqual(
      '<div class="line">He<span class="cursor"></span>o</div>\n' +
        '<div class="line">World</div>\n' +
        '<div class="line">Line 3</div>'
    );

    slider.value = "10";
    slider.onchange(<any>{ target: slider });
    expect(textArea.innerHTML).toEqual(
      '<div class="line">Herrr<span class="cursor"></span>o</div>\n' +
        '<div class="line">World</div>\n' +
        '<div class="line">Line 3</div>'
    );
    expect(player.isPaused()).toEqual(true);
  });
});
