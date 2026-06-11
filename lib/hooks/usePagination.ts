import { useState } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    currentItems,
    setCurrentPage,
    goToNextPage: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    goToPreviousPage: () => setCurrentPage((p) => Math.max(p - 1, 1))
  };
}
