import { gameAtom, lockSoundAtom } from '@/atoms/game';
import { playerAtom } from '@/atoms/player';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useCreateGame } from '@/services/game';
import { useGetAllPlayers } from '@/services/player';
import type { PlayerData } from '@shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/room/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [player] = useAtom(playerAtom);
  const [_, setLockSound] = useAtom(lockSoundAtom);
  const [__, setGame] = useAtom(gameAtom);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData['id'] | null>(null);

  const { mutateAsync } = useCreateGame();
  const { data } = useGetAllPlayers();

  const playersOptions = useMemo(
    () =>
      (data?.data ?? [])
        .filter((pl) => pl.id !== player?.id)
        .map((player) => ({
          value: player.id,
          label: player.displayName,
        })),
    [data, player],
  );

  const onRoomCreate = async () => {
    if (!selectedPlayer || !player) return;
    const { data: game } = await mutateAsync({
      firstPlayerId: player.id,
      secondPlayerId: selectedPlayer,
    });
    setGame(null);
    setLockSound(true);
    await navigate({ to: '/room/$roomId', params: { roomId: game.id } });
  };

  return (
    <div className='flex items-center justify-center h-full flex-col gap-2'>
      <Select label='Выберите соперника' options={playersOptions} onChange={setSelectedPlayer} />
      <Button onClick={onRoomCreate}>Создать комнату</Button>
    </div>
  );
}
