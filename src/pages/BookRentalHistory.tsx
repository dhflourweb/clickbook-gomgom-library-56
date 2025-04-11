
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
import { Calendar as CalendarIcon, Search, BookOpen, ArrowDownUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/books/StarRating';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { categories } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

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

interface ReviewFormData {
  bookId: string;
  rating: number;
  review: string;
  recommended: boolean;
}

interface ReturnFormData {
  bookId: string;
  returnLocation: string;
}

// Sample rental data - in a real application, this would come from an API
const sampleRentals: RentalBook[] = [
  {
    id: '1',
    bookId: 'book1',
    title: '클린 아키텍쳐',
    author: '로버트 C. 마틴',
    category: '기타',
    coverUrl: 'https://image.yes24.com/goods/77283734/XL',
    rentDate: '2025-04-01',
    dueDate: '2025-04-15',
    status: '대여중',
    badges: ['best', 'recommended']
  },
  {
    id: '2',
    bookId: 'book2',
    title: '객체지향의 사실과 오해',
    author: '조영호',
    category: '기타',
    coverUrl: 'https://image.yes24.com/goods/18249021/XL',
    rentDate: '2025-04-03',
    dueDate: '2025-04-17',
    status: '대여중',
    badges: ['new']
  },
  {
    id: '3',
    bookId: 'book3',
    title: '이것이 자바다',
    author: '신용권',
    category: '기타',
    coverUrl: 'https://image.yes24.com/goods/15651484/XL',
    rentDate: '2025-03-28',
    dueDate: '2025-04-11',
    status: '연체',
    badges: []
  },
  {
    id: '4',
    bookId: 'book4',
    title: '모던 자바스크립트 Deep Dive',
    author: '이웅모',
    category: '기타',
    coverUrl: 'https://image.yes24.com/goods/92742567/XL',
    rentDate: '2025-03-15',
    dueDate: '2025-03-29',
    status: '반납완료',
    returnDate: '2025-03-25',
    badges: ['best']
  }
];

const BookRentalHistory = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // State management
  const [rentals, setRentals] = useState<RentalBook[]>(sampleRentals);
  const [filteredRentals, setFilteredRentals] = useState<RentalBook[]>(sampleRentals);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [statusFilter, setStatusFilter] = useState('전체');
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    bookId: '',
    rating: 0,
    review: '',
    recommended: false
  });
  const [returnForm, setReturnForm] = useState<ReturnFormData>({
    bookId: '',
    returnLocation: '회사 로비',
  });
  const [activeTab, setActiveTab] = useState('전체');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);

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
  }, [searchQuery, categoryFilter, dateRange, rentals, activeTab, sortField, sortDirection]);

  // Handle review submission
  const handleReviewSubmit = () => {
    // In a real app, this would be an API call
    toast({
      title: "리뷰가 등록되었습니다",
      description: `"${rentals.find(r => r.bookId === reviewForm.bookId)?.title}"에 대한 리뷰가 성공적으로 등록되었습니다.`,
    });
    
    // Reset form and close dialog
    setReviewForm({
      bookId: '',
      rating: 0,
      review: '',
      recommended: false
    });
    setReviewDialogOpen(false);
  };

  // Handle return submission
  const handleReturnSubmit = (bookId: string) => {
    // In a real app, this would be an API call
    const updatedRentals = rentals.map(rental => 
      rental.bookId === bookId 
        ? {
            ...rental,
            status: '반납완료' as const,
            returnDate: format(new Date(), 'yyyy-MM-dd')
          }
        : rental
    );
    
    setRentals(updatedRentals);
    
    toast({
      title: "도서 반납이 완료되었습니다",
      description: `"${rentals.find(r => r.bookId === bookId)?.title}"이(가) 성공적으로 반납되었습니다.`,
    });
    
    // Reset form and close dialog
    setReturnForm({
      bookId: '',
      returnLocation: '회사 로비'
    });
    setReturnDialogOpen(false);
  };
  
  // Handle extension
  const handleExtend = (bookId: string) => {
    // In a real app, this would be an API call
    const updatedRentals = rentals.map(rental => {
      if (rental.bookId === bookId) {
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
    
    toast({
      title: "대여 기간이 연장되었습니다",
      description: `"${rentals.find(r => r.bookId === bookId)?.title}"의 대여 기간이 14일 연장되었습니다.`,
    });
    
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

  // Open review dialog
  const openReviewDialog = (bookId: string) => {
    const book = rentals.find(r => r.bookId === bookId);
    if (book) {
      setReviewForm({
        bookId: bookId,
        rating: 0,
        review: '',
        recommended: false
      });
      setReviewDialogOpen(true);
    }
  };

  // Open return dialog
  const openReturnDialog = (bookId: string) => {
    setReturnForm({
      bookId: bookId,
      returnLocation: '회사 로비'
    });
    setReturnDialogOpen(true);
  };
  
  // Open extend dialog
  const openExtendDialog = (bookId: string) => {
    setSelectedBookId(bookId);
    setExtendDialogOpen(true);
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowDownUp size={14} className="ml-1 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp size={14} className="ml-1" />;
    if (sortDirection === 'desc') return <ArrowDown size={14} className="ml-1" />;
    return <ArrowDownUp size={14} className="ml-1 opacity-50" />;
  };

  return (
    <MainLayout>
      <div className="container pt-6 pb-10">
        <h1 className="text-2xl font-semibold mb-6">도서대여목록</h1>
        
        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
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
            <div className="w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 카테고리</SelectItem>
                  {categories.map(category => (
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
                  className="w-full justify-start text-left font-normal sm:w-[300px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        FROM: {format(dateRange.from, "yyyy-MM-dd")} - TO: {format(dateRange.to, "yyyy-MM-dd")}
                      </>
                    ) : (
                      format(dateRange.from, "yyyy-MM-dd")
                    )
                  ) : (
                    <span>대여기간 선택</span>
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
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="전체" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="전체">전체</TabsTrigger>
            <TabsTrigger value="대여중">대여중</TabsTrigger>
            <TabsTrigger value="연체">연체</TabsTrigger>
            <TabsTrigger value="반납완료">반납완료</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Rental List */}
        {isMobile ? (
          // Mobile view - cards
          <div className="space-y-4">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">대여 내역이 없습니다.</p>
              </div>
            ) : (
              filteredRentals.map(rental => (
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
                              openReturnDialog(rental.bookId);
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
                              openExtendDialog(rental.bookId);
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
                                openReviewDialog(rental.bookId);
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
          // Desktop view - table
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      도서 {renderSortIndicator('title')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      카테고리 {renderSortIndicator('category')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('rentDate')}
                  >
                    <div className="flex items-center">
                      대여일 {renderSortIndicator('rentDate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center">
                      반납예정일 {renderSortIndicator('dueDate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      상태 {renderSortIndicator('status')}
                    </div>
                  </TableHead>
                  <TableHead>버튼</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">대여 내역이 없습니다.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRentals.map((rental) => (
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
                      <TableCell>{rental.category}</TableCell>
                      <TableCell>{rental.rentDate}</TableCell>
                      <TableCell>{rental.dueDate}</TableCell>
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
                                openReturnDialog(rental.bookId);
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
                                openExtendDialog(rental.bookId);
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
                                openReviewDialog(rental.bookId);
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
      </div>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>도서 리뷰 작성</DialogTitle>
            <DialogDescription>
              도서에 대한 평점과 리뷰를 남겨주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">만족도</h4>
              <StarRating
                rating={reviewForm.rating}
                setRating={(rating) => setReviewForm({...reviewForm, rating})}
                size={24}
              />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">후기</h4>
              <Textarea
                placeholder="이 책에 대한 후기를 남겨주세요..."
                value={reviewForm.review}
                onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommend"
                  checked={reviewForm.recommended}
                  onCheckedChange={(checked) => 
                    setReviewForm({...reviewForm, recommended: checked as boolean})
                  }
                />
                <label
                  htmlFor="recommend"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  이 책을 추천하시겠어요?
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              onClick={handleReviewSubmit}
              disabled={!reviewForm.rating || !reviewForm.review}
            >
              리뷰 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Return Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>도서 반납</DialogTitle>
            <DialogDescription>
              반납 위치를 선택하고 확인 버튼을 눌러주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup 
              value={returnForm.returnLocation} 
              onValueChange={(value) => setReturnForm({...returnForm, returnLocation: value})}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="회사 로비" id="lobby-desktop" />
                <Label htmlFor="lobby-desktop">회사 로비</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="도서 책장" id="bookshelf-desktop" />
                <Label htmlFor="bookshelf-desktop">도서 책장</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="부서 사무실" id="office-desktop" />
                <Label htmlFor="office-desktop">부서 사무실</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              onClick={() => handleReturnSubmit(returnForm.bookId)}
              className="border-secondary-orange bg-secondary-orange hover:bg-secondary-orange/90"
            >
              반납 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Extend Dialog */}
      <AlertDialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>대여 기간 연장</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedBookId && rentals.find(r => r.bookId === selectedBookId)?.title} 도서의 대여 기간을 14일 연장하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedBookId && handleExtend(selectedBookId)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              연장
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default BookRentalHistory;
