
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
    startIndex: (items: T[]) => items.length > 0 ? (page - 1) * itemsPerPage + 1 : 0,
    // Improved: Helper to determine if pagination should display
    shouldShowPagination: (items: T[]) => items.length > itemsPerPage,
    // Improved: Get endIndex for display purposes (e.g., "Showing 1-10 of 50")
    endIndex: (items: T[]) => Math.min((page - 1) * itemsPerPage + itemsPerPage, items.length),
    // Added: Get current page items count
    currentPageItemsCount: (items: T[]) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, items.length);
      return endIndex - startIndex;
    }
  };
}
