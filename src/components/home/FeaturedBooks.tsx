
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
    <section className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="text-xl font-semibold text-primary-deepblue">{title}</h2>
        <Link to={viewAllUrl}>
          <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
            더보기
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
      
      <BookGrid books={displayBooks} />
    </section>
  );
};
