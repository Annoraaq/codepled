import { TouchedLinesDetector } from "./../TouchedLinesDetector/TouchedLinesDetector";
import { FastForwardCommand } from "./../DiffConverter/Commands";
import {
  CommandController,
  TextStep,
} from "./../CommandController/CommandController";
import { Command, CommandType } from "../DiffConverter/Commands";
import { Utils } from "../Utils/Utils";

export enum PlayerEventType {
  PAUSE = "PLAYER_PAUSE",
  PLAY = "PLAYER_PLAY",
  CHANGE_TEXT = "PLAYER_CHANGE_TEXT",
  CHANGE_COMMAND_INDEX = "PLAYER_CHANGE_COMMAND_INDEX",
  SCROLL_TO = "PLAYER_SCROLL_TO",
  SHOW_TEXT = "PLAYER_SHOW_TEXT",
}

export class Player {
  private currentStepIndex = 0;
  private isPlaying = false;
  private trueText: string;
  private SPEED: { [key: number]: number } = { 3: 10, 2: 50, 1: 100 };
  private speed = 1;
  private initialText = "";
  private highlightedLines = { start: -1, end: -2 };
  private cursor = 0;
  private commandController: CommandController;
  private texts: { text: string; stepIndex: number }[] = [];
  private touchedLinesDetector: TouchedLinesDetector;

  constructor() {
    this.commandController = new CommandController();
    this.touchedLinesDetector = new TouchedLinesDetector();
  }

  addCommands(commands: Command[]): void {
    this.commandController.addCommands(commands);
  }

  getCommandCount(): number {
    return this.commandController.getTotalSteps();
  }

  getHighlightedLines(): { start: number; end: number } {
    return this.highlightedLines;
  }

  getLinesTouched(): Set<number> {
    return this.touchedLinesDetector.getTouchedLines();
  }

  setCurrentStepIndex(newIndex: number) {
    this.currentStepIndex = newIndex;
    var event = new CustomEvent(PlayerEventType.CHANGE_COMMAND_INDEX, {
      detail: {
        index: newIndex,
      },
    });
    dispatchEvent(event);
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  isPaused(): boolean {
    return !this.isPlaying;
  }

  pause(): void {
    this.isPlaying = false;
    dispatchEvent(new CustomEvent(PlayerEventType.PAUSE));
  }

  isLastCommand(): boolean {
    return this.currentStepIndex == this.getCommandCount() - 1;
  }

  getSpeed(): number {
    return this.speed;
  }

  increaseSpeed(): void {
    this.speed = (this.speed + 1) % 4;
    if (this.speed == 0) this.speed = 1;
  }

  getTextSteps(): TextStep[] {
    return this.commandController.getTextSteps();
  }

  reset() {
    this.cursor = 0;
    this.touchedLinesDetector.reset();
    this.highlightedLines = { start: -1, end: -2 };
    this.texts = [];
    this.currentStepIndex = 0;
    this.setText(this.initialText);
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

  getTexts(): { text: string; stepIndex: number }[] {
    return this.texts;
  }

  async play() {
    if (this.currentStepIndex >= this.getCommandCount()) {
      this.setCurrentStepIndex(0);
    }
    if (this.currentStepIndex == 0) {
      this.reset();
    }

    this.isPlaying = true;
    dispatchEvent(new CustomEvent(PlayerEventType.PLAY));

    while (this.currentStepIndex < this.getCommandCount() && !this.isPaused()) {
      this.processCommand(
        this.commandController.getCommandAtStep(this.currentStepIndex)
      );
      this.setCurrentStepIndex(this.currentStepIndex + 1);
      if (this.currentStepIndex >= this.getCommandCount()) {
        this.pause();
      }
      await Utils.sleep(this.SPEED[this.speed]);
    }
  }

  setText(text: string) {
    this.trueText = text;
    var event = new CustomEvent(PlayerEventType.CHANGE_TEXT, {
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
    const event = new CustomEvent(PlayerEventType.SCROLL_TO, {
      detail: {
        line,
      },
    });
    dispatchEvent(event);
  }

  forwardTo(targetIndex: number) {
    this.reset();

    const ffCommands = this.commandController.getFastForwardCommands(
      targetIndex
    );

    ffCommands.forEach((command) => {
      this.fastProcessCommand(command);
    });

    this.setText(this.getText());
    this.setCurrentStepIndex(targetIndex);
    const event = new CustomEvent(PlayerEventType.SHOW_TEXT, {
      detail: {
        message: "",
      },
    });
    dispatchEvent(event);
  }

  private fastProcessCommand({ type, payload, steps }: FastForwardCommand) {
    if (type === CommandType.INSERT) {
      this.processInsert(payload);
      this.currentStepIndex += steps;
    } else if (type === CommandType.DELETE) {
      this.processDelete(payload);
      this.currentStepIndex += 1;
    } else if (type === CommandType.SKIP) {
      this.processSkip(payload);
      this.currentStepIndex++;
    } else if (type === CommandType.SHOW_TEXT) {
      this.processShowText(payload);
      this.currentStepIndex++;
    } else if (type === CommandType.SET_CURSOR) {
      this.cursor = payload;
      this.currentStepIndex++;
    } else {
      this.currentStepIndex++;
    }
  }

  private processInsert(payload: string) {
    this.touchedLinesDetector.processInsert(
      this.getText(),
      this.cursor,
      payload
    );
    this.trueText =
      this.getText().substr(0, this.cursor) +
      payload +
      this.getText().substr(this.cursor);
    this.cursor += payload.length;
  }

  private processDelete(payload: number) {
    this.touchedLinesDetector.processDelete(
      this.getText(),
      this.cursor,
      payload
    );
    this.trueText =
      this.getText().substr(0, this.cursor) +
      this.getText().substr(this.cursor + payload);
  }

  private processSkip(payload: number) {
    this.cursor += payload;
  }

  private processShowText(payload: { message: string }) {
    this.touchedLinesDetector.reset();
    this.texts.push({
      text: payload.message,
      stepIndex: this.currentStepIndex + 1,
    });
  }

  private processCommand([commandNo, payload]: any[]) {
    if (commandNo === CommandType.INSERT) {
      this.processInsert(payload);
      this.setText(this.trueText);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.DELETE) {
      this.processDelete(payload);
      this.setText(this.trueText);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.SKIP) {
      this.processSkip(payload);
      this.setText(this.trueText);
      this.scrollTo(this.getCursorLine());
    } else if (commandNo === CommandType.SHOW_TEXT) {
      this.processShowText(payload);
      if (payload.pause) {
        this.pause();
      }
      const event = new CustomEvent(PlayerEventType.SHOW_TEXT, {
        detail: {
          message: payload.message,
        },
      });
      dispatchEvent(event);
    } else if (commandNo === CommandType.HIGHLIGHT_LINES) {
      this.highlightedLines = payload;
      this.setText(this.trueText);
    } else if (commandNo === CommandType.SCROLL_TO) {
      this.scrollTo(payload);
    } else if (commandNo === CommandType.SET_CURSOR) {
      this.cursor = payload;
      this.setText(this.trueText);
    } else if (commandNo === CommandType.PAUSE) {
      this.pause();
    }
  }

  private getCursorLine() {
    const beforeCursor = this.trueText.substr(0, this.cursor);
    return (beforeCursor.match(/\n/g) || []).length + 1;
  }
}
