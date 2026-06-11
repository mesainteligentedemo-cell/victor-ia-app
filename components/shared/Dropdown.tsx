import React, { useState } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  dangerous?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg min-w-max z-50">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                item.dangerous
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-black dark:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { Dropdown };