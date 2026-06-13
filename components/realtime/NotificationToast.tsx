'use client';

import React, { useEffect, useState } from 'react';
import { Notification } from '@/lib/realtime/notifications';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  duration?: number; // Auto-dismiss in milliseconds, 0 = no auto-dismiss
}

export function NotificationToast({
  notification,
  onDismiss,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'milestone':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'milestone':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 max-w-sm w-full
        border rounded-lg shadow-lg
        flex items-start gap-3 p-4
        transition-all duration-300 ease-out
        ${getBgColor()}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {notification.title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {notification.message}
        </p>
        {notification.actionUrl && (
          <a
            href={notification.actionUrl}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2 inline-block"
          >
            {notification.actionLabel || 'View'}
          </a>
        )}
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

/**
 * Toast Container Component
 * Manages multiple toast notifications at once
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Global toast dispatcher (can be called from anywhere)
  React.useEffect(() => {
    const handleAddToast = ((event: CustomEvent) => {
      const notification = event.detail;
      setToasts((prev) => [...prev, notification]);
    }) as EventListener;

    window.addEventListener('add-toast', handleAddToast);
    return () => window.removeEventListener('add-toast', handleAddToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col items-end justify-end gap-3 p-4 z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <NotificationToast notification={toast} onDismiss={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}