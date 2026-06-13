'use client';

import { useEffect, useRef, useState } from 'react';
import { useRealtimeManager } from '@/lib/realtime/websocket-manager';
import { usePresence } from '@/hooks/usePresence';

interface RemoteCursor {
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
  lastUpdate: number;
}

interface CollaborationCursorsProps {
  userId: string;
  showNames?: boolean;
}

const CURSOR_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
];

export function CollaborationCursors({ userId, showNames = true }: CollaborationCursorsProps) {
  const manager = useRealtimeManager();
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const mouseRef = useRef({ x: 0, y: 0 });
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    updateIntervalRef.current = setInterval(() => {
      manager.updateCursor(mouseRef.current.x, mouseRef.current.y);
    }, 50);

    const unsubscribe = manager.subscribe('collaboration_cursor', (message: any) => {
      const { userId: remoteId, cursorX, cursorY } = message.data;

      if (remoteId !== userId) {
        setRemoteCursors((prev) => {
          const newMap = new Map(prev);
          let hash = 0;
          for (let i = 0; i < remoteId.length; i++) {
            hash += remoteId.charCodeAt(i);
          }

          newMap.set(remoteId, {
            userId: remoteId,
            x: cursorX,
            y: cursorY,
            color: CURSOR_COLORS[hash % CURSOR_COLORS.length],
            name: remoteId.substring(0, 8),
            lastUpdate: Date.now(),
          });

          return newMap;
        });
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      unsubscribe();
    };
  }, [userId, manager]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        const now = Date.now();

        for (const [key, cursor] of newMap.entries()) {
          if (now - cursor.lastUpdate > 5000) {
            newMap.delete(key);
          }
        }

        return newMap;
      });
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <>
      {Array.from(remoteCursors.values()).map((cursor) => (
        <div
          key={cursor.userId}
          className="fixed w-6 h-6 pointer-events-none z-50 transition-all duration-100"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 0 L14 10 L10 14 L8 12 L3 17 Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>

          {showNames && (
            <div
              className="absolute top-6 left-0 px-2 py-1 text-xs font-semibold text-white rounded whitespace-nowrap pointer-events-none"
              style={{
                backgroundColor: cursor.color,
                boxShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`,
              }}
            >
              {cursor.name}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

/**
 * Avatar Stack Component — Shows active users at top
 */
interface ActiveUsersStackProps {
  userId: string;
}

export function ActiveUsersStack({ userId }: ActiveUsersStackProps) {
  const { allPresence } = usePresence(userId);
  const onlineUsers = allPresence.filter((p: any) => p.status === 'online');

  const STACK_SIZE = 4;
  const visibleUsers = onlineUsers.slice(0, STACK_SIZE);
  const hiddenCount = Math.max(0, onlineUsers.length - STACK_SIZE);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visibleUsers.map((user: any, idx: number) => (
          <div
            key={user.userId}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-slate-900"
            title={user.userId}
            style={{ zIndex: STACK_SIZE - idx }}
          >
            {user.userId.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          +{hiddenCount}
        </span>
      )}

      <span className="text-xs text-gray-500 dark:text-gray-400">
        {onlineUsers.length} online
      </span>
    </div>
  );
}