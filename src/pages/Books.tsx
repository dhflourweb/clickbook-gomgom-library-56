
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
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const Books = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24); // Default is 24
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  
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
    const viewParam = searchParams.get('view') as 'grid' | 'list' || 'grid';
    
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
    setViewMode(viewParam);
    applyFilters(newFilter, pageParam, perPageParam);
  }, [location.search]);

  const applyFilters = (filters: any, page = 1, perPage = itemsPerPage) => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredBooks = [...MOCK_BOOKS];
      
      // Apply category filter
      if (filters.category !== '전체') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
      }
      
      // Apply status filter
      if (filters.status !== '전체') {
        if (filters.status === '대여가능') {
          filteredBooks = filteredBooks.filter(book => book.status.available > 0);
        } else if (filters.status === '대여중') {
          filteredBooks = filteredBooks.filter(book => book.status.available === 0);
        } else if (filters.status === '예약중') {
          filteredBooks = filteredBooks.filter(book => book.status.available === 0 && book.status.reserved);
        }
      }
      
      // Apply search filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.publisher.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
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
          if (b.recommendations && a.recommendations) {
            return b.recommendations - a.recommendations;
          }
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
      
      // Apply favorite filter
      if (filters.favorite) {
        filteredBooks = filteredBooks.filter(book => book.isFavorite);
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
    params.set('view', viewMode);
    
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

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams);
    params.set('view', mode);
    
    setSearchParams(params);
    setViewMode(mode);
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

  const BookListView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">상태</TableHead>
            <TableHead className="w-[300px]">도서정보</TableHead>
            <TableHead className="w-24">저자</TableHead>
            <TableHead className="w-20">카테고리</TableHead>
            <TableHead className="w-20">위치</TableHead>
            <TableHead className="w-20">추천수</TableHead>
            <TableHead className="w-20">대여횟수</TableHead>
            <TableHead className="w-20">평점</TableHead>
            <TableHead className="w-28">기능</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => {
            const isAvailable = book.status.available > 0;
            const isBorrowedByUser = user?.borrowedBooks === Number(book.id);
            return (
              <TableRow key={book.id}>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isAvailable ? 'bg-primary-skyblue/20 text-primary-skyblue' : 
                    book.status.reserved ? 'bg-secondary-orange/20 text-secondary-orange' : 
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isAvailable ? '대여가능' : book.status.reserved ? '예약중' : '대여중'}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="h-16 w-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium mb-1">{book.title}</div>
                      <div className="text-xs text-gray-500">{book.publisher}</div>
                      <div className="flex gap-1 mt-1">
                        <BadgeDisplay badges={book.badges} size="xs" />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.location || 'A-1-2'}</TableCell>
                <TableCell>{book.recommendations || 0}</TableCell>
                <TableCell>{book.status.borrowed || 0}</TableCell>
                <TableCell>
                  {book.rating && (
                    <span className="text-secondary-orange font-semibold">
                      ★ {book.rating.toFixed(1)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isAvailable ? (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-primary-skyblue hover:bg-primary-skyblue/90"
                      disabled={user?.borrowedCount >= 2}
                    >
                      대여하기
                    </Button>
                  ) : isBorrowedByUser ? (
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="xs" 
                        className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
                      >
                        반납
                      </Button>
                      <Button 
                        variant="outline" 
                        size="xs" 
                        className="border-primary-skyblue text-primary-skyblue hover:bg-primary-skyblue/10"
                      >
                        연장
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="secondary"
                      size="sm" 
                      className="w-full bg-secondary-green hover:bg-secondary-green/90"
                    >
                      예약하기
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

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
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
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
            {viewMode === 'grid' ? (
              <BookGrid books={books} />
            ) : (
              <BookListView />
            )}
            
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
