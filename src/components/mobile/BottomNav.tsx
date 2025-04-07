
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Layers, MessageSquare, User, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';

const categories = [
  "문학",
  "경제/경영",
  "자기개발",
  "인문/역사",
  "사회",
  "취미/생활",
  "기타"
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position to show/hide the scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
        <div className="grid grid-cols-5 h-14">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-600 space-y-1">
            <Home size={20} />
            <span className="text-xs">전체메뉴</span>
          </Link>
          
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center text-gray-600 space-y-1 w-full">
                <BookOpen size={20} />
                <span className="text-xs">도서관리</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] rounded-t-xl">
              <DrawerHeader>
                <DrawerTitle className="text-center">도서관리</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <div className="flex flex-col space-y-3">
                  <button 
                    className="w-full py-3 px-4 text-left border-b"
                    onClick={() => navigate('/books')}
                  >
                    도서목록
                  </button>
                  <button 
                    className="w-full py-3 px-4 text-left border-b"
                    onClick={() => navigate('/books/details')}
                  >
                    도서대여현황
                  </button>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <button className="w-full py-2 bg-gray-100 rounded-md">닫기</button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center text-gray-600 space-y-1 w-full">
                <Layers size={20} />
                <span className="text-xs">카테고리</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] rounded-t-xl">
              <DrawerHeader>
                <DrawerTitle className="text-center">카테고리</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <div className="flex flex-col space-y-3">
                  {categories.map((category) => (
                    <button 
                      key={category}
                      className="w-full py-3 px-4 text-left border-b"
                      onClick={() => navigate(`/books?filter=category=${category}`)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <button className="w-full py-2 bg-gray-100 rounded-md">닫기</button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center text-gray-600 space-y-1 w-full">
                <MessageSquare size={20} />
                <span className="text-xs">커뮤니티</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[50vh] rounded-t-xl">
              <DrawerHeader>
                <DrawerTitle className="text-center">커뮤니티</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <div className="flex flex-col space-y-3">
                  <button 
                    className="w-full py-3 px-4 text-left border-b"
                    onClick={() => navigate('/announcements')}
                  >
                    공지사항
                  </button>
                  <button 
                    className="w-full py-3 px-4 text-left border-b"
                    onClick={() => navigate('/inquiries')}
                  >
                    문의하기
                  </button>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <button className="w-full py-2 bg-gray-100 rounded-md">닫기</button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
          <Link to="/mypage" className="flex flex-col items-center justify-center text-gray-600 space-y-1">
            <User size={20} />
            <span className="text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
      
      {/* Floating Scroll to Top Button */}
      <button 
        onClick={scrollToTop} 
        className={cn(
          "fixed right-4 bottom-20 bg-primary-deepblue text-white p-2 rounded-full shadow-lg transition-opacity z-50",
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
};
