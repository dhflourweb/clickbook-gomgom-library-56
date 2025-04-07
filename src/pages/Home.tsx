
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { Banner } from '@/components/home/Banner';
import { FeaturedBooks } from '@/components/home/FeaturedBooks';
import { BookFilters } from '@/components/books/BookFilters';
import { 
  MOCK_BANNER_ITEMS, 
  getNewBooks,
  getRecommendedBooks,
  getBestBooks,
  getPopularBooks 
} from '@/data/mockData';
import { Book } from '@/types';

const Home = () => {
  const handleSearch = (filters: any) => {
    console.log("Search with filters:", filters);
    // In a real app, this would trigger a search navigation
  };

  const newBooks = getNewBooks();
  const recommendedBooks = getRecommendedBooks();
  const bestBooks = getBestBooks();
  const popularBooks = getPopularBooks();

  return (
    <MainLayout>
      <div className="space-y-8">
        <Banner items={MOCK_BANNER_ITEMS} />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">도서 검색</h2>
          <BookFilters onSearch={handleSearch} />
        </div>
        
        {newBooks.length > 0 && (
          <FeaturedBooks
            title="신규 도서"
            books={newBooks}
            viewAllUrl="/books?filter=new"
          />
        )}
        
        {recommendedBooks.length > 0 && (
          <FeaturedBooks
            title="추천 도서"
            books={recommendedBooks}
            viewAllUrl="/books?filter=recommended"
          />
        )}
        
        {bestBooks.length > 0 && (
          <FeaturedBooks
            title="베스트 도서"
            books={bestBooks}
            viewAllUrl="/books?filter=best"
          />
        )}
        
        {popularBooks.length > 0 && (
          <FeaturedBooks
            title="인기 도서"
            books={popularBooks}
            viewAllUrl="/books?filter=popular"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
