export enum CommandType {
  DELETE = -1,
  INSERT = 1,
  SKIP = 0,
  SHOW_TEXT = 2,
  HIGHLIGHT_LINES = 3,
  SCROLL_TO = 4,
}
export type Command = [number, any];
