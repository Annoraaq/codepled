export class Utils {
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static stripHtml(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  static isAlphanumeric(char: string): boolean {
    const ascii = char.charCodeAt(0);
    const isDigit = ascii >= 48 && ascii <= 57;
    const isUcLetter = ascii >= 65 && ascii <= 90;
    const isLcLetter = ascii >= 97 && ascii <= 122;
    return isDigit || isUcLetter || isLcLetter;
  }

  static countLines(text: string): number {
    const lines = (text.match(/\n/g) || []).length + 1;
    return lines;
  }

  static enterFullscreen(): void {
    const element = <any>document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  static isFullscreenSupported(): boolean {
    const element = <any>document.documentElement;
    return (
      element.requestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen ||
      element.webkitRequestFullscreen
    );
  }

  static closeFullscreen() {
    const doc = <any>document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }

  static isFullscreen(): boolean {
    const doc = <any>document;
    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    );
  }
}
