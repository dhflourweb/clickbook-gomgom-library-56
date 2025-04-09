
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { BookCarousel } from '@/components/home/BookCarousel';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Book } from '@/types';

interface TabsBookSectionProps {
  newBooks: Book[];
  recommendedBooks: Book[];
  bestBooks: Book[];
  className?: string;
}

export const TabsBookSection = ({
  newBooks,
  recommendedBooks,
  bestBooks,
  className
}: TabsBookSectionProps) => {
  // Mock national bestseller books for demonstration
  const nationalBestBooks = bestBooks.slice().reverse();
  
  const [activeTab, setActiveTab] = useState("new");
  
  const getMoreLink = () => {
    switch(activeTab) {
      case "new":
        return "/books?sort=최신등록순";
      case "recommended":
        return "/books?sort=추천순";
      case "best":
        return "/books?sort=베스트도서순";
      case "nationalBest":
        return "https://store.kyobobook.co.kr/bestseller/online/daily";
      default:
        return "/books";
    }
  };
  
  const isExternalLink = activeTab === "nationalBest";
  
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="new">신규 도서</TabsTrigger>
            <TabsTrigger value="recommended">추천 도서</TabsTrigger>
            <TabsTrigger value="best">베스트 도서(사내)</TabsTrigger>
            <TabsTrigger value="nationalBest">베스트 도서(국내)</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="new" className="overflow-visible mt-0">
              <BookCarousel books={newBooks} />
            </TabsContent>
            
            <TabsContent value="recommended" className="overflow-visible mt-0">
              <BookCarousel books={recommendedBooks} />
            </TabsContent>
            
            <TabsContent value="best" className="overflow-visible mt-0">
              <BookCarousel books={bestBooks} />
            </TabsContent>
            
            <TabsContent value="nationalBest" className="overflow-visible mt-0">
              <BookCarousel books={nationalBestBooks} />
            </TabsContent>
          </div>
        </Tabs>
        
        {isExternalLink ? (
          <a 
            href={getMoreLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 flex items-center ml-4 shrink-0"
          >
            더보기
            <ChevronRight size={16} className="ml-1" />
          </a>
        ) : (
          <Link to={getMoreLink()} className="ml-4 shrink-0">
            <Button variant="ghost" className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 hover:bg-transparent p-0 h-auto" size="sm">
              더보기
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
