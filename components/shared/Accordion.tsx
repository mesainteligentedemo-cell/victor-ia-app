import React, { useState } from 'react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
  value: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="space-y-2 border border-gray-300 dark:border-gray-700 rounded-lg">
      {items.map((item) => (
        <div key={item.value}>
          <button
            onClick={() => setOpenItem(openItem === item.value ? null : item.value)}
            className="w-full px-4 py-3 text-left font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-b border-gray-300 dark:border-gray-700 last:border-b-0 flex justify-between items-center"
          >
            {item.title}
            <span className={`transition-transform ${openItem === item.value ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {openItem === item.value && (
            <div className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { Accordion };