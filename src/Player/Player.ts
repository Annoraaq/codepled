import { Command, CommandType } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";
import { PlayerUi } from "./PlayerUi";

export class Player {
  private commands: Command[];
  private currentCommandIndex = 0;
  private isPlaying = false;
  private trueText: string;
  private SPEED: { [key: number]: number } = { 3: 10, 2: 50, 1: 100 };
  private _isBlocked = false;
  private speed = 1;
  private initialText = "";
  private highlightedLines = { start: -1, end: -2 };
  cursor = 0;

  constructor() {
    this.commands = [];
  }

  addCommands(commands: Command[]): void {
    this.commands = [...this.commands, ...commands];
  }

  getCommands(): Command[] {
    return this.commands;
  }

  getHighlightedLines(): { start: number; end: number } {
    return this.highlightedLines;
  }

  setCurrentCommandIndex(newIndex: number) {
    this.currentCommandIndex = newIndex;
    var event = new CustomEvent("changeCommandIndex", {
      detail: {
        index: newIndex,
      },
    });
    dispatchEvent(event);
  }

  getCurrentCommandIndex(): number {
    return this.currentCommandIndex;
  }

  isPaused(): boolean {
    return !this.isPlaying;
  }

  pause(): void {
    if (this._isBlocked) return;
    this.isPlaying = false;
    dispatchEvent(new CustomEvent("pause"));
  }

  isBlocked(): boolean {
    return this._isBlocked;
  }

  block() {
    this._isBlocked = true;
  }

  unblock() {
    this._isBlocked = false;
  }

  isLastCommand(): boolean {
    return this.currentCommandIndex == this.commands.length - 1;
  }

  getSpeed(): number {
    return this.speed;
  }

  increaseSpeed(): void {
    if (this._isBlocked) return;
    this.speed = (this.speed + 1) % 4;
    if (this.speed == 0) this.speed = 1;
  }

  async play() {
    if (this._isBlocked) return;
    if (this.currentCommandIndex >= this.getCommands().length) {
      this.setCurrentCommandIndex(0);
    }
    if (this.currentCommandIndex == 0) {
      this.reset();
    }

    this.isPlaying = true;
    dispatchEvent(new CustomEvent("play"));

    while (
      this.currentCommandIndex < this.commands.length &&
      !this.isPaused()
    ) {
      this.processCommand(this.commands[this.currentCommandIndex]);
      this.setCurrentCommandIndex(this.currentCommandIndex + 1);
      if (this.currentCommandIndex >= this.commands.length) {
        this.pause();
      }
      await Utils.sleep(this.SPEED[this.speed]);
    }
  }

  setText(text: string) {
    this.trueText = text;
    var event = new CustomEvent("changeText", {
      detail: {
        text,
        cursor: this.cursor,
      },
    });
    dispatchEvent(event);
  }

  getText(): string {
    return this.trueText;
  }

  scrollTo(line: number) {
    const event = new CustomEvent("scrollTo", {
      detail: {
        line,
      },
    });
    dispatchEvent(event);
  }

  forwardTo(targetIndex: number) {
    if (targetIndex < this.getCurrentCommandIndex()) {
      this.setCurrentCommandIndex(0);
    }
    if (this.getCurrentCommandIndex() == 0) this.reset();

    while (this.getCurrentCommandIndex() < targetIndex) {
      this.processCommand(this.getCommands()[this.getCurrentCommandIndex()]);
      this.setCurrentCommandIndex(this.getCurrentCommandIndex() + 1);
      if (this.getCurrentCommandIndex() >= this.getCommands().length) {
        this.pause();
        break;
      }
    }
  }

  processCommand([commandNo, payload]: any[]) {
    if (commandNo === CommandType.INSERT) {
      const newText =
        this.getText().substr(0, this.cursor) +
        payload +
        this.getText().substr(this.cursor);
      this.cursor += payload.length;
      this.setText(newText);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.DELETE) {
      const newText =
        this.getText().substr(0, this.cursor) +
        this.getText().substr(this.cursor + payload);
      this.setText(newText);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.SKIP) {
      this.cursor += payload;
      this.setText(this.getText());
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.SHOW_TEXT) {
      this.pause();
      this.block();
      const event = new CustomEvent("showText", {
        detail: {
          message: payload,
        },
      });
      dispatchEvent(event);
    } else if (commandNo === CommandType.HIGHLIGHT_LINES) {
      this.highlightedLines = payload;
      this.setText(this.getText());
    } else if (commandNo === CommandType.SCROLL_TO) {
      this.scrollTo(payload);
    }
  }

  private getCursorLine() {
    const beforeCursor = this.trueText.substr(0, this.cursor);
    return (beforeCursor.match(/\n/g) || []).length + 1;
  }

  reset() {
    this.cursor = 0;
    this.setText(this.initialText);
    this.highlightedLines = { start: -1, end: -2 };
  }

  setInitialText(initialText: string) {
    this.initialText = initialText;
  }

  getCursor(): number {
    return this.cursor;
  }

  playPause(): void {
    !this.isPlaying ? this.play() : this.pause();
  }
}
