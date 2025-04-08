
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getBookById, getReviewsForBook } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/books/StarRating';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';
import { cn } from '@/lib/utils';

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
  
  const handleBorrow = () => {
    setBorrowDialogOpen(true);
  };

  const handleReturn = () => {
    setReturnDialogOpen(true);
  };

  const handleReserve = () => {
    setIsReserved(!isReserved);
    
    toast({
      title: isReserved ? "도서 예약 취소 완료" : "도서 예약 신청 완료",
      description: isReserved 
        ? `'${book.title}' 도서 예약이 취소되었습니다.` 
        : `'${book.title}' 도서 예약이 완료되었습니다. 대여 가능 시 알림을 드립니다.`,
    });
  };
  
  const handleExtend = () => {
    setExtendDialogOpen(true);
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
          className="bg-primary hover:bg-primary/90"
          disabled={hasReachedBorrowLimit}
        >
          대여하기
        </Button>
      );
    }
    
    // Case 2: Book is borrowed by current user - Show return and extend buttons
    if (isBorrowedByUser) {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReturn} 
            className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
          >
            반납하기
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExtend} 
            className="border-primary text-primary hover:bg-primary/10"
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
          className="bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
          disabled={true}
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Book cover */}
            <div className="md:w-1/3 p-6">
              <img
                src={book.coverImage}
                alt={`${book.title} 표지`}
                className="w-full aspect-[3/4] object-cover rounded-md shadow-md"
              />
            </div>
            
            {/* Book details */}
            <div className="md:w-2/3 p-6">
              <div className="mb-4">
                <BadgeDisplay badges={book.badges} size="md" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700"><span className="font-semibold">저자:</span> {book.author}</p>
                <p className="text-gray-700"><span className="font-semibold">출판사:</span> {book.publisher}</p>
                <p className="text-gray-700"><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                <p className="text-gray-700"><span className="font-semibold">카테고리:</span> {book.category}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">대여 상태:</span> 
                  <span className={`ml-1 ${isAvailable ? 'text-secondary-green' : 'text-point-red'}`}>
                    {isAvailable ? `대여 가능 (${book.status.available}/${book.status.total})` : '대여중'}
                  </span>
                </p>
                <p className="text-gray-700"><span className="font-semibold">위치:</span> {book.location}</p>
              </div>
              
              {book.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">도서 소개</h2>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-6">
                {renderActionButtons()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">도서 리뷰</h2>
          
          {/* Review form */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium mb-2">리뷰 작성</h3>
            <div className="mb-4">
              <Label htmlFor="rating">평점</Label>
              <div className="mt-1">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  max={5}
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="review">리뷰 내용</Label>
              <Textarea
                id="review"
                placeholder="이 책에 대한 의견을 남겨주세요."
                className="mt-1"
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
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 작성된 리뷰가 없습니다.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="font-medium">{review.userName}</div>
                    <div className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</div>
                    <div className="ml-auto text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
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
