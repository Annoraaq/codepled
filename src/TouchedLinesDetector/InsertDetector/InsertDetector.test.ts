import { InsertDetector } from "./InsertDetector";
describe("InsertDetector", () => {
  let insertDetector: InsertDetector;
  let touchedLines: Set<number>;

  beforeEach(() => {
    touchedLines = new Set();
    insertDetector = new InsertDetector(touchedLines);
  });

  describe("Insert", () => {
    it("should process inserting a new line inbewteen", () => {
      /*
    Line1
    [LineX]
    Line3
    */
      const text = "Line1\nLine2";
      const cursor = 6;
      const toInsert = "[LineX]\n";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([2, 5, 6]));
    });

    it("should process inserting new lines inbewteen", () => {
      /*
    Line1
    [LineX]
    [LineY]
    Line3
    */
      const text = "Line1\nLine2";
      const cursor = 6;
      const toInsert = "[LineX]\n[LineY]\n";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([2, 3, 6, 7]));
    });

    it("should process inserting inside an existing line", () => {
      /*
    Line2
    Li[X]ne2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 8;
      const toInsert = "[X]";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([2, 4, 5]));
    });

    it("should process inserting a new line starting in the prev one", () => {
      /*
    Lin[LineX]
    e1
    Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toInsert = "[LineX]\n";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([1, 2, 5, 6]));
    });

    it("should process inserting new lines starting in the prev one", () => {
      /*
    Lin[LineX]
    [LineY]
    e1
    Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toInsert = "[LineX]\n[LineY]\n";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([1, 2, 3, 6, 7]));
    });

    it("should process inserting a new line ending in an existing one", () => {
      /*
    Line1
    [LineX]
    [X]Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 6;
      const toInsert = "[LineX]\n[X]";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([2, 3, 5, 6]));
    });

    it("should process inserting new lines ending in an existing one", () => {
      /*
    Line1
    [LineX]
    [LineY]
    [X]Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 6;
      const toInsert = "[LineX]\n[LineY]\n[X]";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([2, 3, 4, 6, 7]));
    });

    it("should process insert starting and ending in 2 existing lines", () => {
      /*
    Lin[LineX]
    [X]e1
    Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toInsert = "[LineX]\n[X]";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([1, 2, 5, 6]));
    });

    it("should process insert lines starting and ending in 2 existing lines", () => {
      /*
    Lin[LineX]
    [LineY]
    [X]e1
    Line2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toInsert = "[LineX]\n[LineY]\n[X]";
      touchedLines.add(4);
      touchedLines.add(5);
      insertDetector.process(text, cursor, toInsert);

      expect(touchedLines).toEqual(new Set([1, 2, 3, 6, 7]));
    });
  });
});
