import { DeleteDetector } from "./DeleteDetector/DeleteDetector";
import { InsertDetector } from "./InsertDetector/InsertDetector";
import { Utils } from "../Utils/Utils";
import { textSpanIsEmpty } from "typescript";

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

export class TouchedLinesDetector {
  private touchedLines: Set<number>;

  private insertDetector: InsertDetector;
  private deleteDetector: DeleteDetector;

  constructor() {
    this.touchedLines = new Set<number>();
    this.insertDetector = new InsertDetector(this.touchedLines);
    this.deleteDetector = new DeleteDetector(this.touchedLines);
  }

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
    this.deleteDetector.process(text, cursor, numberOfCharsToDelete);
  }

  processInsert(text: string, cursor: number, payload: string) {
    this.insertDetector.process(text, cursor, payload);
  }
}
