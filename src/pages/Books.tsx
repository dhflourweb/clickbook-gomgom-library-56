import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookFilters } from '@/components/books/BookFilters';
import { BookGrid } from '@/components/books/BookGrid';
import { getBooksByCategory, MOCK_BOOKS, getFavoriteBooks } from '@/data/mockData';
import { Book } from '@/types';
import { BookOpen, Heart, ArrowUpDown } from 'lucide-react';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Skeleton } from '@/components/ui/skeleton';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Books = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24); // Default is 24
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Dialog states for the list view
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  
  const [filter, setFilter] = useState({
    query: '',
    category: '전체',
    status: '전체',
    sort: '인기도순',
    favorite: false,
  });

  // Add state for sorting column
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      
      // Apply favorite filter
      if (filters.favorite) {
        filteredBooks = getFavoriteBooks();
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
      
      // Apply custom column sorting if selected
      if (sortField) {
        filteredBooks = applySortByField(filteredBooks, sortField, sortDirection);
      }
      
      const total = filteredBooks.length;
      setTotalBooks(total);
      setTotalPages(Math.ceil(total / perPage));
      
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
      
      setBooks(paginatedBooks);
      setLoading(false);
    }, 300);
  };

  const applySortByField = (books: Book[], field: string, direction: 'asc' | 'desc') => {
    return [...books].sort((a, b) => {
      let valueA, valueB;
      
      switch (field) {
        case 'status':
          valueA = a.status.available > 0 ? 0 : a.status.reserved ? 1 : 2;
          valueB = b.status.available > 0 ? 0 : b.status.reserved ? 1 : 2;
          break;
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;
        case 'author':
          valueA = a.author;
          valueB = b.author;
          break;
        case 'category':
          valueA = a.category;
          valueB = b.category;
          break;
        case 'location':
          valueA = a.location;
          valueB = b.location;
          break;
        case 'recommendations':
          valueA = a.recommendations || 0;
          valueB = b.recommendations || 0;
          break;
        case 'borrowed':
          valueA = a.status.borrowed || 0;
          valueB = b.status.borrowed || 0;
          break;
        case 'rating':
          valueA = a.rating || 0;
          valueB = b.rating || 0;
          break;
        default:
          return 0;
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return direction === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });
  };

  const handleColumnSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    applyFilters(filter, currentPage, itemsPerPage);
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

  const handleFavoriteToggle = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        const newFavorite = !book.isFavorite;
        return { ...book, isFavorite: newFavorite };
      }
      return book;
    });
    setBooks(updatedBooks);
  };

  const navigateToBookDetail = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleBookAction = (e: React.MouseEvent, action: 'borrow' | 'return' | 'extend' | 'reserve', book: Book) => {
    e.stopPropagation();
    setSelectedBook(book);
    
    if (action === 'borrow') {
      setBorrowDialogOpen(true);
    } else if (action === 'return') {
      setReturnDialogOpen(true);
    } else if (action === 'extend') {
      setExtendDialogOpen(true);
    } else if (action === 'reserve') {
      const updatedBooks = books.map(b => {
        if (b.id === book.id) {
          const isCurrentlyReserved = b.status.reserved;
          return { 
            ...b, 
            status: { 
              ...b.status, 
              reserved: !isCurrentlyReserved 
            }
          };
        }
        return b;
      });
      setBooks(updatedBooks);
    }
  };

  const SortableColumnHeader = ({ field, width, children }: { field: string, width?: string, children: React.ReactNode }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-100 ${width || ''}`}
      onClick={() => handleColumnSort(field)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <ArrowUpDown size={14} className="ml-1 text-gray-400" />
      </div>
    </TableHead>
  );

  const ListViewLoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {isMobile ? (
        <div className="p-4 space-y-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-20 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">상태</TableHead>
              <TableHead className="w-12">즐겨찾기</TableHead>
              <TableHead className="w-[300px]">도서정보</TableHead>
              <TableHead className="w-32">저자</TableHead>
              <TableHead className="w-28">카테고리</TableHead>
              <TableHead className="w-28">위치</TableHead>
              <TableHead className="w-24">추천수</TableHead>
              <TableHead className="w-24">대여횟수</TableHead>
              <TableHead className="w-24">평점</TableHead>
              <TableHead className="w-40">기능</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-16 w-12 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="h-8 w-36" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  const BookListView = () => {
    if (isMobile) {
      return (
        <div className="space-y-4">
          {books.map((book) => {
            const isAvailable = book.status.available > 0;
            const isBorrowedByUser = book.borrowedByCurrentUser || false;
            const isFavorite = book.isFavorite || false;
            
            return (
              <div 
                key={book.id}
                className="border rounded-lg bg-white overflow-hidden"
              >
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => navigateToBookDetail(book.id)}
                >
                  <div className="flex gap-3">
                    <img 
                      src={book.coverImage}
                      alt={book.title}
                      className="h-20 w-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                          <div className="flex gap-1 items-center mt-1">
                            <span className="text-xs text-gray-500">{book.category}</span>
                            {book.rating && (
                              <span className="text-secondary-orange text-xs font-semibold ml-2">
                                ★ {book.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            className={`p-1.5 rounded-full transition-colors ${
                              isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-white/90 hover:bg-gray-100'
                            }`}
                            onClick={(e) => handleFavoriteToggle(e, book.id)}
                            aria-label={isFavorite ? '관심 도서 제거' : '관심 도서 추가'}
                          >
                            <Heart 
                              size={16}
                              fill={isFavorite ? "currentColor" : "none"} 
                              stroke={isFavorite ? "currentColor" : "#000000"}
                              strokeWidth={1.5} 
                              className="transition-all"
                            />
                          </button>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isAvailable ? 'bg-primary-skyblue/20 text-primary-skyblue' : 
                            book.status.reserved ? 'bg-secondary-orange/20 text-secondary-orange' : 
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {isAvailable ? '대여가능' : book.status.reserved ? '예약중' : '대여중'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <BadgeDisplay badges={book.badges} size="xs" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 p-3 pt-0" onClick={(e) => e.stopPropagation()}>
                  {isAvailable ? (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={(e) => handleBookAction(e, 'borrow', book)}
                      disabled={user?.borrowedCount >= 2}
                    >
                      대여하기
                    </Button>
                  ) : isBorrowedByUser ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
                        onClick={(e) => handleBookAction(e, 'return', book)}
                      >
                        반납
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                        onClick={(e) => handleBookAction(e, 'extend', book)}
                        disabled={!book.isExtendable}
                      >
                        연장
                      </Button>
                    </div>
                  ) : book.isReservable === false ? (
                    <Button 
                      variant="secondary"
                      size="sm" 
                      className="w-full bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
                      disabled={true}
                      onClick={(e) => e.stopPropagation()}
                    >
                      예약불가
                    </Button>
                  ) : (
                    <Button 
                      variant={book.status.reserved ? "outline" : "secondary"}
                      size="sm" 
                      className={`w-full ${book.status.reserved
                        ? "border-primary text-primary hover:bg-primary/10"
                        : "bg-secondary hover:bg-secondary/90"
                      }`}
                      onClick={(e) => handleBookAction(e, 'reserve', book)}
                    >
                      {book.status.reserved ? "예약 취소" : "예약하기"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableColumnHeader field="status" width="w-28">상태</SortableColumnHeader>
              <TableHead className="w-12">즐겨찾기</TableHead>
              <SortableColumnHeader field="title" width="w-[300px]">도서정보</SortableColumnHeader>
              <SortableColumnHeader field="author" width="w-32">저자</SortableColumnHeader>
              <SortableColumnHeader field="category" width="w-28">카테고리</SortableColumnHeader>
              <SortableColumnHeader field="location" width="w-28">위치</SortableColumnHeader>
              <SortableColumnHeader field="recommendations" width="w-24">추천수</SortableColumnHeader>
              <SortableColumnHeader field="borrowed" width="w-24">대여횟수</SortableColumnHeader>
              <SortableColumnHeader field="rating" width="w-24">평점</SortableColumnHeader>
              <TableHead className="w-40">기능</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const isAvailable = book.status.available > 0;
              const isBorrowedByUser = book.borrowedByCurrentUser || false;
              const isFavorite = book.isFavorite || false;
              
              return (
                <TableRow 
                  key={book.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigateToBookDetail(book.id)}
                >
                  <TableCell className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isAvailable ? 'bg-primary-skyblue/20 text-primary-skyblue' : 
                      book.status.reserved ? 'bg-secondary-orange/20 text-secondary-orange' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isAvailable ? '대여가능' : book.status.reserved ? '예약중' : '대여중'}
                    </span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className={`p-1.5 rounded-full transition-colors ${
                        isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-white/90 hover:bg-gray-100'
                      }`}
                      onClick={(e) => handleFavoriteToggle(e, book.id)}
                      aria-label={isFavorite ? '관심 도서 제거' : '관심 도서 추가'}
                    >
                      <Heart 
                        size={16} 
                        fill={isFavorite ? "currentColor" : "none"} 
                        stroke={isFavorite ? "currentColor" : "#000000"}
                        strokeWidth={1.5}
                        className="transition-all"
                      />
                    </button>
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
                  <TableCell className="whitespace-nowrap">{book.author}</TableCell>
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
                  <TableCell className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 items-center">
                      {isAvailable ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={(e) => handleBookAction(e, 'borrow', book)}
                          disabled={user?.borrowedCount >= 2}
                        >
                          대여하기
                        </Button>
                      ) : isBorrowedByUser ? (
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
                            onClick={(e) => handleBookAction(e, 'return', book)}
                          >
                            반납
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={(e) => handleBookAction(e, 'extend', book)}
                            disabled={!book.isExtendable}
                          >
                            연장
                          </Button>
                        </div>
                      ) : book.isReservable === false ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="secondary"
                            size="sm" 
                            className="bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
                            disabled={true}
                          >
                            예약불가
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant={book.status.reserved ? "outline" : "secondary"}
                          size="sm" 
                          className={book.status.reserved
                            ? "border-primary text-primary hover:bg-primary/10"
                            : "bg-secondary hover:bg-secondary/90"
                          }
                          onClick={(e) => handleBookAction(e, 'reserve', book)}
                        >
                          {book.status.reserved ? "예약 취소" : "예약하기"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
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
          <div>
            <ListViewLoadingSkeleton />
          </div>
        ) : (
          <>
            {isMobile ? (
              <BookListView />
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
      
      {selectedBook && (
        <>
          <BorrowBookDialog 
            book={selectedBook}
            isOpen={borrowDialogOpen}
            onOpenChange={setBorrowDialogOpen}
          />
          
          <ReturnBookDialog 
            book={selectedBook}
            isOpen={returnDialogOpen}
            onOpenChange={setReturnDialogOpen}
          />
          
          <ExtendBookDialog 
            book={selectedBook}
            isOpen={extendDialogOpen}
            onOpenChange={setExtendDialogOpen}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Books;
