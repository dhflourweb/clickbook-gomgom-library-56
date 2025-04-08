import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookFilters } from '@/components/books/BookFilters';
import { BookGrid } from '@/components/books/BookGrid';
import { getBooksByCategory, MOCK_BOOKS } from '@/data/mockData';
import { Book } from '@/types';
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';

const Books = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24); // Default is 24
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filter, setFilter] = useState({
    query: '',
    category: '전체',
    status: '전체',
    sort: '인기도순',
    favorite: false,
  });

  useEffect(() => {
    const queryParam = searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || '전체';
    const statusParam = searchParams.get('status') || '전체';
    const sortParam = searchParams.get('sort') || '인기도순';
    const favoriteParam = searchParams.get('favorite') === 'true';
    const pageParam = parseInt(searchParams.get('page') || '1');
    const perPageParam = parseInt(searchParams.get('perPage') || '24');
    
    const filterParam = searchParams.get('filter');
    let finalCategory = categoryParam;
    
    if (filterParam && filterParam.startsWith('category=')) {
      finalCategory = filterParam.split('=')[1];
    }

    const newFilter = {
      query: queryParam,
      category: finalCategory,
      status: statusParam,
      sort: sortParam,
      favorite: favoriteParam
    };
    
    setFilter(newFilter);
    setCurrentPage(pageParam);
    setItemsPerPage(perPageParam);
    applyFilters(newFilter, pageParam, perPageParam);
  }, [location.search]);

  const applyFilters = (filters: any, page = 1, perPage = itemsPerPage) => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredBooks = [...MOCK_BOOKS];
      
      if (filters.category !== '전체') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
      }
      
      if (filters.status !== '전체') {
        if (filters.status === '대여가능') {
          filteredBooks = filteredBooks.filter(book => book.status.available > 0);
        } else if (filters.status === '대여중') {
          filteredBooks = filteredBooks.filter(book => book.status.available === 0);
        }
      }
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.publisher.toLowerCase().includes(query)
        );
      }
      
      if (filters.sort === '인기도순') {
        filteredBooks.sort((a, b) => (b.status.borrowed || 0) - (a.status.borrowed || 0));
      } else if (filters.sort === '최신등록순') {
        filteredBooks.sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime());
      } else if (filters.sort === '평점순') {
        filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sort === '이름순') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.sort === '추천순') {
        filteredBooks.sort((a, b) => {
          const aHasRecommended = a.badges.includes('recommended');
          const bHasRecommended = b.badges.includes('recommended');
          return bHasRecommended ? 1 : aHasRecommended ? -1 : 0;
        });
      } else if (filters.sort === '베스트도서순') {
        filteredBooks.sort((a, b) => {
          const aHasBest = a.badges.includes('best');
          const bHasBest = b.badges.includes('best');
          return bHasBest ? 1 : aHasBest ? -1 : 0;
        });
      }
      
      if (filters.favorite) {
        filteredBooks = filteredBooks.map(book => ({
          ...book,
          isFavorite: true
        }));
      }
      
      const total = filteredBooks.length;
      setTotalBooks(total);
      setTotalPages(Math.ceil(total / perPage));
      
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
      
      setBooks(paginatedBooks);
      setLoading(false);
      
      toast(`${total}권의 도서가 검색되었습니다. (${startIndex + 1}-${Math.min(endIndex, total)}권 표시)`);
    }, 300);
  };

  const handleSearch = (newFilter: any) => {
    const params = new URLSearchParams();
    if (newFilter.query) params.set('query', newFilter.query);
    if (newFilter.category !== '전체') params.set('category', newFilter.category);
    if (newFilter.status !== '전체') params.set('status', newFilter.status);
    if (newFilter.sort !== '인기도순') params.set('sort', newFilter.sort);
    if (newFilter.favorite) params.set('favorite', 'true');
    params.set('page', '1');
    params.set('perPage', itemsPerPage.toString());
    
    setSearchParams(params);
    setFilter(newFilter);
    setCurrentPage(1);
    applyFilters(newFilter, 1, itemsPerPage);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    
    setSearchParams(params);
    setCurrentPage(newPage);
    applyFilters(filter, newPage, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('perPage', newItemsPerPage.toString());
    params.set('page', '1');
    
    setSearchParams(params);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    applyFilters(filter, 1, newItemsPerPage);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (totalPages > 5 && endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">전체 도서</h1>
          </div>
          <div className="mt-2">
            <Separator />
            <p className="text-sm text-muted-foreground mt-2">
              다양한 카테고리의 도서를 검색하고 찾아보세요.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BookFilters 
            onSearch={handleSearch} 
            initialFilter={filter}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <BookGrid books={books} />
            
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {getPageNumbers().map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    aria-disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Books;
