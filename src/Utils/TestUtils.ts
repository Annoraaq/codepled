export class TestUtils {
  static async tick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
}
