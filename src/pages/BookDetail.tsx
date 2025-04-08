
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Heart } from 'lucide-react';
import { getBookById, getReviewsForBook } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/books/StarRating';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  
  // Dialog states
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  
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
  const isBorrowedByUser = book.borrowedByCurrentUser || false;
  
  // Check if user has reached borrowing limit
  const hasReachedBorrowLimit = user?.borrowedCount >= 2;
  
  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    setBorrowDialogOpen(true);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    setReturnDialogOpen(true);
  };
  
  const handleExtend = (e: React.MouseEvent) => {
    e.preventDefault();
    setExtendDialogOpen(true);
  };

  const handleReserve = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsReserved(!isReserved);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };
  
  // Determine which button to show based on book status and user
  const renderActionButtons = () => {
    // Case 1: Book is available - Show borrow button
    if (isAvailable) {
      return (
        <Button 
          variant="default" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleBorrow}
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
            className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
            onClick={handleReturn}
          >
            반납하기
          </Button>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={handleExtend}
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
        <div 
          onClick={(e) => e.preventDefault()}
        >
          <Button 
            variant="secondary"
            className="bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
            disabled={true}
          >
            예약불가
          </Button>
        </div>
      );
    }
    
    // Case 4: Book is borrowed by someone else - Show reserve/cancel button
    return (
      <Button 
        variant={isReserved ? "outline" : "secondary"}
        className={
          isReserved 
            ? "border-primary text-primary hover:bg-primary/10" 
            : "bg-secondary hover:bg-secondary/90"
        }
        onClick={handleReserve}
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
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={`${book.title} 표지`}
                  className="w-full aspect-[3/4] object-cover rounded-md shadow-md"
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
              <label htmlFor="rating">평점</label>
              <div className="mt-1">
                <StarRating
                  value={5}
                  onChange={() => {}}
                  max={5}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="review">리뷰 내용</label>
              <textarea
                id="review"
                placeholder="이 책에 대한 의견을 남겨주세요."
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <Button>
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
      
      {/* Dialogs */}
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
