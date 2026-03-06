import { playerAtom } from "@/atoms/player";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Button } from "./Button";
import { ToDo } from "./ToDo";

export const Header = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useAtom(playerAtom);

  const onLogout = () => {
    setPlayer(null);
    navigate({ to: "/" });
  };

  // if (!player) return <div className='h-14' />;

  return (
    <div className="flex gap-2 w-[calc(100%-16px*2)] items-start fixed top-4 left-4">
      <ToDo />
      {player?.avatarUrl && (
        <div className="items-center flex shrink-0 gap-2 ml-auto">
          <img
            src={player.avatarUrl}
            className="size-10 rounded-full"
            alt="avatar"
          />
          <p>{player?.displayName}</p>
          <Button onClick={onLogout}>Выйти</Button>
        </div>
      )}
    </div>
  );
};
