'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRealtimeManager, PresenceData } from '@/lib/realtime/websocket-manager';

export function usePresence(userId: string) {
  const manager = useRealtimeManager();
  const [presence, setPresence] = useState<PresenceData | undefined>();
  const [allPresence, setAllPresence] = useState<PresenceData[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    manager.connect(userId).catch((error) => {
      console.error('Failed to connect WebSocket:', error);
    });

    // Subscribe to presence updates
    const unsubscribe = manager.subscribe('presence_update', (message) => {
      const updatedPresence = message.data as PresenceData;

      // Update all presence data
      setAllPresence((prev) => {
        const index = prev.findIndex((p) => p.userId === updatedPresence.userId);
        if (index !== -1) {
          const newPresence = [...prev];
          newPresence[index] = updatedPresence;
          return newPresence;
        }
        return [...prev, updatedPresence];
      });

      // Update current user's presence
      if (updatedPresence.userId === userId) {
        setPresence(updatedPresence);
        setIsOnline(updatedPresence.status === 'online');
      }
    });

    // Set initial presence to online
    manager.updatePresence('online');

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        manager.updatePresence('idle');
      } else {
        manager.updatePresence('online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
      manager.updatePresence('offline');
      manager.disconnect();
    };
  }, [userId, manager]);

  const updateStatus = useCallback((status: 'online' | 'idle' | 'offline') => {
    manager.updatePresence(status);
  }, [manager]);

  const updateCursor = useCallback((cursorX: number, cursorY: number) => {
    manager.updateCursor(cursorX, cursorY);
  }, [manager]);

  const getOnlineUsers = useCallback((): PresenceData[] => {
    return allPresence.filter((p) => p.status === 'online');
  }, [allPresence]);

  const getIdleUsers = useCallback((): PresenceData[] => {
    return allPresence.filter((p) => p.status === 'idle');
  }, [allPresence]);

  return {
    presence,
    allPresence,
    isOnline,
    onlineCount: getOnlineUsers().length,
    idleCount: getIdleUsers().length,
    offlineCount: allPresence.length - getOnlineUsers().length - getIdleUsers().length,
    updateStatus,
    updateCursor,
    getOnlineUsers,
    getIdleUsers,
  };
}