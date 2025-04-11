
import { useState, useEffect } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function usePagination<T>({ 
  initialPage = 1, 
  initialItemsPerPage = 10 
}: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  
  // Reset to page 1 whenever items per page changes
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);
  
  // Custom setter for itemsPerPage that ensures page is reset to 1
  const setItemsPerPageWithReset = (value: number) => {
    setItemsPerPage(value);
    setPage(1); // Always reset to page 1 when changing items per page
  };
  
  const paginate = (items: T[]): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };
  
  return {
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage: setItemsPerPageWithReset, // Use the wrapped setter
    paginate,
    totalPages: (items: T[]) => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    startIndex: (page - 1) * itemsPerPage + 1
  };
}
