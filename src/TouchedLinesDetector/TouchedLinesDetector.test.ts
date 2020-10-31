import { DeleteDetector } from "./DeleteDetector/DeleteDetector";
import { InsertDetector } from "./InsertDetector/InsertDetector";
import { TouchedLinesDetector } from "./TouchedLinesDetector";

describe("TouchedLinesDetector", () => {
  let touchedLinesDetector: TouchedLinesDetector;
  let insertDetector: InsertDetector;
  let deleteDetector: DeleteDetector;
  let touchedLines: Set<number>;

  beforeEach(() => {
    touchedLines = new Set([]);
    insertDetector = new InsertDetector();
    deleteDetector = new DeleteDetector();
    touchedLinesDetector = new TouchedLinesDetector(
      insertDetector,
      deleteDetector,
      touchedLines
    );
  });

  it("should reset touchedLines", () => {
    touchedLines.add(3);
    expect(touchedLinesDetector.getTouchedLines().size).toEqual(1);

    touchedLinesDetector.reset();
    expect(touchedLinesDetector.getTouchedLines().size).toEqual(0);
  });

  it("should process inserts", () => {
    const newTouchedLines = new Set([2, 3]);
    const processSpy = spyOn(insertDetector, "process").and.returnValue(
      newTouchedLines
    );
    touchedLinesDetector.processInsert("text", 2, "payload");
    expect(processSpy).toHaveBeenCalledWith("text", 2, "payload", touchedLines);
    expect(touchedLinesDetector.getTouchedLines()).toEqual(newTouchedLines);
  });

  it("should process deletes", () => {
    const newTouchedLines = new Set([2, 3]);
    const processSpy = spyOn(deleteDetector, "process").and.returnValue(
      newTouchedLines
    );
    touchedLinesDetector.processDelete("text", 1, 3);
    expect(processSpy).toHaveBeenCalledWith("text", 1, "ext", touchedLines);
    expect(touchedLinesDetector.getTouchedLines()).toEqual(newTouchedLines);
  });

  it("should process show text", () => {
    touchedLines.add(3);
    expect(touchedLinesDetector.getTouchedLines().size).toEqual(1);

    touchedLinesDetector.processShowText();
    expect(touchedLinesDetector.getTouchedLines().size).toEqual(0);
  });
});
