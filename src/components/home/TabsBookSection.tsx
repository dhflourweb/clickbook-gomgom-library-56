
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
  
  const getTabTitle = () => {
    switch(activeTab) {
      case "new":
        return "새로 들어온 도서";
      case "recommended":
        return "추천 도서";
      case "best":
        return "베스트 도서";
      case "nationalBest":
        return "베스트 도서";
      default:
        return "";
    }
  };
  
  const getTabDescription = () => {
    if (activeTab === "new") {
      return "이번 주 새로 입고된 도서입니다.";
    }
    return "";
  };
  
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm", className)}>
      <Tabs defaultValue="new" onValueChange={setActiveTab}>
        <TabsList className={cn("w-full", isMobile ? "grid grid-cols-3" : "inline-flex")}>
          <TabsTrigger value="new" className="text-sm">신규 도서</TabsTrigger>
          <TabsTrigger value="recommended" className="text-sm">추천 도서</TabsTrigger>
          <TabsTrigger value="best" className="text-sm">베스트 도서</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between mt-6 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{getTabTitle()}</h2>
            {getTabDescription() && (
              <p className="text-sm text-gray-500 mt-1">{getTabDescription()}</p>
            )}
          </div>
          
          {isExternalLink ? (
            <a 
              href={getMoreLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 flex items-center"
            >
              더보기
              <ChevronRight size={16} className="ml-1" />
            </a>
          ) : (
            <Link to={getMoreLink()} className="text-sm font-medium text-primary-skyblue hover:text-primary-skyblue/90 flex items-center">
              더보기
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
        
        <TabsContent value="new" className="overflow-visible pt-2">
          <BookCarousel books={newBooks} />
        </TabsContent>
        
        <TabsContent value="recommended" className="overflow-visible pt-2">
          <BookCarousel books={recommendedBooks} />
        </TabsContent>
        
        <TabsContent value="best" className="overflow-visible pt-2">
          <BookCarousel books={bestBooks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
