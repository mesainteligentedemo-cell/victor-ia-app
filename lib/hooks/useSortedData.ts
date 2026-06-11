import { useState, useMemo } from 'react';

export function useSortedData<T>(items: T[], sortFn: (a: T, b: T) => number) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    const copy = [...items];
    return sortOrder === 'asc' ? copy.sort(sortFn) : copy.sort((a, b) => sortFn(b, a));
  }, [items, sortFn, sortOrder]);

  const toggleSort = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  return { sorted, sortOrder, toggleSort };
}
