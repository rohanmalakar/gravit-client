// src/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SeatUpdatePayload } from '../types/event';

export default function useSocket(onMessage?: (payload: SeatUpdatePayload) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL;
    if (!url) return;

    const socket = io(url, { autoConnect: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.debug('socket connected', socket.id);
    });

    socket.on('seat_update', (payload: SeatUpdatePayload) => {
      // payload: { event_id, available_seats }
      onMessage && onMessage(payload);
    });

    socket.on('disconnect', () => {
      console.debug('socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [onMessage]);

  return socketRef;
}
