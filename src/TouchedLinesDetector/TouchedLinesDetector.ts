import { Utils } from "../Utils/Utils";

interface Range {
  from: number;
  till: number;
}

export class TouchedLinesDetector {
  private touchedLines: Set<number> = new Set<number>();

  getTouchedLines(): Set<number> {
    return this.touchedLines;
  }

  reset(): void {
    this.touchedLines.clear();
  }

  processShowText(): void {
    this.reset();
  }

  processDelete(text: string, cursor: number, numberOfCharsToDelete: number) {
    const deletedText = text.substr(cursor, numberOfCharsToDelete);
    this.removeLinesTouched(
      this.getLinesToDeleteCompletely(text, cursor, deletedText)
    );
    this.addLinesTouchedByDelete(text, cursor, deletedText);
  }

  private getCommandDetails(text: string, cursor: number, payload: string) {
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
  private addLinesTouchedByDelete(
    text: string,
    cursor: number,
    deletedText: string
  ) {
    const commandDetails = this.getCommandDetails(text, cursor, deletedText);

    if (!commandDetails.startsOnFreshLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
    if (!commandDetails.endsWithNewLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
  }

  private getLinesToDeleteCompletely(
    text: string,
    cursor: number,
    deletedText: string
  ): Range {
    const commandDetails = this.getCommandDetails(text, cursor, deletedText);
    const linesToDeleteCompletely = {
      from: commandDetails.linesBefore,
      till: commandDetails.linesBefore + commandDetails.linesToAdd - 1,
    };
    if (deletedText.length > 0) {
      if (!commandDetails.startsOnFreshLine) {
        if (commandDetails.endsWithNewLine) {
          linesToDeleteCompletely.from++;
        }
      }
    }
    return linesToDeleteCompletely;
  }

  private getLinesToInsertCompletely(
    text: string,
    cursor: number,
    payload: string
  ): Range {
    const commandDetails = this.getCommandDetails(text, cursor, payload);

    const linesToAddCompletely = {
      from: commandDetails.linesBefore,
      till: commandDetails.linesBefore + commandDetails.linesToAdd - 1,
    };

    if (!commandDetails.startsOnFreshLine) {
      linesToAddCompletely.from++;
      linesToAddCompletely.till++;
    }
    return linesToAddCompletely;
  }

  processInsert(text: string, cursor: number, payload: string) {
    this.insertLinesTouched(
      this.getLinesToInsertCompletely(text, cursor, payload)
    );
    this.addLinesTouchedByInsert(text, cursor, payload);
  }

  addLinesTouchedByInsert(text: string, cursor: number, payload: string) {
    const commandDetails = this.getCommandDetails(text, cursor, payload);

    if (!commandDetails.startsOnFreshLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
    if (!commandDetails.endsWithNewLine) {
      this.touchedLines.add(
        commandDetails.linesBefore + commandDetails.linesToAdd
      );
    }
  }

  private removeLinesTouched(lines: Range) {
    for (let lineNo = lines.from; lineNo <= lines.till; lineNo++) {
      this.removeLineAndShift(lines.from);
    }
  }

  private insertLinesTouched(lines: Range) {
    for (let lineNo = lines.from; lineNo <= lines.till; lineNo++) {
      this.insertLineAndShift(lines.from);
    }
  }

  private insertLineAndShift(line: number) {
    const toAdd: number[] = [];
    [...this.touchedLines].forEach((lineTouched) => {
      if (lineTouched >= line) {
        this.touchedLines.delete(lineTouched);
        toAdd.push(lineTouched + 1);
      }
    });

    toAdd.forEach((line) => this.touchedLines.add(line));
    this.touchedLines.add(line);
  }

  private removeLineAndShift(line: number) {
    this.touchedLines.delete(line);
    const toAdd: number[] = [];
    [...this.touchedLines].forEach((lineTouched) => {
      if (lineTouched > line) {
        this.touchedLines.delete(lineTouched);
        toAdd.push(lineTouched - 1);
      }
    });

    toAdd.forEach((line) => this.touchedLines.add(line));
  }
}
