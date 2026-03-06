import { playerAtom } from "@/atoms/player";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useCreatePlayer } from "@/services/player";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [player, setPlayer] = useAtom(playerAtom);
  const [username, setUsername] = useState("");
  const { mutateAsync } = useCreatePlayer();
  const navigate = useNavigate();

  const onPlayerCreate = async () => {
    const { data: player } = await mutateAsync({ username });
    if (!player) return;
    setPlayer(player);
    navigate({ to: "/room" });
  };

  useEffect(() => {
    if (player) navigate({ to: "/room" });
  }, [player]);

  return (
    <div className="flex items-center justify-center h-full flex-col gap-2">
      <Input
        placeholder="nickname"
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <Button onClick={onPlayerCreate}>Войти</Button>
    </div>
  );
}
