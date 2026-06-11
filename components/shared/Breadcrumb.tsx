import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-400 dark:text-gray-600">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="text-black dark:text-white hover:underline"
            >
              {item.label}
            </a>
          ) : (
            <button
              onClick={item.onClick}
              className="text-black dark:text-white hover:underline"
              disabled={!item.onClick}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export { Breadcrumb };