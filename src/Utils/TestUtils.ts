export class TestUtils {
  static async tick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  static fixCustomEventConstructor() {
    global.CustomEvent = <any>((name: any, params?: { detail: any }) => {
      const ev = new Event(name);
      // @ts-ignore
      ev["name"] = name;
      // @ts-ignore
      ev["detail"] = params?.detail;
      return ev;
    });
  }

  static removeWhitespace(textWithWhitespace: string): string {
    return textWithWhitespace.replace(/ /g, "");
  }
}
