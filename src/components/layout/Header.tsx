
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const categories = [
  "문학",
  "경제/경영",
  "자기개발",
  "인문/역사",
  "사회",
  "취미/생활",
  "기타"
];

export const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateWithFilter = (path: string, filter?: string) => {
    if (filter) {
      navigate(`${path}?filter=${filter}`);
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white text-primary-deepblue border-b shadow-sm py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Top section with logo */}
        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-secondary-orange">곰클릭</span>
            <span className="text-black">+</span>
            <span className="text-primary-skyblue">책방</span>
          </Link>
          
          {hasRole(["admin", "system_admin"]) && (
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2 text-xs border-primary-deepblue text-primary-deepblue hover:bg-primary-deepblue hover:text-white"
              >
                관리자
              </Button>
            </Link>
          )}
        </div>
        
        {/* Main navigation */}
        <div className="w-full">
          <NavigationMenu className="mx-auto max-w-full justify-start">
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-deepblue hover:bg-gray-100">도서관리</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] p-2">
                    <li onClick={() => navigate('/books')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      전체도서목록
                    </li>
                    <li onClick={() => navigate('/books?filter=new')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      신규도서
                    </li>
                    <li onClick={() => navigate('/books?filter=recommended')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      추천도서
                    </li>
                    <li onClick={() => navigate('/books?filter=best')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      베스트도서(국내)
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-deepblue hover:bg-gray-100">카테고리</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] p-2">
                    {categories.map((category) => (
                      <li 
                        key={category} 
                        onClick={() => navigate(`/books?filter=category=${category}`)} 
                        className="cursor-pointer py-2 px-3 hover:bg-muted"
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-deepblue hover:bg-gray-100">커뮤니티</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] p-2">
                    <li onClick={() => navigate('/announcements')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      공지사항
                    </li>
                    <li onClick={() => navigate('/inquiries')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      문의하기
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-deepblue hover:bg-gray-100">마이페이지</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] p-2">
                    <li onClick={() => navigate('/mypage')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      내 정보
                    </li>
                    <li onClick={() => navigate('/mypage/history')} className="cursor-pointer py-2 px-3 hover:bg-muted">
                      도서대여내역
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};
