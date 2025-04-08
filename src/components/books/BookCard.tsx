
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard = ({ book, className }: BookCardProps) => {
  const { user } = useAuth();
  const isAvailable = book.status.available > 0;
  const isBorrowedByUser = user?.borrowedBooks === Number(book.id);
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const [isReserved, setIsReserved] = useState(false);
  
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

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (hasReachedBorrowLimit) {
      toast.error('최대 2권까지 대여 가능합니다.');
      return;
    }
    
    toast.success(`'${book.title}' 도서를 대여했습니다.`);
    // In a real app, this would navigate to the borrowing page
    window.location.href = '/mypage';
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`'${book.title}' 도서를 반납했습니다.`);
    window.location.href = '/mypage';
  };

  const handleExtend = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`'${book.title}' 도서 대여를 연장했습니다.`);
    window.location.href = '/mypage';
  };

  const handleReserve = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsReserved(!isReserved);
    
    if (!isReserved) {
      toast.success(`'${book.title}' 도서를 예약했습니다.`);
    } else {
      toast.info(`'${book.title}' 도서 예약을 취소했습니다.`);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success(`'${book.title}' 도서를 관심 도서에 추가했습니다.`);
    } else {
      toast.info(`'${book.title}' 도서를 관심 도서에서 제거했습니다.`);
    }
  };

  // Get appropriate status badge
  const getStatusBadge = () => {
    if (isAvailable) return "대여가능";
    if (isReserved) return "예약중";
    return "대여중";
  };

  // Determine which button to show based on book status and user
  const renderActionButton = () => {
    // Case 1: User is the reserver and book is available - Show borrow button
    if (isUserReserver && isAvailable) {
      return (
        <Button 
          variant="default" 
          size="sm" 
          className="w-full bg-primary-skyblue hover:bg-primary-skyblue/90"
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
          className="w-full bg-primary-skyblue hover:bg-primary-skyblue/90"
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
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary-skyblue text-primary-skyblue hover:bg-primary-skyblue/10"
            onClick={handleExtend}
          >
            연장하기
          </Button>
        </div>
      );
    }
    
    // Case 4 & 5: Book is borrowed by someone else - Show reserve/cancel button
    return (
      <Button 
        variant={isReserved ? "outline" : "secondary"}
        size="sm" 
        className={cn("w-full", 
          isReserved 
            ? "border-secondary-green text-secondary-green hover:bg-secondary-green/10" 
            : "bg-secondary-green hover:bg-secondary-green/90"
        )}
        onClick={handleReserve}
      >
        {isReserved ? "예약 취소" : "예약하기"}
      </Button>
    );
  };

  return (
    <Link to={`/books/${book.id}`} className={cn("book-card hover:border-gray-300", className)}>
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
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-white'
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
        <div className="absolute bottom-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isAvailable ? 'bg-primary-skyblue/20 text-primary-skyblue' : 
            isReserved ? 'bg-secondary-orange/20 text-secondary-orange' : 
            'bg-gray-200 text-gray-600'
          }`}>
            {getStatusBadge()}
          </span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
        <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{book.publisher}</p>
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
        <div className="mt-2 pt-2 border-t border-gray-100">
          {renderActionButton()}
        </div>
      </div>
    </Link>
  );
};
