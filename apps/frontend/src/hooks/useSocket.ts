// hooks/useSocket.ts
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

export const useSocket = <T>(event: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onEvent = (payload: T) => setData(payload);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(event, onEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(event, onEvent);
    };
  }, [event]);

  return { data, isConnected, socket };
};
