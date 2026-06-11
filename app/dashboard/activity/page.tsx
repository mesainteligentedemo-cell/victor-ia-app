"use client";

import { useAnalyticsStore } from "@/lib/stores";
import { useEffect } from "react";

export default function ActivityPage() {
  const { activities, setActivities } = useAnalyticsStore();

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/analytics?userId=user-id");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    };
    fetchActivities();
  }, []);

  const sampleActivities = [
    { id: 1, action: "Generated Image", time: "2 minutes ago", user: "You", icon: "🖼️" },
    { id: 2, action: "Executed Lead Qualifier", time: "15 minutes ago", user: "You", icon: "🤖" },
    { id: 3, action: "Created Prospect", time: "1 hour ago", user: "You", icon: "👤" },
    { id: 4, action: "Updated Settings", time: "3 hours ago", user: "You", icon: "⚙️" },
    { id: 5, action: "Generated Report", time: "Yesterday", user: "You", icon: "📊" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Activity Log</h1>
        <p className="text-gray-600 dark:text-gray-400">View all actions in your account</p>
      </div>

      <div className="space-y-2">
        {sampleActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition"
          >
            <span className="text-2xl">{activity.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-black dark:text-white">{activity.action}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-6 py-2 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
          Load More
        </button>
      </div>
    </div>
  );
}
