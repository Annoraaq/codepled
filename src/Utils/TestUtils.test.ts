import { TestUtils } from "./TestUtils";

describe("TestUtils", () => {
  it("removes whitespaces", () => {
    expect(
      TestUtils.removeWhitespace(" Hello World    without whitespaces ")
    ).toEqual("HelloWorldwithoutwhitespaces");
  });
});
