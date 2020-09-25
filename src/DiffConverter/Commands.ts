export enum CommandType {
  DELETE = -1,
  INSERT = 1,
  SKIP = 0,
  SHOW_TEXT = 2,
}
export type Command = [number, any];
