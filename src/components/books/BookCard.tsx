
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard = ({ book, className }: BookCardProps) => {
  const isAvailable = book.status.available > 0;

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
        <div className="absolute bottom-2 right-2">
          <span className={`badge ${isAvailable ? 'bg-secondary-green' : 'bg-point-red'} text-white`}>
            {isAvailable ? `대여가능 (${book.status.available}/${book.status.total})` : '대여중'}
          </span>
        </div>
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
      </div>
    </Link>
  );
};
