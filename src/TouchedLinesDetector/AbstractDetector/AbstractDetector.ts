import { Utils } from "../../Utils/Utils";

interface Range {
  from: number;
  till: number;
}

interface CommandDetails {
  textBefore: string;
  linesBefore: number;
  startsOnFreshLine: boolean;
  endsWithNewLine: boolean;
  linesToAdd: number;
}

export abstract class AbstractDetector {
  constructor(protected touchedLines: Set<number>) {}

  abstract process(
    text: string,
    cursor: number,
    payload: string | number
  ): void;

  protected abstract processAndShift(line: number): void;

  protected addLinesTouched(commandDetails: CommandDetails) {
    if (!commandDetails.startsOnFreshLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
    if (!commandDetails.endsWithNewLine) {
      this.touchedLines.add(
        commandDetails.linesBefore + commandDetails.linesToAdd
      );
    }
  }

  protected insertLinesTouched(lines: Range) {
    for (let lineNo = lines.from; lineNo <= lines.till; lineNo++) {
      this.processAndShift(lines.from);
    }
  }

  protected getCommandDetails(
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
