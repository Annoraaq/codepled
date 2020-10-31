import {
  AbstractDetector,
  CommandDetails,
  Range,
} from "../AbstractDetector/AbstractDetector";

export class InsertDetector extends AbstractDetector {
  protected getLinesToUpdateCompletely(commandDetails: CommandDetails): Range {
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

  protected processAndShift(line: number) {
    this.shift(line, (lineNo) => lineNo + 1);
    this.touchedLines.add(line);
  }
}
