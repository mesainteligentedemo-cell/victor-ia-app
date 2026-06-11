"use client";

import { useAnalyticsStore } from "@/lib/stores";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const { dashboard, activities, setDashboard } = useAnalyticsStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/analytics?userId=user-id");
        if (res.ok) {
          const data = await res.json();
          setDashboard(data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
    };
    fetchMetrics();
  }, [setDashboard]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitorea métricas y eventos</p>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
            <p className="text-4xl font-bold text-black dark:text-white">{dashboard.totalEvents}</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
            <p className="text-4xl font-bold text-black dark:text-white">{(dashboard.totalTimeSpent / 3600).toFixed(1)}h</p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Updated</p>
            <p className="text-sm font-mono text-black dark:text-white">
              {new Date(dashboard.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Activity Feed</h2>
        {activities.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No activities yet</p>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="p-3 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 text-sm">
                <p className="font-semibold text-black dark:text-white">{activity.eventName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
