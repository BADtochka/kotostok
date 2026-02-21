import { gameAtom } from "@/atoms/game";
import { Board } from "@/components/Board";
import { useGetGame } from "@/services/game";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const Route = createFileRoute("/room/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = useParams({ from: "/room/$roomId" });
  const { data: gameData } = useGetGame(roomId);
  const [game, setGame] = useAtom(gameAtom);

  // const game: GameData = {
  //   id: "123",
  //   boards: [
  //     {
  //       ownerId: "1",
  //       columns: {
  //         first: [],
  //         second: [],
  //         third: [],
  //       },
  //     },
  //     {
  //       ownerId: "2",
  //       columns: {
  //         first: [],
  //         second: [],
  //         third: [],
  //       },
  //     },
  //   ],
  //   nextRoll: 3,
  //   players: [
  //     {
  //       id: "1",
  //       avatarUrl: "https://vrvirtux.su/jVH3Z/zen-phsikwby1b.png/raw",
  //       username: "player1",
  //       displayName: "Player1",
  //     },
  //     {
  //       id: "2",
  //       avatarUrl: "https://vrvirtux.su/jVH3Z/zen-phsikwby1b.png/raw",
  //       username: "player2",
  //       displayName: "Player2",
  //     },
  //   ],
  //   status: "playing",
  //   turn: "1",
  // };
  useEffect(() => {
    if (!gameData?.data) return;
    console.log("alo", gameData.data);
    setGame(gameData.data);
  }, [gameData?.data]);

  return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <p>Комбо не работает</p>
      {game &&
        game.boards.map((board) => (
          <Board
            key={board.ownerId}
            board={board}
            nextRoll={game.nextRoll}
            turn={game.turn}
            player={game.players.find((player) => player.id === board.ownerId)!}
          />
        ))}
    </div>
  );
}
