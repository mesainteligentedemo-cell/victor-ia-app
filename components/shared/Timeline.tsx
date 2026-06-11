import React from 'react';

interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  completed?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full ${
                item.completed
                  ? 'bg-black dark:bg-white'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
            {i < items.length - 1 && <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-700 mt-2" />}
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white">{item.title}</p>
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            )}
            {item.time && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { Timeline };