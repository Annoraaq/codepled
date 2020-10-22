import { Utils } from "./Utils";

describe("Utils", () => {
  it("remove html", () => {
    expect(Utils.stripHtml("<h1>Hello World</h1>")).toEqual("Hello World");
  });
});
