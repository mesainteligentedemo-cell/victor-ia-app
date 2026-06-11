import React, { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    info: 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white',
    success: 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white',
    warning: 'bg-gray-400 dark:bg-gray-600 text-black dark:text-white',
    error: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black',
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]} z-50`}>
      {message}
    </div>
  );
};

export { Toast };