import { useState, useMemo } from 'react';

export function usePaginated<T>(items: T[], pageSize: number = 10) {
  const [page, setPage] = useState(1);

  const { data, totalPages } = useMemo(() => {
    const total = Math.ceil(items.length / pageSize);
    const start = (page - 1) * pageSize;
    return { data: items.slice(start, start + pageSize), totalPages: total };
  }, [items, page, pageSize]);

  return { data, page, setPage, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
}
