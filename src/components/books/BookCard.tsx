
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { BorrowBookDialog } from './BorrowBookDialog';
import { ReturnBookDialog } from './ReturnBookDialog';
import { ExtendBookDialog } from './ExtendBookDialog';

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard = ({ book, className }: BookCardProps) => {
  const { user } = useAuth();
  const isAvailable = book.status.available > 0;
  const isBorrowedByUser = book.borrowedByCurrentUser || false;
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const [isReserved, setIsReserved] = useState(false);
  
  // Dialogs state
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  
  // Ensure favorite state is updated when book prop changes
  useEffect(() => {
    if (book.isFavorite !== undefined) {
      setIsFavorite(book.isFavorite);
    }
  }, [book.isFavorite]);
  
  // Assume user is the reserver if they've marked it as reserved (in real app, this would come from backend)
  const isUserReserver = isReserved;
  
  // Check if user has reached borrowing limit (2 books max)
  const hasReachedBorrowLimit = user?.borrowedCount >= 2;

  // Randomly determine if a book can be extended based on book id
  // This is just for demonstration - in a real app this would come from the backend
  const isExtendable = book.id % 3 !== 0; // Books with ID not divisible by 3 can be extended

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBorrowDialogOpen(true);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReturnDialogOpen(true);
  };

  const handleExtend = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExtendDialogOpen(true);
  };

  const handleReserve = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReserved(!isReserved);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get appropriate status badge
  const getStatusBadge = () => {
    if (isAvailable) return "대여가능";
    // Update: Show books with isReservable=false as "예약중" instead of "대여중"
    if (isReserved || book.isReservable === false) return "예약중";
    return "대여중";
  };

  const handleCardClick = (e: React.MouseEvent, to: string) => {
    // Allow default navigation
  };

  // Determine which button to show based on book status and user
  const renderActionButton = () => {
    // Case 1: User is the reserver and book is available - Show borrow button
    if (isUserReserver && isAvailable) {
      return (
        <Button 
          variant="default" 
          size="sm" 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleBorrow}
          disabled={hasReachedBorrowLimit}
        >
          대여하기
        </Button>
      );
    }
    
    // Case 2: Book is available and user is not a reserver - Show borrow button
    if (isAvailable && !isUserReserver) {
      return (
        <Button 
          variant="default" 
          size="sm" 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleBorrow}
          disabled={hasReachedBorrowLimit}
        >
          대여하기
        </Button>
      );
    }
    
    // Case 3: Book is borrowed by current user - Show return and extend buttons
    if (isBorrowedByUser) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
            onClick={handleReturn}
          >
            반납하기
          </Button>
          {/* Now the extend button is conditionally enabled based on isExtendable */}
          <Button 
            variant="secondary"
            size="sm" 
            className={cn(
              "bg-secondary hover:bg-secondary/90",
              !isExtendable && "bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
            )}
            onClick={handleExtend}
            disabled={!isExtendable}
          >
            연장하기
          </Button>
        </div>
      );
    }
    
    // Case 4: Book is not reservable - Show disabled reservation button
    if (book.isReservable === false) {
      return (
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Button 
            variant="secondary"
            size="sm" 
            className="w-full bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
            disabled={true}
          >
            예약불가
          </Button>
        </div>
      );
    }
    
    // Case 5: Book is borrowed by someone else - Show reserve/cancel button
    return (
      <Button 
        variant={isReserved ? "outline" : "outline"}
        size="sm" 
        className={cn("w-full", 
          isReserved 
            ? "border-primary text-primary hover:bg-primary/10" 
            : "border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
        )}
        onClick={handleReserve}
      >
        {isReserved ? "예약 취소" : "예약하기"}
      </Button>
    );
  };

  // Get the status class for the badge
  const getStatusClass = () => {
    if (isAvailable) return "bg-primary-deepblue";
    if (isReserved || book.isReservable === false) return "bg-secondary-orange";
    return "bg-point-red";
  };

  return (
    <>
      <div 
        className={cn(
          "book-card overflow-visible transition-all hover:shadow-md hover:scale-[1.02] hover:z-10 cursor-pointer",
          "flex flex-col min-h-[420px]", // Fixed height to ensure uniformity
          className
        )}
        onClick={(e) => handleCardClick(e, `/books/${book.id}`)}
      >
        <Link 
          to={`/books/${book.id}`} 
          className="block"
          onClick={(e) => {
            // Let the parent div handle the click
            e.stopPropagation();
          }}
        >
          <div className="relative">
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="book-cover"
            />
            <div className="absolute top-2 left-2">
              <BadgeDisplay badges={book.badges} size="sm" />
            </div>
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
        </Link>
        <div className="p-3 flex flex-col flex-grow">
          <Link to={`/books/${book.id}`} className="block flex-grow">
            <h3 className="font-medium text-sm line-clamp-2 h-10">{book.title}</h3>
            <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{book.publisher}</p>
            
            {/* Moved the status badge here, above the rating */}
            <div className="mt-3 mb-1">
              <span className={cn(
                "text-xs px-3 py-1 rounded-full font-medium text-white inline-block",
                getStatusClass()
              )}>
                {getStatusBadge()}
              </span>
            </div>
            
            <div className="mt-auto pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{book.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">대여 {book.status.borrowed || 0}회</span>
                {book.rating && (
                  <span className="text-secondary-orange text-xs font-semibold">
                    ★ {book.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
          <div className="mt-2 pt-2 border-t border-gray-100">
            {renderActionButton()}
          </div>
        </div>
      </div>
      
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
        book={{...book, isExtendable, hasBeenExtended: !isExtendable}}
        isOpen={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
      />
    </>
  );
};
