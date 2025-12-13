// src/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SeatUpdatePayload } from '../types/event';

interface UseSocketOptions {
  eventId?: number;
  userId?: string;
  onSeatLocked?: (data: { seatIndex: number; userId: string }) => void;
  onSeatUnlocked?: (data: { seatIndex: number }) => void;
  onSeatLockFailed?: (data: { seatIndex: number; reason: string }) => void;
}

export default function useSocket(options?: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [lockedSeats, setLockedSeats] = useState<{ [key: number]: string }>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || 'https://gravit-server-production.up.railway.app';
    
    const socket = io(url, { 
      autoConnect: true,
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);

      // Join event room if eventId provided
      if (options?.eventId) {
        socket.emit('joinEvent', options.eventId);
        console.log('Joined event room:', options.eventId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Receive initial locked seats when joining
    socket.on('lockedSeats', (activeLocks: { [key: number]: string }) => {
      console.log('Received locked seats:', activeLocks);
      setLockedSeats(activeLocks);
    });

    // Seat locked by someone
    socket.on('seatLocked', (data: { seatIndex: number; userId: string }) => {
      console.log('Seat locked:', data);
      setLockedSeats(prev => ({ ...prev, [data.seatIndex]: data.userId }));
      options?.onSeatLocked?.(data);
    });

    // Seat unlocked
    socket.on('seatUnlocked', (data: { seatIndex: number }) => {
      console.log('Seat unlocked:', data);
      setLockedSeats(prev => {
        const newLocks = { ...prev };
        delete newLocks[data.seatIndex];
        return newLocks;
      });
      options?.onSeatUnlocked?.(data);
    });

    // Seat lock failed
    socket.on('seatLockFailed', (data: { seatIndex: number; reason: string }) => {
      console.log('Seat lock failed:', data);
      options?.onSeatLockFailed?.(data);
    });

    // Legacy seat_update event
    socket.on('seat_update', (payload: SeatUpdatePayload) => {
      console.log('Seat update:', payload);
    });

    return () => {
      // Unlock all seats held by this user before disconnect
      if (options?.eventId && options?.userId) {
        Object.keys(lockedSeats).forEach(seatIndex => {
          if (lockedSeats[Number(seatIndex)] === options.userId) {
            socket.emit('unlockSeat', {
              eventId: options.eventId,
              seatIndex: Number(seatIndex),
              userId: options.userId
            });
          }
        });
      }
      socket.disconnect();
    };
  }, [options?.eventId]);

  const lockSeat = (seatNumber: number) => {
    if (!socketRef.current || !options?.eventId || !options?.userId) {
      console.error('Cannot lock seat: missing socket, eventId, or userId');
      return;
    }

    socketRef.current.emit('lockSeat', {
      eventId: options.eventId,
      seatIndex: seatNumber,
      userId: options.userId
    });
  };

  const unlockSeat = (seatNumber: number) => {
    if (!socketRef.current || !options?.eventId || !options?.userId) {
      console.error('Cannot unlock seat: missing socket, eventId, or userId');
      return;
    }

    socketRef.current.emit('unlockSeat', {
      eventId: options.eventId,
      seatIndex: seatNumber,
      userId: options.userId
    });
  };

  return {
    socket: socketRef.current,
    isConnected,
    lockedSeats,
    lockSeat,
    unlockSeat
  };
}

