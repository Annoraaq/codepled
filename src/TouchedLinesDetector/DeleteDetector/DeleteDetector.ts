import {
  AbstractDetector,
  CommandDetails,
  Range,
} from "../AbstractDetector/AbstractDetector";

export class DeleteDetector extends AbstractDetector {
  protected getLinesToUpdateCompletely(commandDetails: CommandDetails): Range {
    const linesToDeleteCompletely = {
      from: commandDetails.linesBefore,
      till: commandDetails.linesBefore + commandDetails.linesToAdd - 1,
    };
    if (!commandDetails.startsOnFreshLine && commandDetails.endsWithNewLine) {
      linesToDeleteCompletely.from++;
    }
    return linesToDeleteCompletely;
  }

  protected addLinesTouched(commandDetails: CommandDetails) {
    if (!commandDetails.startsOnFreshLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
    if (!commandDetails.endsWithNewLine) {
      this.touchedLines.add(commandDetails.linesBefore);
    }
  }

  protected processAndShift(line: number) {
    this.touchedLines.delete(line);
    this.shift(line, (lineNo) => lineNo - 1);
  }
}
