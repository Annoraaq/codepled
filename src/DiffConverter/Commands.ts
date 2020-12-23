export enum CommandType {
  DELETE = "DELETE",
  INSERT = "INSERT",
  SKIP = "SKIP",
  SHOW_TEXT = "SHOW_TEXT",
  HIGHLIGHT_LINES = "HIGHLIGHT_LINES",
  SCROLL_TO = "SCROLL_TO",
  SET_CURSOR = "SET_CURSOR",
  PAUSE = "PAUSE",
  REPLACE_ALL = "REPLACE_ALL",
  CREATE_DIFF = "CREATE_DIFF",
}
export enum DiffCommandType {
  DELETE = -1,
  INSERT = 1,
  SKIP = 0,
}
export type Command = [CommandType, any];
export type FastForwardCommand = {
  type: CommandType;
  payload: any;
  steps: number;
};
