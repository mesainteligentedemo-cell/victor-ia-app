"use client";

import { useToast } from "@/lib/hooks";
import { useEffect, useState } from "react";

export function NotificationCenter() {
  const { toasts, removeToast } = useToast();
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; timestamp: Date }>>([]);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border ${
            toast.type === "success"
              ? "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100"
              : toast.type === "error"
              ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
              : "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100"
          }`}
        >
          {toast.message}
        </div>
      ))}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
        >
          <h4 className="font-semibold text-black dark:text-white">{notif.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
