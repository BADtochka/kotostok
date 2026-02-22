import { gameAtom } from '@/atoms/game';
import { playerAtom } from '@/atoms/player';
import { useSocket } from '@/hooks/useSocket';
import { useMakeTurn } from '@/services/game';
import { loadSound } from '@/utils/audio';
import type { BoardColumns, GameBoard, GameData, PlayerData } from '@shared';
import { useParams } from '@tanstack/react-router';
import { cn, getObjectKeys } from 'badlib';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Column } from './Column';
import { Dice } from './Dice';

type BoardProps = {
  board: GameBoard;
  player: PlayerData;
  turn: PlayerData['id'];
  nextRoll: number | null;
};

export const Board = ({ board, player, nextRoll, turn }: BoardProps) => {
  // const queryClient = useQueryClient();
  const { roomId } = useParams({ from: '/room/_guard/$roomId' });
  const [loggedPlayer] = useAtom(playerAtom);
  const [_, setGame] = useAtom(gameAtom);
  const [score, setScore] = useState(0);
  const [isJoined, setIsJoined] = useState(false);

  const { mutateAsync: makeTurn } = useMakeTurn(roomId);
  const { data: updatedGame, isConnected, socket } = useSocket<GameData>('gameUpdated');

  const allColumns = getObjectKeys(board.columns);
  const spring = useSpring(score, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const animatedScore = useTransform(() => Math.round(spring.get()).toLocaleString());

  const isColumnAvailable = (key: keyof BoardColumns) => board.columns[key].length < 3;

  const diceCombo = (key: keyof BoardColumns, value: number) => {
    const numbers = board.columns[key];
    const combo = numbers.filter((numbers) => numbers === value).length;
    return combo;
  };

  useEffect(() => {
    (async () => {
      await loadSound('makeTurn');
      await loadSound('wipeDice');
    })();
  }, []);

  useEffect(() => {
    setScore(board.score);
  }, [board]);

  useEffect(() => {
    spring.set(score);
  }, [score]);

  const onColumnClick = async (key: keyof BoardColumns) => {
    if (!isColumnAvailable(key) || !loggedPlayer) return;

    await makeTurn({ column: key, playerId: loggedPlayer.id });
  };

  useEffect(() => {
    if (!isConnected || isJoined) return;
    socket.emit('join', { roomId });
    setIsJoined(true);
  }, [isConnected]);

  useEffect(() => {
    if (!updatedGame) return;
    setGame(updatedGame);
  }, [updatedGame]);

  if (!loggedPlayer) return;

  return (
    <div
      className={cn('flex gap-4 items-center relative', {
        'pointer-events-none': turn !== loggedPlayer.id || player.id !== loggedPlayer.id,
      })}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col items-center gap-2'>
          <img
            src={player.avatarUrl}
            className='size-16 rounded-full mr-2'
          />
          <p>{player.displayName}</p>
          {nextRoll && (
            <div
              className={cn('opacity-0 transition-all', {
                'opacity-100': turn === player.id,
              })}
            >
              <Dice value={nextRoll} />
            </div>
          )}
        </div>
        <motion.p className='text-2xl absolute top-1/2 -right-12 -translate-y-1/2'>{animatedScore}</motion.p>
      </div>
      <div className='flex bg-zinc-900 relative gap-2 p-2 text-xl'>
        <div className='flex gap-2 opacity-100 z-10 absolute p-2 top-0 left-0 h-full'>
          {allColumns.map((key) => (
            <Column
              key={key}
              onClick={() => onColumnClick(key)}
              available={isColumnAvailable(key)}
            >
              <AnimatePresence>
                {board.columns[key].map((value, index) => (
                  <Dice
                    key={index}
                    value={value}
                    index={index}
                    combos={diceCombo(key, value)}
                  />
                ))}
              </AnimatePresence>
            </Column>
          ))}
        </div>
        <div className='flex gap-2 opacity-100'>
          <Column>
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
          </Column>
          <Column>
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
          </Column>
          <Column>
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
            <Dice
              color='#09090b'
              animate={false}
            />
          </Column>
        </div>
      </div>
    </div>
  );
};
