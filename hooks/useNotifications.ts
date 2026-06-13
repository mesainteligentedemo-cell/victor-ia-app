'use client';

import { useEffect, useState } from 'react';
import notificationsService, { Notification, NotificationType } from '@/lib/realtime/notifications';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationsService.getNotifications(userId));
    setUnreadCount(notificationsService.getUnreadCount(userId));

    // Subscribe to new notifications
    const unsubscribe = notificationsService.subscribe(userId, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => Math.max(0, prev + 1));
    });

    return unsubscribe;
  }, [userId]);

  return {
    notifications,
    unreadCount,
    createNotification: (type: NotificationType, title: string, message: string, options?: any) =>
      notificationsService.createNotification(userId, type, title, message, options),
    markAsRead: (notificationId: string) => {
      notificationsService.markAsRead(userId, notificationId);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    markAllAsRead: () => {
      notificationsService.markAllAsRead(userId);
      setUnreadCount(0);
    },
    deleteNotification: (notificationId: string) => {
      notificationsService.deleteNotification(userId, notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    clearAll: () => {
      notificationsService.clearAll(userId);
      setNotifications([]);
      setUnreadCount(0);
    },
  };
}