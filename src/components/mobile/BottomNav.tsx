
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Grid, Bell, User, Menu } from 'lucide-react';
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
import { categories } from '@/components/layout/Header';

export const BottomNav = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showFullMenu, setShowFullMenu] = useState(false);

  // Don't render on desktop
  if (!isMobile) return null;

  const handleMainMenuClick = () => {
    setShowFullMenu(true);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
        <div className="grid grid-cols-5 h-14">
          {/* 전체메뉴 - Now triggers a full menu Drawer */}
          <button 
            className="flex flex-col items-center justify-center text-gray-600 space-y-1 w-full"
            onClick={handleMainMenuClick}
          >
            <Menu size={20} />
            <span className="text-xs">전체메뉴</span>
          </button>
          
          {/* 카테고리 */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center text-gray-600 space-y-1 w-full">
                <Grid size={20} />
                <span className="text-xs">카테고리</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] rounded-t-xl">
              <DrawerHeader>
                <DrawerTitle className="text-center">카테고리</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <div className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <button 
                      key={category}
                      className="w-full py-2.5 px-3 text-left border-b text-sm"
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
          
          {/* 홈 (중앙) */}
          <Link to="/" className="flex flex-col items-center justify-center text-gray-600 space-y-1">
            <Home size={20} />
            <span className="text-xs">홈</span>
          </Link>
          
          {/* 공지사항 */}
          <Link to="/announcements" className="flex flex-col items-center justify-center text-gray-600 space-y-1">
            <Bell size={20} />
            <span className="text-xs">공지사항</span>
          </Link>
          
          {/* 마이페이지 */}
          <Link to="/mypage" className="flex flex-col items-center justify-center text-gray-600 space-y-1">
            <User size={20} />
            <span className="text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
      
      {/* Full Menu Drawer - Updated to match Header's menu structure */}
      <Drawer open={showFullMenu} onOpenChange={setShowFullMenu}>
        <DrawerContent className="max-h-[85vh] rounded-t-xl overflow-hidden">
          <DrawerHeader>
            <DrawerTitle className="text-center">전체메뉴</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: "calc(85vh - 120px)" }}>
            <div className="flex flex-col space-y-3">
              {/* 도서 관리 */}
              <div className="mb-3">
                <h3 className="font-medium text-sm border-b pb-1.5 mb-1.5">도서관리</h3>
                <div className="space-y-1.5">
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/books');
                      setShowFullMenu(false);
                    }}
                  >
                    도서목록
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/books?sort=최신등록순');
                      setShowFullMenu(false);
                    }}
                  >
                    신규도서
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/books?sort=추천순');
                      setShowFullMenu(false);
                    }}
                  >
                    추천도서
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/books?sort=베스트도서순');
                      setShowFullMenu(false);
                    }}
                  >
                    베스트도서(사내)
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/books?sort=베스트도서순');
                      setShowFullMenu(false);
                    }}
                  >
                    베스트도서(국내)
                  </button>
                </div>
              </div>

              {/* 카테고리 */}
              <div className="mb-3">
                <h3 className="font-medium text-sm border-b pb-1.5 mb-1.5">카테고리</h3>
                <div className="space-y-1.5">
                  {categories.map((category) => (
                    <button 
                      key={category}
                      className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                      onClick={() => {
                        navigate(`/books?filter=category=${category}`);
                        setShowFullMenu(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 커뮤니티 */}
              <div className="mb-3">
                <h3 className="font-medium text-sm border-b pb-1.5 mb-1.5">커뮤니티</h3>
                <div className="space-y-1.5">
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/announcements');
                      setShowFullMenu(false);
                    }}
                  >
                    공지사항
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/inquiries');
                      setShowFullMenu(false);
                    }}
                  >
                    문의하기
                  </button>
                </div>
              </div>

              {/* 마이페이지 */}
              <div className="mb-3">
                <h3 className="font-medium text-sm border-b pb-1.5 mb-1.5">마이페이지</h3>
                <div className="space-y-1.5">
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/mypage');
                      setShowFullMenu(false);
                    }}
                  >
                    내정보
                  </button>
                  <button 
                    className="w-full py-1.5 px-2 text-left text-sm hover:bg-gray-100 rounded"
                    onClick={() => {
                      navigate('/mypage/history');
                      setShowFullMenu(false);
                    }}
                  >
                    도서대여내역
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <button className="w-full py-2 bg-gray-100 rounded-md">닫기</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
