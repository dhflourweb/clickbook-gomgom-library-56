
import { useState } from 'react';
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
  // Fix: borrowedBooks is a number, not an array, and we need to ensure type safety
  const isBorrowedByUser = user?.borrowedBooks === Number(book.id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`'${book.title}' 도서를 대여했습니다.`);
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

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`'${book.title}' 도서를 반납했습니다.`);
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

  return (
    <Link to={`/books/${book.id}`} className={cn("book-card", className)}>
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
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/60 text-gray-400'
          }`}
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? '관심 도서 제거' : '관심 도서 추가'}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? "currentColor" : "none"} 
            className="transition-all"
          />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
        <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{book.publisher}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">{book.category}</span>
          {book.rating && (
            <div className="flex items-center">
              <span className="text-secondary-orange text-xs font-semibold">
                ★ {book.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          {isAvailable ? (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-primary-skyblue hover:bg-primary-skyblue/90"
              onClick={handleBorrow}
            >
              대여하기
            </Button>
          ) : isBorrowedByUser ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
              onClick={handleReturn}
            >
              반납하기
            </Button>
          ) : (
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
          )}
        </div>
      </div>
    </Link>
  );
};
