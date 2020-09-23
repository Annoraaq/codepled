import { CommandType } from "./../DiffConverter/Commands";
import { Player } from "./Player";

let player: Player;

describe("Player", () => {
  beforeEach(() => {
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

  it("processes a delete commaand", () => {
    player.addCommands([[CommandType.DELETE, 1]]);
    player.init();
    player.play();
  });
});
