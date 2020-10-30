import { Utils } from "../../Utils/Utils";
import { AbstractDetector } from "../AbstractDetector/AbstractDetector";

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

export class DeleteDetector extends AbstractDetector {
  constructor(touchedLines: Set<number>) {
    super(touchedLines);
  }

  process(text: string, cursor: number, numberOfCharsToDelete: number) {
    const deletedText = text.substr(cursor, numberOfCharsToDelete);
    const commandDetails = this.getCommandDetails(text, cursor, deletedText);
    this.insertLinesTouched(this.getLinesToDeleteCompletely(commandDetails));
    commandDetails.linesToAdd = 0;
    this.addLinesTouched(commandDetails);
  }

  private getLinesToDeleteCompletely(commandDetails: CommandDetails): Range {
    const linesToDeleteCompletely = {
      from: commandDetails.linesBefore,
      till: commandDetails.linesBefore + commandDetails.linesToAdd - 1,
    };
    if (!commandDetails.startsOnFreshLine && commandDetails.endsWithNewLine) {
      linesToDeleteCompletely.from++;
    }
    return linesToDeleteCompletely;
  }

  protected processAndShift(line: number) {
    this.touchedLines.delete(line);
    this.shift(line, (lineNo) => lineNo - 1);
  }
}
