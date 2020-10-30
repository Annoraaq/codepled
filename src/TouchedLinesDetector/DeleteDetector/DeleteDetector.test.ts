import { DeleteDetector } from "./DeleteDetector";
describe("DeleteDetector", () => {
  let deleteDetector: DeleteDetector;
  let touchedLines: Set<number>;

  beforeEach(() => {
    touchedLines = new Set();
    deleteDetector = new DeleteDetector(touchedLines);
  });

  describe("Delete", () => {
    it("should process deleting a new line inbetween", () => {
      /*
    Line1
    <<Line2>>
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 6;
      const toDelete = 6;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([3, 4]));
    });

    it("should process deleting lines inbetween", () => {
      /*
    Line1
    <<Line2>>
    <<Line3>>
    Line4
    */
      const text = "Line1\nLine2\nLine3\nLine4";
      const cursor = 6;
      const toDelete = 12;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([2, 3]));
    });

    it("should process delete inside an existing line", () => {
      /*
    Line2
    Li<<n>>e2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 8;
      const toDelete = 1;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([2, 4, 5]));
    });

    it("should process deleting a line starting in the prev one", () => {
      /*
    Lin<<e1
    Line2>>
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toDelete = 9;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([1, 3, 4]));
    });

    it("should process deleting lines starting in the prev one", () => {
      /*
    Lin<<e1
    Line2
    Line3>>
    Line4
    */
      const text = "Line1\nLine2\nLine3\nLine4";
      const cursor = 3;
      const toDelete = 15;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([1, 2, 3]));
    });

    it("should process deleting a new line ending in an existing one", () => {
      /*
    Line1
    <<Line2
    L>>ine3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 6;
      const toDelete = 7;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([2, 3, 4]));
    });

    it("should process deleting lines ending in an existing one", () => {
      /*
    Line1
    <<Line2
    Line3
    L>>ine4
    */
      const text = "Line1\nLine2\nLine3\nLine4";
      const cursor = 6;
      const toDelete = 14;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([2, 3]));
    });

    it("should process deleting first line ending in an existing one", () => {
      /*
    <<Line1
    Line2
    L>>ine3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 0;
      const toDelete = 14;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([1, 2, 3]));
    });

    it("should process delete starting and ending in 2 existing lines", () => {
      /*
    Lin<<e1
    Li>>ne2
    Line3
    */
      const text = "Line1\nLine2\nLine3";
      const cursor = 3;
      const toDelete = 5;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([1, 3, 4]));
    });

    it("should process delete lines starting and ending in 2 existing lines", () => {
      /*
    Lin<<e1
    Line2
    Li>>ne3
    Line4
    */
      const text = "Line1\nLine2\nLine3\nLine4";
      const cursor = 3;
      const toDelete = 11;
      touchedLines.add(2);
      touchedLines.add(4);
      touchedLines.add(5);
      deleteDetector.process(text, cursor, toDelete);

      expect(touchedLines).toEqual(new Set([1, 2, 3]));
    });
  });
});
