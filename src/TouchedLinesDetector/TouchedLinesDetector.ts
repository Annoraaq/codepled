import { DeleteDetector } from "./DeleteDetector/DeleteDetector";
import { InsertDetector } from "./InsertDetector/InsertDetector";

export class TouchedLinesDetector {
  private touchedLines: Set<number>;

  private insertDetector: InsertDetector;
  private deleteDetector: DeleteDetector;

  constructor() {
    this.touchedLines = new Set<number>();
    this.insertDetector = new InsertDetector();
    this.deleteDetector = new DeleteDetector();
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
    const deletedText = text.substr(cursor, numberOfCharsToDelete);
    this.touchedLines = this.deleteDetector.process(
      text,
      cursor,
      deletedText,
      this.touchedLines
    );
  }

  processInsert(text: string, cursor: number, payload: string) {
    this.touchedLines = this.insertDetector.process(
      text,
      cursor,
      payload,
      this.touchedLines
    );
  }
}
