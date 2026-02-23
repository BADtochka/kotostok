import { useEffect, useRef } from 'react';
import { useSocket } from './useSocket';

/**
 * Подписывается на событие сокета и автоматически отписывается при анмаунте.
 * Handler стабилизирован через ref — можно передавать без useCallback.
 *
 * @example
 * useSocketEvent<{ text: string }>("message", (data) => {
 *   console.log(data.text);
 * });
 */
export const useSocketEvent = <T = unknown>(event: string, handler: (data: T) => void): void => {
  const { socket } = useSocket();

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;

    const stableHandler = (data: T) => handlerRef.current(data);
    socket.on(event, stableHandler);

    return () => {
      socket.off(event, stableHandler);
    };
  }, [socket, event]);
};
