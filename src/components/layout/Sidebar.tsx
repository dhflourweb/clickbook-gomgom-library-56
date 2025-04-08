
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, Settings, MessageSquare, Home, 
  BookMarked, BarChart3, Award, ChevronDown, ChevronRight, Layers, User
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/components/layout/Header';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Sidebar = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole(["admin", "system_admin"]);
  
  const navigateWithFilter = (path: string, filter?: string) => {
    if (filter) {
      navigate(`${path}?filter=${filter}`);
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white border-r shadow-sm py-3">
      <div className="px-4 mb-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="text-secondary-orange">곰클릭</span>
          <span>+</span>
          <span className="text-primary-skyblue">책방</span>
        </Link>
      </div>
      
      <div className="flex-1 px-2 overflow-auto">
        <Accordion type="multiple" className="w-full">
          <div className="space-y-1">
            <div className="flex items-center py-2 px-2 rounded-md">
              <Home size={20} className="mr-2 text-gray-600" />
              <Link to="/" className="text-gray-800 font-medium">메인 화면</Link>
            </div>
            
            <div className="border-b my-2"></div>
            
            <AccordionItem value="books" className="border-0">
              <AccordionTrigger className="py-2 px-2 hover:no-underline">
                <div className="flex items-center">
                  <BookOpen size={20} className="mr-2 text-gray-600" />
                  <span className="text-gray-800 font-medium">도서 관리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-8 space-y-1 mt-1">
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigateWithFilter('/books')}>
                    도서목록
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigate('/books?sort=최신등록순')}>
                    신규도서
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigate('/books?sort=추천순')}>
                    추천도서
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigate('/books?sort=베스트도서순')}>
                    베스트도서(사내)
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigate('/books?sort=베스트도서순')}>
                    베스트도서(국내)
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-b my-2"></div>
            
            <AccordionItem value="categories" className="border-0">
              <AccordionTrigger className="py-2 px-2 hover:no-underline">
                <div className="flex items-center">
                  <Layers size={20} className="mr-2 text-gray-600" />
                  <span className="text-gray-800 font-medium">카테고리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-8 space-y-1 mt-1">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigateWithFilter('/books', `category=${category}`)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-b my-2"></div>
            
            <AccordionItem value="community" className="border-0">
              <AccordionTrigger className="py-2 px-2 hover:no-underline">
                <div className="flex items-center">
                  <MessageSquare size={20} className="mr-2 text-gray-600" />
                  <span className="text-gray-800 font-medium">커뮤니티</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-8 space-y-1 mt-1">
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigateWithFilter('/announcements')}>
                    공지사항
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigateWithFilter('/inquiries')}>
                    문의하기
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-b my-2"></div>
            
            <AccordionItem value="mypage" className="border-0">
              <AccordionTrigger className="py-2 px-2 hover:no-underline">
                <div className="flex items-center">
                  <User size={20} className="mr-2 text-gray-600" />
                  <span className="text-gray-800 font-medium">마이 페이지</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-8 space-y-1 mt-1">
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigateWithFilter('/mypage')}>
                    내 정보
                  </div>
                  <div className="py-1 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigateWithFilter('/mypage/history')}>
                    도서대여내역
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
          
          {isAdmin && (
            <div className="mt-6">
              <div className="border-b my-2"></div>
              <h3 className="px-2 text-sm font-semibold text-gray-500 mb-2">
                관리자 메뉴
              </h3>
              <div className="space-y-1">
                <div className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                     onClick={() => navigate('/admin')}>
                  <BarChart3 size={20} className="mr-2 text-gray-600" />
                  <span>관리자 대시보드</span>
                </div>
                <div className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                     onClick={() => navigate('/admin/books')}>
                  <BookMarked size={20} className="mr-2 text-gray-600" />
                  <span>도서 관리</span>
                </div>
                <div className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                     onClick={() => navigate('/admin/users')}>
                  <Users size={20} className="mr-2 text-gray-600" />
                  <span>사용자 관리</span>
                </div>
                {hasRole("system_admin") && (
                  <div className="flex items-center py-2 px-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                       onClick={() => navigate('/admin/system')}>
                    <Settings size={20} className="mr-2 text-gray-600" />
                    <span>시스템 관리</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Accordion>
      </div>
    </div>
  );
};
