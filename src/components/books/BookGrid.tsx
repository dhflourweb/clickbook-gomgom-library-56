
import { Book } from '@/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
}

export const BookGrid = ({ 
  books, 
  emptyMessage = "검색된 도서가 없습니다.",
  viewMode = 'grid'
}: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        : "flex flex-col gap-4"
    }>
      {books.map((book) => (
        <BookCard key={book.id} book={book} viewMode={viewMode} />
      ))}
    </div>
  );
};
