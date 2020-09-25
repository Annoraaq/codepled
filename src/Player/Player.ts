import { Command, CommandType } from "../DiffConverter/Commands";
import { PlayerUi } from "./PlayerUi";

export class Player {
  private commands: Command[];
  private currentCommandIndex = 0;
  private isPlaying = false;
  private trueText: string;
  private cursorText = '<span class="cursor"></span>';
  highlightedLines = { start: -1, end: -2 };
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
    this.isPlaying = false;
    var event = document.createEvent("Event");
    event.initEvent("pause", true, true);
    dispatchEvent(event);
  }

  play(): void {
    this.isPlaying = true;
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
    var event = new CustomEvent("scrollTo", {
      detail: {
        line,
      },
    });
    dispatchEvent(event);
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
}
