import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, side = 'left' }) => {
  if (!isOpen) return null;

  const slideDirection = side === 'left' ? 'translate-x-0' : '-translate-x-0';
  const hideDirection = side === 'left' ? '-translate-x-full' : 'translate-x-full';

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      <div
        className={`absolute top-0 ${side}-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform ${
          isOpen ? slideDirection : hideDirection
        }`}
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
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Drawer };