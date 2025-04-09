
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { BookCarousel } from '@/components/home/BookCarousel';
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
        return "이 달의 추천 도서";
      case "best":
        return "사내 인기 도서";
      case "nationalBest":
        return "국내 인기 도서";
      default:
        return "";
    }
  };
  
  const getTabDescription = () => {
    switch(activeTab) {
      case "new":
        return "이번 달 새로 입고된 도서입니다!";
      case "recommended":
        return "꼭 읽어봐야 할 도서를 추천합니다!";
      case "best":
        return "임직원이 가장 많이 읽은 도서입니다!";
      case "nationalBest":
        return "베스트셀러를 사내문고에서 만나보세요!";
      default:
        return "";
    }
  };
  
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm", className)}>
      <Tabs defaultValue="new" onValueChange={setActiveTab}>
        {isMobile ? (
          <TabsList className="grid grid-cols-2 gap-2 w-full mb-6 bg-gray-100 p-1 rounded-md">
            <TabsTrigger 
              value="new" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              신규 도서
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              추천 도서
            </TabsTrigger>
            <TabsTrigger 
              value="best" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              베스트 도서(사내)
            </TabsTrigger>
            <TabsTrigger 
              value="nationalBest" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              베스트 도서(국내)
            </TabsTrigger>
          </TabsList>
        ) : (
          <TabsList className="inline-flex w-auto mb-6 bg-gray-100 p-1 rounded-md">
            <TabsTrigger 
              value="new" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              신규 도서
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              추천 도서
            </TabsTrigger>
            <TabsTrigger 
              value="best" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              베스트 도서(사내)
            </TabsTrigger>
            <TabsTrigger 
              value="nationalBest" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary-skyblue"
            >
              베스트 도서(국내)
            </TabsTrigger>
          </TabsList>
        )}
        
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
        
        <TabsContent value="nationalBest" className="overflow-visible pt-2">
          <BookCarousel books={nationalBestBooks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
