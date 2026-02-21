import type { PlayerData } from "./Player";
import type { UUID } from "./UUID";

export type BoardColumns = {
  first: number[];
  second: number[];
  third: number[];
};

export type GameBoard = {
  ownerId: PlayerData["id"];
  columns: BoardColumns;
};

export interface GameData {
  id: UUID;
  players: PlayerData[];
  turn: PlayerData["id"];
  status: GameStatus;
  boards: GameBoard[];
  nextRoll: number;
}

export type GameStatus = "playing" | "ended";

export type CreateGameRequest = {
  firstPlayerId: PlayerData["id"];
  secondPlayerId: PlayerData["id"];
};

export type MakeTurnRequest = {
  playerId: PlayerData["id"];
  column: keyof BoardColumns;
};
