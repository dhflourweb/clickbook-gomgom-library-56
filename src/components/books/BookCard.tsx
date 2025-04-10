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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { SYSTEM_SETTINGS } from '@/data/mockData';

interface BookCardProps {
  book: Book;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export const BookCard = ({ book, className, viewMode = 'grid' }: BookCardProps) => {
  const { user } = useAuth();
  const isAvailable = book.status.available > 0;
  const isBorrowedByUser = book.borrowedByCurrentUser || false;
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);
  const [isReserved, setIsReserved] = useState(false);
  
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendConfirmOpen, setExtendConfirmOpen] = useState(false);
  
  useEffect(() => {
    if (book.isFavorite !== undefined) {
      setIsFavorite(book.isFavorite);
    }
  }, [book.isFavorite]);
  
  const isUserReserver = isReserved;
  
  const hasReachedBorrowLimit = user?.borrowedCount >= 2;

  const isExtendable = parseInt(book.id.replace('book', '')) % 3 !== 0;
  const hasBeenExtended = book.hasBeenExtended || !isExtendable;

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
    
    if (!hasBeenExtended) {
      setExtendConfirmOpen(true);
    }
  };
  
  const processExtension = () => {
    setExtendConfirmOpen(false);
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

  const getStatusBadge = () => {
    if (isAvailable) return "대여가능";
    if (isReserved || book.isReservable === false) return "예약중";
    return "대여중";
  };

  const handleCardClick = (e: React.MouseEvent, to: string) => {
  };

  const renderActionButton = () => {
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
            variant="secondary"
            size="sm" 
            className={cn(
              hasBeenExtended 
                ? "bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed" 
                : "bg-secondary hover:bg-secondary/90"
            )}
            onClick={handleExtend}
            disabled={hasBeenExtended}
          >
            연장하기
          </Button>
        </div>
      );
    }
    
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

  const getStatusClass = () => {
    if (isAvailable) return "bg-primary-deepblue";
    if (isReserved || book.isReservable === false) return "bg-secondary-orange";
    return "bg-point-red";
  };

  const cardClassName = cn(
    "book-card overflow-visible transition-all hover:shadow-md hover:scale-[1.02] hover:z-10 cursor-pointer",
    viewMode === 'grid' 
      ? "flex flex-col min-h-[420px]" 
      : "flex flex-row gap-4 min-h-[180px] p-4 border rounded-lg",
    className
  );

  return (
    <>
      <div 
        className={cardClassName}
        onClick={(e) => handleCardClick(e, `/books/${book.id}`)}
      >
        <Link 
          to={`/books/${book.id}`} 
          className={cn("block", viewMode === 'list' && "flex-shrink-0 w-[120px]")}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative">
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className={cn(
                "book-cover", 
                viewMode === 'list' && "max-h-[160px] w-[120px] object-cover"
              )}
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
        <div className={cn(
          "p-3 flex flex-col", 
          viewMode === 'grid' ? "flex-grow" : "flex-grow"
        )}>
          <Link to={`/books/${book.id}`} className={cn(
            "block", 
            viewMode === 'grid' ? "flex-grow" : ""
          )}>
            <h3 className="font-medium text-sm line-clamp-2 h-10">{book.title}</h3>
            <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{book.publisher}</p>
            
            <div className="mt-3 mb-1">
              <span className={cn(
                "text-xs px-3 py-1 rounded-full font-medium text-white inline-block",
                getStatusClass()
              )}>
                {getStatusBadge()}
              </span>
            </div>
            
            <div className={cn(
              "mt-auto pt-2 flex items-center",
              viewMode === 'list' ? "justify-end gap-4" : "justify-between"
            )}>
              <span className={cn(
                "text-xs text-gray-500 whitespace-nowrap", 
                viewMode === 'list' && "order-2"
              )}>
                {book.category}
              </span>
              <div className={cn(
                "flex items-center gap-2", 
                viewMode === 'list' && "order-3 flex-nowrap whitespace-nowrap"
              )}>
                <span className="text-xs text-gray-500">대여 {book.status.borrowed || 0}회</span>
                {book.rating && (
                  <span className="text-secondary-orange text-xs font-semibold whitespace-nowrap">
                    ★ {book.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
          <div className={cn(
            viewMode === 'grid' ? "mt-2 pt-2 border-t border-gray-100" : "mt-4"
          )}>
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
        book={{...book, isExtendable, hasBeenExtended}}
        isOpen={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
      />
      
      <AlertDialog open={extendConfirmOpen} onOpenChange={setExtendConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>도서 연장 확인</AlertDialogTitle>
            <AlertDialogDescription>
              도서 반납일 연장은 최대 {SYSTEM_SETTINGS.maxExtensionCount}회이며, {SYSTEM_SETTINGS.extensionDays}일을 연장할 수 있습니다. 연장하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end gap-2">
            <AlertDialogCancel onClick={() => setExtendConfirmOpen(false)} className="sm:mt-0">
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={processExtension}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
