import { Utils } from "../../Utils/Utils";

export interface Range {
  from: number;
  till: number;
}

export interface CommandDetails {
  textBefore: string;
  linesBefore: number;
  startsOnFreshLine: boolean;
  endsWithNewLine: boolean;
  linesToAdd: number;
}

export abstract class AbstractDetector {
  protected touchedLines: Set<number>;

  process(
    text: string,
    cursor: number,
    textToUpdate: string,
    touchedLines: Set<number>
  ): Set<number> {
    this.touchedLines = touchedLines;
    const commandDetails = this.createCommandDetails(
      text,
      cursor,
      textToUpdate
    );
    this.insertLinesTouched(this.getLinesToUpdateCompletely(commandDetails));
    this.addLinesTouched(commandDetails);
    return this.touchedLines;
  }

  protected abstract getLinesToUpdateCompletely(
    commandDetails: CommandDetails
  ): Range;

  protected abstract processAndShift(line: number): void;

  protected abstract addLinesTouched(commandDetails: CommandDetails): void;

  protected insertLinesTouched(lines: Range) {
    for (let lineNo = lines.from; lineNo <= lines.till; lineNo++) {
      this.processAndShift(lines.from);
    }
  }

  protected createCommandDetails(
    text: string,
    cursor: number,
    payload: string
  ): CommandDetails {
    const textBefore = text.substr(0, cursor);
    const linesBefore = Utils.countLines(textBefore);
    const startsOnFreshLine = textBefore.endsWith("\n");
    const endsWithNewLine = payload.endsWith("\n");
    const linesToAdd = Utils.countLines(payload) - 1;
    return {
      textBefore,
      linesBefore,
      startsOnFreshLine,
      endsWithNewLine,
      linesToAdd,
    };
  }

  protected shift(line: number, shiftFn: (lineNo: number) => number) {
    const largerLines = [...this.touchedLines].filter(
      (lineTouched) => lineTouched >= line
    );
    largerLines.forEach((lineTouched) => {
      this.touchedLines.delete(lineTouched);
    });
    largerLines.forEach((lineTouched) => {
      this.touchedLines.add(shiftFn(lineTouched));
    });
  }
}
