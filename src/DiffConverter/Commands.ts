export enum Commands {
  DELETE = -1,
  INSERT = 1,
  SKIP = 0,
}
export type Command = [number, String | number];
