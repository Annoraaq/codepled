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

export class InsertDetector extends AbstractDetector {
  constructor(touchedLines: Set<number>) {
    super(touchedLines);
  }

  process(text: string, cursor: number, payload: string) {
    const commandDetails = this.getCommandDetails(text, cursor, payload);
    this.insertLinesTouched(this.getLinesToInsertCompletely(commandDetails));
    this.addLinesTouched(commandDetails);
  }

  private getLinesToInsertCompletely(commandDetails: CommandDetails): Range {
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

  protected processAndShift(line: number) {
    this.shift(line, (lineNo) => lineNo + 1);
    this.touchedLines.add(line);
  }
}
