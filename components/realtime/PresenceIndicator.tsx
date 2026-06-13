'use client';

import React, { useState } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { Users, Eye, Clock, LogOut } from 'lucide-react';

interface PresenceIndicatorProps {
  userId: string;
  showDetails?: boolean;
}

export function PresenceIndicator({ userId, showDetails = false }: PresenceIndicatorProps) {
  const { isOnline, onlineCount, idleCount, offlineCount, allPresence } = usePresence(userId);
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-3">
      {/* Current User Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor(isOnline ? 'online' : 'offline')}`}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Statistics */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {onlineCount}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Online</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {idleCount}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Idle</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <LogOut className="w-4 h-4 text-gray-500" />
              <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {offlineCount}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Offline</p>
          </div>
        </div>
      )}

      {/* Expandable List */}
      {showDetails && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Users className="w-4 h-4" />
            Active Users ({allPresence.length})
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
              {allPresence.map((presence) => (
                <div
                  key={presence.userId}
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-slate-800"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(presence.status)}`}
                  />
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {presence.userId === userId ? 'You' : presence.userId}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
                    {getStatusLabel(presence.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}