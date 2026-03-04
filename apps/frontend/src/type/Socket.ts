import type { Socket } from 'socket.io-client';

export type SocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed';

export interface DisconnectInfo {
  reason: string;
  at: Date;
}

export interface SocketContextValue {
  socket: Socket | null;
  status: SocketStatus;
  reconnectAttempts: number;
  lastError: Error | null;
  lastDisconnect: DisconnectInfo | null;
  reconnect: () => void;
  disconnect: () => void;
}
