import { TouchedLinesDetector } from "./TouchedLinesDetector";
describe("TouchedLinesDetector", () => {
  let touchedLinesDetector: TouchedLinesDetector;

  beforeEach(() => {
    touchedLinesDetector = new TouchedLinesDetector();
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 5, 6])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 3, 6, 7])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 4, 5])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 5, 6])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 3, 6, 7])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 3, 5, 6])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 3, 4, 6, 7])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 5, 6])
      );
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
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processInsert(text, cursor, toInsert);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 3, 6, 7])
      );
    });
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(new Set([3, 4]));
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(new Set([2, 3]));
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 4, 5])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 3, 4])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 3])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([2, 3, 4])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(new Set([2, 3]));
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 3])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 3, 4])
      );
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
      touchedLinesDetector.getTouchedLines().add(2);
      touchedLinesDetector.getTouchedLines().add(4);
      touchedLinesDetector.getTouchedLines().add(5);
      touchedLinesDetector.processDelete(text, cursor, toDelete);

      expect(touchedLinesDetector.getTouchedLines()).toEqual(
        new Set([1, 2, 3])
      );
    });
  });
});
