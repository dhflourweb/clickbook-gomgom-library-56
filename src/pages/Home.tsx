
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
import { Book } from '@/types';
import { Separator } from '@/components/ui/separator';

const Home = () => {
  const newBooks = getNewBooks();
  const recommendedBooks = getRecommendedBooks();
  const bestBooksInternal = getBestBooks();
  const bestBooksNational = getPopularBooks(); // Using popular books as national best books

  return (
    <MainLayout>
      <div className="space-y-8">
        <Banner items={MOCK_BANNER_ITEMS} />
        
        {newBooks.length > 0 && (
          <>
            <FeaturedBooks
              title="신규 도서"
              books={newBooks}
              viewAllUrl="/books?filter=new"
            />
            <Separator className="my-6" />
          </>
        )}
        
        {recommendedBooks.length > 0 && (
          <>
            <FeaturedBooks
              title="추천 도서"
              books={recommendedBooks}
              viewAllUrl="/books?filter=recommended"
            />
            <Separator className="my-6" />
          </>
        )}
        
        {bestBooksInternal.length > 0 && (
          <>
            <FeaturedBooks
              title="베스트 도서 (사내)"
              books={bestBooksInternal}
              viewAllUrl="/books?filter=best"
            />
            <Separator className="my-6" />
          </>
        )}
        
        {bestBooksNational.length > 0 && (
          <div className="pb-6">
            <FeaturedBooks
              title="베스트 도서 (국내)"
              books={bestBooksNational}
              viewAllUrl="/books?filter=popular"
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
