export class TestUtils {
  static async tick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  static fixCustomEventConstructor() {
    global.CustomEvent = <any>((name: any, params?: { detail: any }) => {
      const ev = new Event(name);
      (<any>ev)["name"] = name;
      (<any>ev)["detail"] = params?.detail;
      return ev;
    });
  }

  static removeWhitespace(textWithWhitespace: string): string {
    return textWithWhitespace.replace(/ /g, "").replace(/\n/g, "");
  }
}
