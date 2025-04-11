import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, ArrowDownUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { toast } from 'sonner';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';
import { ReviewDialog } from '@/components/books/ReviewDialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MOCK_BOOKS } from '@/data/mockData';

// Types
type SortDirection = 'asc' | 'desc' | null;
type SortField = 'title' | 'author' | 'category' | 'rentDate' | 'dueDate' | 'status' | null;

interface RentalBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  rentDate: string;
  dueDate: string;
  status: '대여중' | '연체' | '반납완료';
  returnDate?: string;
  badges: Array<'new' | 'best' | 'recommended' | null>;
}

const BookRentalHistory = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Use actual book data from mockData
  const mockBooks = MOCK_BOOKS;
  
  // Generate rental data from mock books
  const generateRentalData = () => {
    return mockBooks.slice(0, 10).map((book, index) => {
      // Create rental dates
      const today = new Date();
      const rentDate = new Date();
      rentDate.setDate(today.getDate() - (index % 3 === 0 ? 15 : 5)); // Some older, some newer
      
      const dueDate = new Date(rentDate);
      dueDate.setDate(rentDate.getDate() + 14); // 14 days rental period
      
      let status: '대여중' | '연체' | '반납완료';
      let returnDate: string | undefined;
      
      // Set status based on dates
      if (index % 3 === 0) {
        status = '반납완료';
        const tempReturnDate = new Date(rentDate);
        tempReturnDate.setDate(rentDate.getDate() + 10);
        returnDate = format(tempReturnDate, 'yyyy-MM-dd');
      } else if (index % 3 === 1) {
        status = '연체';
      } else {
        status = '대여중';
      }
      
      return {
        id: `rental-${index}`,
        bookId: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        coverUrl: book.coverImage,
        rentDate: format(rentDate, 'yyyy-MM-dd'),
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        status,
        returnDate,
        badges: book.badges
      };
    });
  };
  
  // State management
  const [rentals, setRentals] = useState<RentalBook[]>(generateRentalData());
  const [filteredRentals, setFilteredRentals] = useState<RentalBook[]>(rentals);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [statusFilter, setStatusFilter] = useState('전체');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedBook, setSelectedBook] = useState<RentalBook | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');
  
  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRentals, setPaginatedRentals] = useState<RentalBook[]>([]);

  // Calculate paginated rentals
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedRentals(filteredRentals.slice(startIndex, endIndex));
  }, [filteredRentals, currentPage, itemsPerPage]);

  // Go to book detail page
  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  // Sort rentals
  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc';
    
    if (sortField === field) {
      if (sortDirection === 'asc') {
        direction = 'desc';
      } else if (sortDirection === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }
    
    setSortField(field);
    setSortDirection(direction);
  };

  // Filter rentals based on search, category, date range, and status
  useEffect(() => {
    let filtered = [...rentals];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(rental => 
        rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter && categoryFilter !== '전체') {
      filtered = filtered.filter(rental => rental.category === categoryFilter);
    }
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      filtered = filtered.filter(rental => {
        const rentDate = new Date(rental.rentDate);
        return rentDate >= fromDate && rentDate <= toDate;
      });
    }
    
    // Filter by status
    if (activeTab !== '전체') {
      filtered = filtered.filter(rental => rental.status === activeTab);
    }
    
    // Sort data if needed
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'rentDate':
            comparison = new Date(a.rentDate).getTime() - new Date(b.rentDate).getTime();
            break;
          case 'dueDate':
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    setFilteredRentals(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, categoryFilter, dateRange, rentals, activeTab, sortField, sortDirection]);

  // Pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle return submission
  const handleReturn = () => {
    if (!selectedBook) return;
    
    // In a real app, this would be an API call
    const updatedRentals = rentals.map(rental => 
      rental.bookId === selectedBook.bookId 
        ? {
            ...rental,
            status: '반납완료' as const,
            returnDate: format(new Date(), 'yyyy-MM-dd')
          }
        : rental
    );
    
    setRentals(updatedRentals);
    
    toast.success(`"${selectedBook.title}" 도서가 성공적으로 반납되었습니다.`);
    
    // Close dialog
    setReturnDialogOpen(false);
  };
  
  // Handle extension
  const handleExtend = () => {
    if (!selectedBook) return;
    
    // In a real app, this would be an API call
    const updatedRentals = rentals.map(rental => {
      if (rental.bookId === selectedBook.bookId) {
        // Add 14 days to the due date
        const currentDueDate = new Date(rental.dueDate);
        const newDueDate = new Date(currentDueDate);
        newDueDate.setDate(currentDueDate.getDate() + 14);
        
        return {
          ...rental,
          dueDate: format(newDueDate, 'yyyy-MM-dd')
        };
      }
      return rental;
    });
    
    setRentals(updatedRentals);
    
    toast.success(`"${selectedBook.title}" 도서의 대여 기간이 14일 연장되었습니다.`);
    
    // Close dialog
    setExtendDialogOpen(false);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case '대여중':
        return 'bg-green-100 text-green-800';
      case '연체':
        return 'bg-red-100 text-red-800';
      case '반납완료':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Open dialogs
  const openReturnDialog = (book: RentalBook) => {
    setSelectedBook(book);
    setReturnDialogOpen(true);
  };

  const openExtendDialog = (book: RentalBook) => {
    setSelectedBook(book);
    setExtendDialogOpen(true);
  };
  
  const openReviewDialog = (book: RentalBook) => {
    setSelectedBook(book);
    setReviewDialogOpen(true);
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowDownUp size={14} className="ml-1 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp size={14} className="ml-1" />;
    if (sortDirection === 'desc') return <ArrowDown size={14} className="ml-1" />;
    return <ArrowDownUp size={14} className="ml-1 opacity-50" />;
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);

  return (
    <MainLayout>
      <div className="container pt-6 pb-10">
        <h1 className="text-2xl font-semibold mb-2">도서대여목록</h1>
        <p className="text-gray-500 mb-6">내가 대여한 도서 목록을 조회하고 반납/연장할 수 있습니다.</p>
        
        {/* Filter Controls - Wrapped with white background */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <Input
                  type="text"
                  placeholder="도서명, 저자 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              
              {/* Category Filter */}
              <div className="w-full xs:w-auto sm:w-40">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체 카테고리</SelectItem>
                    {['기타', '경제/경영', '자기계발', '소설', '역사'].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MM.dd")} - {format(dateRange.to, "MM.dd")}
                        </>
                      ) : (
                        format(dateRange.from, "yyyy-MM-dd")
                      )
                    ) : (
                      <span>대여기간</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                  <div className="p-2 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      초기화
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Items per page selector */}
              <div className="w-full xs:w-auto sm:w-32 ml-auto">
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="표시 개수" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5개</SelectItem>
                    <SelectItem value="10">10개</SelectItem>
                    <SelectItem value="20">20개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Status Tabs */}
          <Tabs defaultValue="전체" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="전체">전체</TabsTrigger>
              <TabsTrigger value="대여중">대여중</TabsTrigger>
              <TabsTrigger value="연체">연체</TabsTrigger>
              <TabsTrigger value="반납완료">반납완료</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Book List Section - Wrapped with white background */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Rental List */}
          {isMobile ? (
            // Mobile view - cards
            <div className="space-y-4">
              {paginatedRentals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">대여 내역이 없습니다.</p>
                </div>
              ) : (
                paginatedRentals.map(rental => (
                  <Card 
                    key={rental.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => handleBookClick(rental.bookId)}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-28 flex-shrink-0">
                        <img 
                          src={rental.coverUrl} 
                          alt={rental.title} 
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150x200?text=No+Cover";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-base line-clamp-2">{rental.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{rental.author}</p>
                            <div className="mt-1">
                              <BadgeDisplay badges={rental.badges} size="xs" />
                            </div>
                          </div>
                          <div>
                            <span className={cn("text-xs px-2 py-1 rounded-full inline-block", getStatusColor(rental.status))}>
                              {rental.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1 mt-2">
                          <p>카테고리: {rental.category}</p>
                          <p>대여일: {rental.rentDate}</p>
                          <p>반납예정일: {rental.dueDate}</p>
                          {rental.returnDate && <p>반납일: {rental.returnDate}</p>}
                        </div>
                        
                        {/* Action buttons */}
                        {rental.status === '대여중' || rental.status === '연체' ? (
                          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                openReturnDialog(rental);
                              }}
                            >
                              반납
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-primary text-primary hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                openExtendDialog(rental);
                              }}
                            >
                              연장
                            </Button>
                          </div>
                        ) : (
                          rental.status === '반납완료' && (
                            <div className="mt-3" onClick={e => e.stopPropagation()}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReviewDialog(rental);
                                }}
                              >
                                리뷰 작성
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Desktop view - table - updated to match Books list view style
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer font-medium" 
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        도서 {renderSortIndicator('title')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer font-medium" 
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center">
                        카테고리 {renderSortIndicator('category')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer font-medium" 
                      onClick={() => handleSort('rentDate')}
                    >
                      <div className="flex items-center">
                        대여일 {renderSortIndicator('rentDate')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer font-medium" 
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center">
                        반납예정일 {renderSortIndicator('dueDate')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer font-medium" 
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        상태 {renderSortIndicator('status')}
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">버튼</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRentals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-gray-500">대여 내역이 없습니다.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRentals.map((rental) => (
                      <TableRow key={rental.id} className="cursor-pointer hover:bg-muted/20" onClick={() => handleBookClick(rental.bookId)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={rental.coverUrl} 
                              alt={rental.title} 
                              className="w-12 h-16 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150x200?text=No+Cover";
                              }}
                            />
                            <div>
                              <p className="font-medium">{rental.title}</p>
                              <p className="text-sm text-gray-500">{rental.author}</p>
                              <div className="mt-1">
                                <BadgeDisplay badges={rental.badges} size="xs" />
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{rental.category}</TableCell>
                        <TableCell className="text-gray-600">{rental.rentDate}</TableCell>
                        <TableCell className="text-gray-600">{rental.dueDate}</TableCell>
                        <TableCell>
                          <span className={cn("px-2 py-1 rounded-full text-xs", getStatusColor(rental.status))}>
                            {rental.status}
                          </span>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          {rental.status === '대여중' || rental.status === '연체' ? (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReturnDialog(rental);
                                }}
                              >
                                반납
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-primary text-primary hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openExtendDialog(rental);
                                }}
                              >
                                연장
                              </Button>
                            </div>
                          ) : (
                            rental.status === '반납완료' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReviewDialog(rental);
                                }}
                              >
                                리뷰 작성
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {filteredRentals.length > itemsPerPage && (
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
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  // Show first page, last page, current page, and adjacent pages
                  const showPage = 
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                  
                  if (!showPage) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNumber}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        href="#" 
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      
      {/* Dialogs */}
      {selectedBook && (
        <>
          {/* Return Dialog */}
          <ReturnBookDialog 
            book={{
              id: selectedBook.bookId,
              title: selectedBook.title,
              author: selectedBook.author,
              coverImage: selectedBook.coverUrl,
              description: '',
              category: selectedBook.category,
              publishDate: '',
              publisher: '',
              status: {
                available: 1,
                total: 1,
                borrowed: 0
              },
              location: '',
              isbn: '',
              source: '',
              registeredDate: '',
              badges: selectedBook.badges,
            }}
            isOpen={returnDialogOpen} 
            onOpenChange={setReturnDialogOpen} 
          />
          
          {/* Extend Dialog */}
          <ExtendBookDialog 
            book={{
              id: selectedBook.bookId,
              title: selectedBook.title,
              author: selectedBook.author,
              coverImage: selectedBook.coverUrl,
              description: '',
              category: selectedBook.category,
              publishDate: '',
              publisher: '',
              status: {
                available: 1,
                total: 1,
                borrowed: 0
              },
              location: '',
              isbn: '',
              source: '',
              registeredDate: '',
              badges: selectedBook.badges,
              returnDueDate: selectedBook.dueDate,
              hasBeenExtended: selectedBook.status === '연체',
            }}
            isOpen={extendDialogOpen} 
            onOpenChange={setExtendDialogOpen} 
          />
          
          {/* Review Dialog */}
          <ReviewDialog 
            book={{
              id: selectedBook.bookId,
              title: selectedBook.title,
              author: selectedBook.author,
              coverImage: selectedBook.coverUrl,
              description: '',
              category: selectedBook.category,
              publishDate: '',
              publisher: '',
              status: {
                available: 1,
                total: 1,
                borrowed: 0
              },
              location: '',
              isbn: '',
              source: '',
              registeredDate: '',
              badges: selectedBook.badges,
            }}
            isOpen={reviewDialogOpen} 
            onOpenChange={setReviewDialogOpen}
          />
        </>
      )}
    </MainLayout>
  );
};

export default BookRentalHistory;
