export enum CommandType {
  DELETE = -1,
  INSERT = 1,
  SKIP = 0,
}
export type Command = [number, any];
