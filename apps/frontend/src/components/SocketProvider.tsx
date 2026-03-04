import type { DisconnectInfo, SocketContextValue, SocketStatus } from '@/type/Socket';
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client';

export interface SocketProviderProps {
  url: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider = ({ url, options, children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<SocketStatus>('idle');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastDisconnect, setLastDisconnect] = useState<DisconnectInfo | null>(null);

  useEffect(() => {
    const socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10_000,
      reconnectionAttempts: Infinity,
      ...options,
      autoConnect: true,
    });

    socketRef.current = socket;
    setStatus('connecting');

    const onConnect = () => {
      setStatus('connected');
      setReconnectAttempts(0);
      setLastError(null);
    };

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      setLastDisconnect({ reason, at: new Date() });

      // При "io server disconnect" socket.io не реконнектится автоматически
      if (reason === 'io server disconnect') {
        setStatus('disconnected');
      } else {
        setStatus('reconnecting');
      }
    };

    const onConnectError = (error: Error) => {
      setLastError(error);
      setStatus('reconnecting');
    };

    const onReconnectAttempt = (attempt: number) => {
      setStatus('reconnecting');
      setReconnectAttempts(attempt);
    };

    const onReconnectError = (error: Error) => {
      setLastError(error);
    };

    const onReconnectFailed = () => {
      setStatus('failed');
    };

    const onReconnect = () => {
      setStatus('connected');
      setReconnectAttempts(0);
      setLastError(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect_error', onReconnectError);
    socket.io.on('reconnect_failed', onReconnectFailed);
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect_error', onReconnectError);
      socket.io.off('reconnect_failed', onReconnectFailed);
      socket.io.off('reconnect', onReconnect);
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const reconnect = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    setReconnectAttempts(0);
    setLastError(null);
    setStatus('connecting');
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    setStatus('disconnected');
    socket.disconnect();
  }, []);

  const value: SocketContextValue = {
    socket: socketRef.current,
    status,
    reconnectAttempts,
    lastError,
    lastDisconnect,
    reconnect,
    disconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
