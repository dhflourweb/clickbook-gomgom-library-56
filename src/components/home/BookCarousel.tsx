
import { Book } from '@/types';
import { BookCard } from '@/components/books/BookCard';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

interface BookCarouselProps {
  books: Book[];
  className?: string;
}

export const BookCarousel = ({ books, className }: BookCarouselProps) => {
  const isMobile = useIsMobile();
  
  // Determine how many cards to show based on viewport
  const getItemsPerView = () => {
    if (isMobile) return 1.2; // Show 1.2 items on mobile (peek at next card)
    if (window.innerWidth < 1024) return 2.5;
    if (window.innerWidth < 1280) return 3.5;
    return 4.5; // Default for large screens
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: books.length > 4,
      }}
      className={cn("w-full", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map((book) => (
          <CarouselItem 
            key={book.id} 
            className={cn(
              isMobile ? "pl-2 basis-[80%] sm:basis-[85%]" : "pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            )}
          >
            <BookCard book={book} />
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Only show controls if not on mobile */}
      {!isMobile && (
        <>
          <CarouselPrevious className="-left-4 bg-white border-gray-200" />
          <CarouselNext className="-right-4 bg-white border-gray-200" />
        </>
      )}
    </Carousel>
  );
};
