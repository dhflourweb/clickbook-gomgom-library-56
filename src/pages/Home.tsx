
import { MainLayout } from '@/components/layout/MainLayout';
import { Banner } from '@/components/home/Banner';
import { 
  MOCK_BANNER_ITEMS, 
  getNewBooks,
  getRecommendedBooks,
  getBestBooks
} from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TabsBookSection } from '@/components/home/TabsBookSection';

const Home = () => {
  const newBooks = getNewBooks();
  const recommendedBooks = getRecommendedBooks();
  const bestBooks = getBestBooks();
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Banner with enhanced styling */}
        <div className={cn("rounded-lg overflow-hidden mb-6", isMobile ? "shadow-none" : "shadow-sm")}>
          <Banner items={MOCK_BANNER_ITEMS} />
        </div>
        
        {/* Combined tabbed book section */}
        <TabsBookSection 
          newBooks={newBooks}
          recommendedBooks={recommendedBooks}
          bestBooks={bestBooks}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
