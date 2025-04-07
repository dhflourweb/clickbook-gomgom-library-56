
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Banner } from '@/components/home/Banner';
import { FeaturedBooks } from '@/components/home/FeaturedBooks';
import { 
  MOCK_BANNER_ITEMS, 
  getNewBooks,
  getRecommendedBooks,
  getBestBooks,
  getPopularBooks 
} from '@/data/mockData';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

const Home = () => {
  const newBooks = getNewBooks();
  const recommendedBooks = getRecommendedBooks();
  const bestBooksInternal = getBestBooks();
  const bestBooksNational = getPopularBooks(); // Using popular books as national best books

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner with enhanced styling */}
        <div className="rounded-lg overflow-hidden shadow-sm">
          <Banner items={MOCK_BANNER_ITEMS} />
        </div>
        
        {/* Featured book sections with refined styling */}
        <div className="grid grid-cols-1 gap-10">
          {newBooks.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <FeaturedBooks
                title="신규 도서"
                books={newBooks}
                viewAllUrl="/books?filter=new"
              />
            </section>
          )}
          
          {recommendedBooks.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <FeaturedBooks
                title="추천 도서"
                books={recommendedBooks}
                viewAllUrl="/books?filter=recommended"
              />
            </section>
          )}
          
          {bestBooksInternal.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <FeaturedBooks
                title="베스트 도서 (사내)"
                books={bestBooksInternal}
                viewAllUrl="/books?filter=best"
              />
            </section>
          )}
          
          {bestBooksNational.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm pb-8">
              <FeaturedBooks
                title="베스트 도서 (국내)"
                books={bestBooksNational}
                viewAllUrl="/books?filter=popular"
              />
            </section>
          )}
        </div>
      </div>
      
      {/* Floating scroll to top button */}
      <ScrollToTopButton />
    </MainLayout>
  );
};

export default Home;
