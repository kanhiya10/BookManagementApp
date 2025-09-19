// hooks/usePagination.ts
import { useState, useEffect, useMemo } from 'react';

export interface PaginationConfig<T> {
  data: T[];
  pageSize: number;
}

export function usePagination<T>(config: PaginationConfig<T>) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [config.data.length]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * config.pageSize;
    const endIndex = startIndex + config.pageSize;
    return config.data.slice(startIndex, endIndex);
  }, [config.data, currentPage, config.pageSize]);

  const totalPages = Math.ceil(config.data.length / config.pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(clampedPage);
  };

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setCurrentPage
  };
}