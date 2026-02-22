import { gameAtom } from '@/atoms/game';
import { playerAtom } from '@/atoms/player';
import { Board } from '@/components/Board';
import { Button } from '@/components/Button';
import { Menu } from '@/components/Menu';
import { useSocket } from '@/hooks/useSocket';
import { useEndGame, useGetGame } from '@/services/game';
import type { GameData } from '@shared';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { cn } from 'badlib';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const Route = createFileRoute('/room/_guard/$roomId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = useParams({ from: '/room/_guard/$roomId' });
  const [player] = useAtom(playerAtom);
  const { data: gameData } = useGetGame(roomId);
  const [game, setGame] = useAtom(gameAtom);
  const { data: endedGame } = useSocket<GameData>('gameEnded');
  const { mutateAsync } = useEndGame(roomId);

  const onGameEnd = async () => {
    await mutateAsync();
  };

  useEffect(() => {
    if (!gameData?.data) return;
    setGame(gameData.data);
  }, [gameData?.data]);

  useEffect(() => {
    if (!endedGame) return;
    setGame(endedGame);
  }, [endedGame]);

  return (
    <div className={cn('flex items-center justify-center h-full flex-col gap-4')}>
      {game?.status === 'ended' && (
        <p>Победил: {game?.players?.find((player) => player.id === game.winner)?.displayName}</p>
      )}
      <div
        className={cn('flex items-center gap-4 flex-col', {
          'opacity-50': !!game?.winner,
        })}
      >
        {game &&
          player &&
          game.boards
            .sort((a, b) => Number(b.ownerId === player?.id) - Number(a.ownerId === player?.id))
            .map((board) => (
              <Board
                key={board.ownerId}
                board={board}
                nextRoll={game.nextRoll}
                turn={game.turn}
                player={game.players?.find((p) => p.id === board.ownerId)!}
              />
            ))}
      </div>
      <Menu>
        {/* {game?.status === 'ended' && <Button>Сыграть ещё раз</Button>} */}
        {game?.status !== 'ended' && <Button onClick={onGameEnd}>Завершить игру</Button>}
      </Menu>
    </div>
  );
}
