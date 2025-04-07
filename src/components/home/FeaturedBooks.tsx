
import { Book } from '@/types';
import { BookGrid } from '../books/BookGrid';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedBooksProps {
  title: string;
  books: Book[];
  viewAllUrl: string;
}

export const FeaturedBooks = ({ title, books, viewAllUrl }: FeaturedBooksProps) => {
  const displayBooks = books.slice(0, 5);
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link to={viewAllUrl}>
          <Button variant="ghost" className="text-sm font-medium" size="sm">
            전체보기
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
      
      <BookGrid books={displayBooks} />
    </section>
  );
};
