import { Utils } from "./Utils";

describe("Utils", () => {
  describe("stripHtml", () => {
    it("should remove html", () => {
      expect(Utils.stripHtml("<h1>Hello World</h1>")).toEqual("Hello World");
    });
  });

  describe("isAlphanumeric", () => {
    it("should identify alphanumeric characters", () => {
      expect(Utils.isAlphanumeric("a")).toEqual(true);
      expect(Utils.isAlphanumeric("c")).toEqual(true);
      expect(Utils.isAlphanumeric("z")).toEqual(true);
      expect(Utils.isAlphanumeric("A")).toEqual(true);
      expect(Utils.isAlphanumeric("D")).toEqual(true);
      expect(Utils.isAlphanumeric("Z")).toEqual(true);
      expect(Utils.isAlphanumeric("0")).toEqual(true);
      expect(Utils.isAlphanumeric("5")).toEqual(true);
      expect(Utils.isAlphanumeric("9")).toEqual(true);

      expect(Utils.isAlphanumeric(",")).toEqual(false);
      expect(Utils.isAlphanumeric("")).toEqual(false);
      expect(Utils.isAlphanumeric(".")).toEqual(false);
      expect(Utils.isAlphanumeric(" ")).toEqual(false);
      expect(Utils.isAlphanumeric("\n")).toEqual(false);
      expect(Utils.isAlphanumeric("!")).toEqual(false);
    });

    it("should ignore all but first char", () => {
      expect(Utils.isAlphanumeric("a!@#")).toEqual(true);
    });
  });

  describe("countLines", () => {
    it("should count lines", () => {
      expect(Utils.countLines("")).toEqual(1);
      expect(Utils.countLines(" ")).toEqual(1);
      expect(Utils.countLines("Hello")).toEqual(1);
      expect(Utils.countLines("\n")).toEqual(2);
      expect(Utils.countLines("Hello\n")).toEqual(2);
      expect(Utils.countLines("Hello\nWorld")).toEqual(2);
      expect(Utils.countLines("Hello\nWorld\n")).toEqual(3);
    });
  });
});
