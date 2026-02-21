export interface PlayerData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export type CreatePlayerRequest = {
  username: PlayerData["username"];
};
