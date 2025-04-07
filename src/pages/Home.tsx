
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Banner } from '@/components/home/Banner';
import { BookCarousel } from '@/components/home/BookCarousel';
import { 
  MOCK_BANNER_ITEMS, 
  getNewBooks,
  getRecommendedBooks,
  getBestBooks,
  getPopularBooks 
} from '@/data/mockData';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home = () => {
  const newBooks = getNewBooks();
  const recommendedBooks = getRecommendedBooks();
  const bestBooksInternal = getBestBooks();
  const bestBooksNational = getPopularBooks(); // Using popular books as national best books
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner with enhanced styling */}
        <div className={cn("rounded-lg overflow-hidden", isMobile ? "shadow-none" : "shadow-sm")}>
          <Banner items={MOCK_BANNER_ITEMS} />
        </div>
        
        {/* Featured book sections with carousel layout */}
        <div className="grid grid-cols-1 gap-10">
          {newBooks.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
                <h2 className="text-xl font-semibold text-primary-deepblue">신규 도서</h2>
                <Link to="/books?filter=new">
                  <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
                    더보기
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <BookCarousel books={newBooks} />
            </section>
          )}
          
          {recommendedBooks.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
                <h2 className="text-xl font-semibold text-primary-deepblue">추천 도서</h2>
                <Link to="/books?filter=recommended">
                  <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
                    더보기
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <BookCarousel books={recommendedBooks} />
            </section>
          )}
          
          {bestBooksInternal.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
                <h2 className="text-xl font-semibold text-primary-deepblue">베스트 도서 (사내)</h2>
                <Link to="/books?filter=best">
                  <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
                    더보기
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <BookCarousel books={bestBooksInternal} />
            </section>
          )}
          
          {bestBooksNational.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
                <h2 className="text-xl font-semibold text-primary-deepblue">베스트 도서 (국내)</h2>
                <Link to="/books?filter=popular">
                  <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
                    더보기
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <BookCarousel books={bestBooksNational} />
            </section>
          )}
        </div>
      </div>
      
      {/* Floating scroll to top button (for both mobile and desktop) */}
      <ScrollToTopButton />
    </MainLayout>
  );
};

export default Home;
