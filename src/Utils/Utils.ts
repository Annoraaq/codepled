export class Utils {
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static stripHtml(html: string) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  static isAlphanumeric(char: string) {
    const ascii = char.charCodeAt(0);
    const isDigit = ascii >= 48 && ascii <= 57;
    const isUcLetter = ascii >= 65 && ascii <= 90;
    const isLcLetter = ascii >= 97 && ascii <= 122;
    return isDigit || isUcLetter || isLcLetter;
  }

  static countLines(text: string) {
    if (text == "") return 0;
    const lines = (text.match(/\n/g) || []).length + 1;
    return lines;
  }
}
