import { playerAtom } from '@/atoms/player';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const Route = createFileRoute('/room/_guard')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [player] = useAtom(playerAtom);

  useEffect(() => {
    console.log(player);

    if (!player) navigate({ to: '/' });
  }, []);

  return <Outlet />;
}
