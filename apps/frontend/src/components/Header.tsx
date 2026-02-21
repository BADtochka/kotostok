import { playerAtom } from "@/atoms/player";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Button } from "./Button";

export const Header = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useAtom(playerAtom);

  const onLogout = () => {
    setPlayer(null);
    navigate({ to: "/" });
  };

  if (!player) return <div className="h-14" />;

  return (
    <div className="flex gap-2 h-14 px-2 w-full items-center justify-end fixed top-0 left-0">
      {player?.avatarUrl && (
        <img
          src={player.avatarUrl}
          className="size-10 rounded-full"
          alt="avatar"
        />
      )}
      <p>{player.displayName}</p>
      <Button onClick={onLogout}>Выйти</Button>
    </div>
  );
};
