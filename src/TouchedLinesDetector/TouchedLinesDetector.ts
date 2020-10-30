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
    const textBeforeDelete = text.substr(0, cursor);
    const linesBeforeDelete = Utils.countLines(textBeforeDelete);
    const deletedText = text.substr(cursor, numberOfCharsToDelete);
    const startsDeletingOnFreshLine = textBeforeDelete.endsWith("\n");
    const isFirstLineOnlyPartiallyDeleted = !startsDeletingOnFreshLine;
    const isLastLineOnlyPartiallyDeleted = !deletedText.endsWith("\n");

    const numberOfLinesToDelete = Utils.countLines(deletedText) - 1;

    const linesToDeleteCompletely = {
      from: linesBeforeDelete,
      till: linesBeforeDelete + numberOfLinesToDelete,
    };

    if (numberOfLinesToDelete <= 0) {
      linesToDeleteCompletely.from = 1;
      linesToDeleteCompletely.till = 0;
    } else {
      if (!isFirstLineOnlyPartiallyDeleted && !isLastLineOnlyPartiallyDeleted) {
        linesToDeleteCompletely.till--;
      } else if (
        isFirstLineOnlyPartiallyDeleted &&
        !isLastLineOnlyPartiallyDeleted
      ) {
        linesToDeleteCompletely.from++;
        linesToDeleteCompletely.till--;
      } else if (
        !isFirstLineOnlyPartiallyDeleted &&
        isLastLineOnlyPartiallyDeleted
      ) {
        linesToDeleteCompletely.till--;
      } else if (
        isFirstLineOnlyPartiallyDeleted &&
        isLastLineOnlyPartiallyDeleted
      ) {
        linesToDeleteCompletely.till--;
      }
    }

    this.removeLinesTouched(linesToDeleteCompletely);

    if (!startsDeletingOnFreshLine) {
      this.touchedLines.add(linesBeforeDelete);
    }

    if (
      isLastLineOnlyPartiallyDeleted &&
      linesToDeleteCompletely.till - linesToDeleteCompletely.from >= 0
    ) {
      this.touchedLines.add(linesBeforeDelete);
    }
  }

  processInsert(text: string, cursor: number, payload: string) {
    const textBeforeInsert = text.substr(0, cursor);
    const linesBeforePayload = Utils.countLines(textBeforeInsert);
    const startsInsertOnFreshLine = textBeforeInsert.endsWith("\n");
    const insertEndsWithNewLine = payload.endsWith("\n");
    const linesToAdd = Utils.countLines(payload) - 1;

    const toAdd = [];
    let linesToAddCompletely = [];
    if (!startsInsertOnFreshLine && insertEndsWithNewLine) {
      toAdd.push(linesBeforePayload);
      for (let i = 1; i <= linesToAdd; i++) {
        linesToAddCompletely.push(linesBeforePayload + i);
      }
    } else if (!startsInsertOnFreshLine && !insertEndsWithNewLine) {
      toAdd.push(linesBeforePayload);
      for (let i = 1; i <= linesToAdd; i++) {
        linesToAddCompletely.push(linesBeforePayload + i);
      }
    } else if (startsInsertOnFreshLine && insertEndsWithNewLine) {
      for (let i = 0; i < linesToAdd; i++) {
        linesToAddCompletely.push(linesBeforePayload + i);
      }
    } else if (startsInsertOnFreshLine && !insertEndsWithNewLine) {
      for (let i = 0; i < linesToAdd; i++) {
        linesToAddCompletely.push(linesBeforePayload + i);
      }
      toAdd.push(linesBeforePayload + linesToAdd);
    }

    linesToAddCompletely.forEach((lineToAdd) => {
      const toAdd: number[] = [];
      [...this.touchedLines].forEach((lineTouched) => {
        if (lineTouched >= lineToAdd) {
          this.touchedLines.delete(lineTouched);
          toAdd.push(lineTouched + 1);
        }
      });

      toAdd.forEach((line) => this.touchedLines.add(line));
    });

    linesToAddCompletely.forEach((lineToAdd) => {
      this.touchedLines.add(lineToAdd);
    });

    toAdd.forEach((lineToAdd) => {
      this.touchedLines.add(lineToAdd);
    });
  }

  private removeLinesTouched(lines: Range) {
    for (let lineNo = lines.from; lineNo <= lines.till; lineNo++) {
      this.removeLineTouchedByInsert(lines.from);
    }
  }

  private removeLineTouchedByInsert(line: number) {
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
