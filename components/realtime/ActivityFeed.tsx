'use client';

import { useEffect, useState } from 'react';
import { useRealtimeManager } from '@/lib/realtime/websocket-manager';
import {
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  FileText,
  Clock,
  Trash2,
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  userId: string;
  action: 'workflow_executed' | 'agent_created' | 'skill_completed' | 'document_shared' | 'api_key_created';
  title: string;
  description: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  icon?: string;
  metadata?: any;
}

interface ActivityFeedProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  workflow_executed: <Zap className="w-4 h-4 text-blue-500" />,
  agent_created: <Users className="w-4 h-4 text-purple-500" />,
  skill_completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  document_shared: <FileText className="w-4 h-4 text-orange-500" />,
  api_key_created: <AlertCircle className="w-4 h-4 text-red-500" />,
};

const ACTION_LABELS: Record<string, string> = {
  workflow_executed: 'Workflow Executed',
  agent_created: 'Agent Created',
  skill_completed: 'Skill Completed',
  document_shared: 'Document Shared',
  api_key_created: 'API Key Created',
};

export function ActivityFeed({ userId, limit = 20, showFilters = true }: ActivityFeedProps) {
  const manager = useRealtimeManager();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    // Subscribe to activity feed updates
    const unsubscribe = manager.subscribe('activity_feed', (message: any) => {
      const activity: ActivityItem = message.data;

      setActivities((prev) => {
        const newActivities = [activity, ...prev].slice(0, limit);
        return newActivities;
      });
    });

    return unsubscribe;
  }, [manager, limit]);

  const filteredActivities = filter
    ? activities.filter((a) => a.action === filter)
    : activities;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'failed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition ${
              filter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>

          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p>No activities yet</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition ${getStatusColor(
                activity.status
              )}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {ACTION_ICONS[activity.action] || <Zap className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {ACTION_LABELS[activity.action] || activity.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className="text-xs font-medium whitespace-nowrap">
                    {activity.status === 'success' && (
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    )}
                    {activity.status === 'pending' && (
                      <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
                    )}
                    {activity.status === 'failed' && (
                      <span className="text-red-600 dark:text-red-400">✕</span>
                    )}
                  </span>
                </div>

                {/* Metadata */}
                {activity.metadata && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    {activity.metadata.duration && (
                      <p>Duration: {(activity.metadata.duration / 1000).toFixed(2)}s</p>
                    )}
                    {activity.metadata.count && <p>Items: {activity.metadata.count}</p>}
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>

              {/* Delete Button */}
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}