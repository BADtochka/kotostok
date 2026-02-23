import { SocketContext } from '@/components/SocketProvider';
import type { SocketContextValue } from '@/type/Socket';
import { useContext } from 'react';

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error('useSocket must be used within <SocketProvider>');
  }

  return ctx;
};
