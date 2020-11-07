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

  describe("enterFullscreen", () => {
    it("should enter fullscreen for modern browsers", () => {
      document.documentElement["requestFullscreen"] = jest.fn();
      Utils.enterFullscreen();
      expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    });

    it("should enter fullscreen for mozilla", () => {
      document.documentElement["requestFullscreen"] = undefined;
      (<any>document.documentElement)["mozRequestFullScreen"] = jest.fn();
      Utils.enterFullscreen();
      expect(
        (<any>document.documentElement).mozRequestFullScreen
      ).toHaveBeenCalled();
    });

    it("should enter fullscreen for microsoft", () => {
      document.documentElement["requestFullscreen"] = undefined;
      (<any>document.documentElement)["mozRequestFullScreen"] = undefined;
      (<any>document.documentElement)["msRequestFullscreen"] = jest.fn();
      Utils.enterFullscreen();
      expect(
        (<any>document.documentElement).msRequestFullscreen
      ).toHaveBeenCalled();
    });

    it("should enter fullscreen for webkit", () => {
      document.documentElement["requestFullscreen"] = undefined;
      (<any>document.documentElement)["mozRequestFullScreen"] = undefined;
      (<any>document.documentElement)["msRequestFullscreen"] = undefined;
      (<any>document.documentElement)["webkitRequestFullscreen"] = jest.fn();
      Utils.enterFullscreen();
      expect(
        (<any>document.documentElement).webkitRequestFullscreen
      ).toHaveBeenCalled();
    });
  });

  describe("closeFullscreen", () => {
    it("should close fullscreen for modern browsers", () => {
      document["exitFullscreen"] = jest.fn();
      Utils.closeFullscreen();
      expect(document.exitFullscreen).toHaveBeenCalled();
    });

    it("should exit fullscreen for webkit", () => {
      document["exitFullscreen"] = undefined;
      (<any>document)["webkitExitFullscreen"] = jest.fn();
      Utils.closeFullscreen();
      expect((<any>document).webkitExitFullscreen).toHaveBeenCalled();
    });

    it("should exit fullscreen for microsoft", () => {
      document["exitFullscreen"] = undefined;
      (<any>document)["webkitExitFullscreen"] = undefined;
      (<any>document)["msExitFullscreen"] = jest.fn();
      Utils.closeFullscreen();
      expect((<any>document).msExitFullscreen).toHaveBeenCalled();
    });
  });

  describe("isFullScreen", () => {
    it("should detect fullscreen for modern browsers", () => {
      Object.defineProperty(document, "fullscreenElement", {
        value: true,
        configurable: true,
      });
      Object.defineProperty(document, "webkitFullscreenElement", {
        value: false,
        configurable: true,
      });
      Object.defineProperty(document, "msFullscreenElement", {
        value: false,
        configurable: true,
      });
      expect(Utils.isFullscreen()).toBeTruthy();
    });

    it("should detect fullscreen for webkit", () => {
      Object.defineProperty(document, "fullscreenElement", {
        value: false,
        configurable: true,
      });

      Object.defineProperty(document, "webkitFullscreenElement", {
        configurable: true,
        value: true,
      });
      Object.defineProperty(document, "msFullscreenElement", {
        value: false,

        configurable: true,
      });
      expect(Utils.isFullscreen()).toBeTruthy();
    });

    it("should detect fullscreen for microsoft", () => {
      Object.defineProperty(document, "fullscreenElement", {
        value: false,
        configurable: true,
      });
      Object.defineProperty(document, "webkitFullscreenElement", {
        value: false,
        configurable: true,
      });
      Object.defineProperty(document, "msFullscreenElement", {
        value: true,
        configurable: true,
      });
      expect(Utils.isFullscreen()).toBeTruthy();
    });
  });
});
