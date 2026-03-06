import { gameAtom, lockSoundAtom } from '@/atoms/game';
import { playerAtom } from '@/atoms/player';
import { Board } from '@/components/Board';
import { Button } from '@/components/Button';
import { Menu } from '@/components/Menu';
import { useSocket } from '@/hooks/useSocket';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { useCreateGame, useEndGame, useGetGame } from '@/services/game';
import type { GameData } from '@shared';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { cn } from 'badlib';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/room/_guard/$roomId')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { socket, status } = useSocket();
  const [alreadyJoined, setAlreadyJoined] = useState<string>('');
  const { roomId } = useParams({ from: '/room/_guard/$roomId' });
  const [player] = useAtom(playerAtom);
  const [_, setLockSound] = useAtom(lockSoundAtom);
  const [game, setGame] = useAtom(gameAtom);
  const { data: gameData } = useGetGame(roomId);
  const { mutateAsync: endGame } = useEndGame(roomId);
  const { mutateAsync: recreateGame } = useCreateGame();

  useSocketEvent<GameData>('gameEnded', setGame);

  const onGameEnd = async () => {
    await endGame();
  };

  const onGameRestart = async () => {
    const opponentPlayer = game?.players.find((p) => p.id !== player?.id);
    if (!player || !opponentPlayer) return;
    setGame(null);
    setLockSound(true);
    const { data } = await recreateGame({
      firstPlayerId: player.id,
      secondPlayerId: opponentPlayer.id,
    });
    setAlreadyJoined(data.id);
    navigate({ to: '/room/$roomId', params: { roomId: data.id } });
  };

  useEffect(() => {
    if (status === 'connected' && !alreadyJoined && socket) {
      socket.emit('join', { roomId });
      setAlreadyJoined(roomId);
    }
  }, [status, socket, alreadyJoined, roomId]);

  useEffect(() => {
    setAlreadyJoined('');
  }, [roomId]);

  useEffect(() => {
    if (!gameData?.data) return;
    setGame(gameData.data);
  }, [gameData?.data]);

  useEffect(() => {
    if (!player) navigate({ to: '/' });
  }, [player]);

  return (
    <div className={cn('flex items-center justify-center h-full flex-col gap-4')}>
      {game?.status === 'ended' && (
        <p className='absolute -translate-1/2 top-1/2 left-1/2'>
          Победил:
          {game?.players?.find((player) => player.id === game.winner)?.displayName}
        </p>
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
        {game?.status === 'ended' && <Button onClick={onGameRestart}>Сыграть ещё раз</Button>}
        {game?.status !== 'ended' && <Button onClick={onGameEnd}>Завершить игру</Button>}
      </Menu>
    </div>
  );
}
