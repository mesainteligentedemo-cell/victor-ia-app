import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl ${sizes[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };