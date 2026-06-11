import { useState, useMemo } from 'react';

export function useFilters<T>(items: T[], filters: Record<string, (item: T) => boolean>) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return items.filter((item) => activeFilters.every((filter) => filters[filter](item)));
  }, [items, filters, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  return { filtered, activeFilters, toggleFilter };
}
