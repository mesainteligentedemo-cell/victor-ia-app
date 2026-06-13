/**
 * Real-time Notifications Service
 * Handles creation, storage, and broadcasting of notifications
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'milestone';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: number;
  expiresAt?: number;
  icon?: string;
}

class NotificationsService {
  private static instance: NotificationsService;
  private notifications: Map<string, Notification[]> = new Map();
  private subscribers: Map<string, Set<(notification: Notification) => void>> = new Map();
  private unreadCount: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  /**
   * Create and broadcast a notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      actionLabel?: string;
      expiresIn?: number; // milliseconds
      icon?: string;
    }
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      actionUrl: options?.actionUrl,
      actionLabel: options?.actionLabel,
      read: false,
      createdAt: Date.now(),
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
      icon: options?.icon,
    };

    // Store in memory
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
      this.unreadCount.set(userId, 0);
    }

    this.notifications.get(userId)!.push(notification);

    // Increment unread count
    const current = this.unreadCount.get(userId) || 0;
    this.unreadCount.set(userId, current + 1);

    // Broadcast to subscribers
    this.broadcastToSubscribers(userId, notification);

    // Auto-delete if expiration set
    if (options?.expiresIn) {
      setTimeout(() => {
        this.deleteNotification(userId, notification.id);
      }, options.expiresIn);
    }

    // Persist to database (optional)
    await this.persistNotification(notification);

    return notification;
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return;

    const notification = userNotifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      const current = this.unreadCount.get(userId) || 0;
      this.unreadCount.set(userId, Math.max(0, current - 1));
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return;

    userNotifications.forEach((notification) => {
      notification.read = true;
    });

    this.unreadCount.set(userId, 0);
  }

  /**
   * Delete a notification
   */
  deleteNotification(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return;

    const index = userNotifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      const notification = userNotifications[index];
      userNotifications.splice(index, 1);

      if (!notification.read) {
        const current = this.unreadCount.get(userId) || 0;
        this.unreadCount.set(userId, Math.max(0, current - 1));
      }
    }
  }

  /**
   * Clear all notifications for a user
   */
  clearAll(userId: string): void {
    this.notifications.delete(userId);
    this.unreadCount.set(userId, 0);
  }

  /**
   * Get notifications for a user
   */
  getNotifications(userId: string, limit: number = 50): Notification[] {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.slice(-limit).reverse();
  }

  /**
   * Get unread count
   */
  getUnreadCount(userId: string): number {
    return this.unreadCount.get(userId) || 0;
  }

  /**
   * Subscribe to notifications for a user
   */
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    this.subscribers.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(userId);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Broadcast notification to subscribed callbacks
   */
  private broadcastToSubscribers(userId: string, notification: Notification): void {
    const callbacks = this.subscribers.get(userId);
    if (callbacks) {
      callbacks.forEach((callback) => callback(notification));
    }
  }

  /**
   * Persist notification to database
   */
  private async persistNotification(notification: Notification): Promise<void> {
    try {
      // In production, save to Supabase
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        console.error('Failed to persist notification');
      }
    } catch (error) {
      console.error('Error persisting notification:', error);
    }
  }
}

export default NotificationsService.getInstance();