
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { getBookById, getReviewsForBook } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/books/StarRating';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';
import { cn } from '@/lib/utils';
import { Heart, Calendar, Clock, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  
  // Dialog states
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!id) {
    navigate('/books');
    return null;
  }
  
  const book = getBookById(id);
  
  if (!book) {
    navigate('/books');
    return null;
  }

  const reviews = getReviewsForBook(id);
  const isAvailable = book.status.available > 0;
  
  // Generate a shelf number between 1-10 based on book ID
  const shelfLocation = `${parseInt(book.id.replace(/\D/g, ''), 10) % 10 + 1}`;
  
  const handleBorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setBorrowDialogOpen(true);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReturnDialogOpen(true);
  };

  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsReserved(!isReserved);
    
    toast({
      title: isReserved ? "도서 예약 취소 완료" : "도서 예약 신청 완료",
      description: isReserved 
        ? `'${book.title}' 도서 예약이 취소되었습니다.` 
        : `'${book.title}' 도서 예약이 완료되었습니다. 대여 가능 시 알림을 드립니다.`,
    });
  };
  
  const handleExtend = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExtendDialogOpen(true);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "관심 도서 제거" : "관심 도서 등록",
      description: isFavorite 
        ? `'${book.title}' 도서가 관심 목록에서 제거되었습니다.` 
        : `'${book.title}' 도서가 관심 목록에 추가되었습니다.`,
    });
  };
  
  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      toast({
        title: "오류",
        description: "리뷰 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to submit the review
    toast({
      title: "리뷰 등록 완료",
      description: "도서 리뷰가 성공적으로 등록되었습니다.",
    });
    
    setReviewContent('');
    setRating(5);
  };

  // Mock functions to simulate user permissions
  const canBorrow = isAvailable && user?.borrowedCount < 2;
  const canReserve = !isAvailable && book.isReservable !== false;
  const isBorrowedByUser = book.borrowedByCurrentUser || false;
  const hasReachedBorrowLimit = user?.borrowedCount >= 2;

  // Render action buttons based on book status and user
  const renderActionButtons = () => {
    // Case 1: Book is available - Show borrow button
    if (isAvailable) {
      return (
        <Button 
          variant="default" 
          onClick={handleBorrow} 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={hasReachedBorrowLimit}
        >
          대여하기
        </Button>
      );
    }
    
    // Case 2: Book is borrowed by current user - Show return and extend buttons
    if (isBorrowedByUser) {
      return (
        <div className="w-full flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={handleReturn} 
            className="w-full border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
          >
            반납하기
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExtend} 
            className="w-full border-primary text-primary hover:bg-primary/10"
            disabled={!book.isExtendable}
          >
            연장하기
          </Button>
        </div>
      );
    }
    
    // Case 3: Book is not reservable - Show disabled reservation button
    if (book.isReservable === false) {
      return (
        <Button 
          variant="secondary"
          className="w-full bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
          disabled={true}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          예약불가
        </Button>
      );
    }
    
    // Case 4: Book is borrowed by someone else - Show reserve button
    return (
      <Button 
        variant={isReserved ? "outline" : "secondary"}
        onClick={handleReserve}
        className={cn(
          "w-full",
          isReserved 
            ? "border-primary text-primary hover:bg-primary/10" 
            : "bg-secondary hover:bg-secondary/90"
        )}
      >
        {isReserved ? "예약 취소" : "예약하기"}
      </Button>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Main content area with left sidebar and right content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar - Book cover and action buttons - Fixed height */}
            <div className="md:w-1/3 p-6 flex flex-col items-center border-r border-gray-100 md:min-h-[600px] bg-gray-50">
              <div className="relative w-full max-w-[250px]">
                <img
                  src={book.coverImage}
                  alt={`${book.title} 표지`}
                  className="w-full aspect-[3/4] object-cover rounded-md shadow-md mb-6"
                />
                <button
                  className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                    isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-white/90 hover:bg-gray-100'
                  }`}
                  onClick={handleFavoriteToggle}
                  aria-label={isFavorite ? '관심 도서 제거' : '관심 도서 추가'}
                >
                  <Heart 
                    size={18} 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke={isFavorite ? "currentColor" : "#000000"}
                    strokeWidth={1.5}
                    className="transition-all"
                  />
                </button>
              </div>
              
              {/* Book stats */}
              <div className="w-full mt-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    출판일
                  </div>
                  <div className="font-medium">{book.publishDate}</div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    대여 가능
                  </div>
                  <div className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {book.status.available}/{book.status.total}
                  </div>
                </div>
                
                {book.rating && (
                  <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                    <div>평점</div>
                    <div className="flex items-center">
                      <StarRating value={book.rating} size={16} interactive={false} />
                      <span className="ml-1 font-medium">({book.rating})</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="w-full space-y-3 mt-2">
                {renderActionButtons()}
              </div>
            </div>
            
            {/* Right content - Book details */}
            <div className="md:w-2/3 p-6">
              {/* Book badges */}
              {book.badges && book.badges.length > 0 && (
                <div className="mb-4">
                  <BadgeDisplay badges={book.badges} size="md" />
                </div>
              )}
              
              {/* Book title and basic info */}
              <h1 className="text-2xl font-bold mb-3">{book.title}</h1>
              <p className="text-gray-700 mb-6">{book.author}</p>
              
              {/* Tab navigation - Use shadcn Tab component */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="info">도서 정보</TabsTrigger>
                  <TabsTrigger value="reviews">리뷰 ({reviews.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="pt-2">
                  {/* Book details */}
                  {book.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">책 소개</h2>
                      <p className="text-gray-700">{book.description}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-semibold mb-4">상세 정보</h2>
                    
                    {/* Book metadata in grid layout */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">카테고리:</span>
                          <span className="font-medium">{book.category}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">출판일:</span>
                          <span className="font-medium">{book.publishDate}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">출판사:</span>
                          <span className="font-medium">{book.publisher}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">ISBN:</span>
                          <span className="font-medium">{book.isbn}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">위치:</span>
                          <span className="font-medium">{shelfLocation}번 서가</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">등록일:</span>
                          <span className="font-medium">{book.registeredDate}</span>
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">대여 상태:</span>
                          <span className={`font-medium ${isAvailable ? 'text-secondary-green' : 'text-point-red'}`}>
                            {isAvailable ? `대여 가능 (${book.status.available}/${book.status.total})` : '대여중'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-2">
                  {/* Review form */}
                  <div className="mb-6 border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium mb-4">리뷰 작성</h3>
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">평점</div>
                      <div>
                        <StarRating
                          value={rating}
                          onChange={setRating}
                          max={5}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">리뷰 내용</div>
                      <Textarea
                        placeholder="이 책에 대한 의견을 남겨주세요."
                        rows={4}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSubmitReview}>
                      리뷰 등록
                    </Button>
                  </div>
                  
                  {/* Reviews list */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-2">리뷰 {reviews.length}건</h3>
                    
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">아직 작성된 리뷰가 없습니다.</p>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                          <div className="flex items-center mb-2">
                            <div className="font-medium">{review.userName}</div>
                            <div className="ml-2">
                              <StarRating value={review.rating} size={14} interactive={false} />
                            </div>
                            <div className="ml-auto text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reusable Dialogs */}
      <BorrowBookDialog 
        book={book}
        isOpen={borrowDialogOpen}
        onOpenChange={setBorrowDialogOpen}
      />
      
      <ReturnBookDialog 
        book={book}
        isOpen={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
      />
      
      <ExtendBookDialog 
        book={book}
        isOpen={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
      />
    </MainLayout>
  );
};

export default BookDetail;
