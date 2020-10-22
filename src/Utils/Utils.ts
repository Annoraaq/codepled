export class Utils {
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static stripHtml(html: string) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
}
