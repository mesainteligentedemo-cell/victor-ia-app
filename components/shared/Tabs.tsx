import React, { useState } from 'react';

interface TabProps {
  label: string;
  content: React.ReactNode;
  value: string;
}

interface TabsProps {
  tabs: TabProps[];
  defaultTab?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.value
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.value === activeTab)?.content}
      </div>
    </div>
  );
};

export { Tabs };