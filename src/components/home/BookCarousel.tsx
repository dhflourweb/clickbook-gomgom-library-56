
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
  
  return (
    <Carousel
      opts={{
        align: "start",
        loop: books.length > 4,
      }}
      className={cn("w-full overflow-visible", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
        {books.map((book) => (
          <CarouselItem 
            key={book.id} 
            className={cn(
              "overflow-visible",
              isMobile ? "pl-2 basis-[80%] sm:basis-[85%]" : "pl-4 md:basis-1/3 lg:basis-[22%]"
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
