import { mocked } from "ts-jest/utils";
import { CommandType } from "./../DiffConverter/Commands";
import { Player } from "./Player";
import * as hljs from "highlight.js";
jest.mock("highlight.js");

const mockedHljs = mocked(hljs, true);

let player: Player;

describe("Player", () => {
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
    player["sleep"] = jest.fn(() => Promise.resolve());
  });

  it("should set current command index", () => {
    player.addCommands([
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
      [CommandType.DELETE, 1],
    ]);
    player.init();
    player.setCurrentCommandIndex(4);
    expect(player.getCurrentCommandIndex()).toEqual(4);
    const slider = <HTMLInputElement>document.querySelector(".slider");
    expect(slider.value).toEqual("4");
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
      '<div class="line"><span class="cursor"></span>World!\n</div><div class="line">Last line</div><div class="line"></div>'
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
      '<div class="line">Hello\n</div><div class="line">Worl<span class="cursor"></span>!</div><div class="line"></div>'
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
      '<div class="line">Hello\n</div><div class="line">Worl<span class="cursor"></span>d!</div><div class="line"></div>'
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
      '<div class="line">Hello\n</div><div class="line">world<span class="cursor"></span></div><div class="line"></div>'
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
      '<div class="line"><span class="cursor"></span>Hello\n</div><div class="line"></div>'
    );
    expect(linesContainer.innerHTML).toEqual("1<br>2<br>");
    expect(player.isPaused()).toEqual(true);
    expect(player.isBlocked()).toEqual(true);
    expect(slider.disabled).toEqual(true);
    expect(sliderContainer.classList.contains("disabled")).toEqual(true);

    expect(textboxContainer.style.display).toEqual("flex");
    expect(textboxContent.innerHTML).toEqual("Text to be shown");
    textboxContainer.querySelector("i").click();
    setTimeout(() => {
      expect(textboxContainer.style.display).toEqual("none");

      expect(player.isBlocked()).toEqual(false);
      expect(slider.disabled).toEqual(false);
      expect(sliderContainer.classList.contains("disabled")).toEqual(false);
      done();
    }, 0);
  });

  it("should resume playing after show_text", async (done) => {
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
    setTimeout(() => {
      expect(textArea.innerHTML).toEqual(
        '<div class="line"><span class="cursor"></span>ello\n</div><div class="line"></div>'
      );
      done();
    }, 0);
  });
});
