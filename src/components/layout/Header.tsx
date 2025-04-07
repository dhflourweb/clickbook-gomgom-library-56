
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, BookOpen, Layers, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

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
    <header className="bg-primary-deepblue text-white py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 text-white">
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[500px] bg-white rounded-md p-0">
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="space-y-2">
                  <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">도서관리</h3>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books')} className="px-0">
                    <span className="text-gray-700">도서목록</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books/details')} className="px-0">
                    <span className="text-gray-700">도서대여현황</span>
                  </DropdownMenuItem>
                </div>
                <div className="space-y-2">
                  <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">마이페이지</h3>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/mypage')} className="px-0">
                    <span className="text-gray-700">내정보</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/mypage/history')} className="px-0">
                    <span className="text-gray-700">도서대여내역(반납)</span>
                  </DropdownMenuItem>
                </div>
                <div className="space-y-2">
                  <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">커뮤니티</h3>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/faq')} className="px-0">
                    <span className="text-gray-700">FAQ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/inquiries')} className="px-0">
                    <span className="text-gray-700">문의하기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/announcements')} className="px-0">
                    <span className="text-gray-700">공지사항</span>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-secondary-orange">곰클릭</span>
            <span className="text-white">+</span>
            <span className="text-primary-skyblue">책방</span>
          </Link>
        </div>
        
        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">전체메뉴</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-0">
                  <div className="grid grid-cols-3 gap-4 w-[500px] p-4">
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">도서관리</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/books')}>도서목록</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/books/details')}>도서대여현황</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">마이페이지</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/mypage')}>내정보</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/mypage/history')}>도서대여내역(반납)</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">커뮤니티</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/faq')}>FAQ</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/inquiries')}>문의하기</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/announcements')}>공지사항</p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">카테고리</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-2">
                  <div className="grid grid-cols-1 w-[200px]">
                    {categories.map((category) => (
                      <p 
                        key={category} 
                        className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md"
                        onClick={() => navigate(`/books?filter=category=${category}`)}
                      >
                        {category}
                      </p>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">공지사항</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-2">
                  <div className="w-[200px]">
                    <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                       onClick={() => navigate('/announcements')}>공지사항</p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* User controls */}
        <div className="flex items-center">
          <Link to="/mypage">
            <Button variant="ghost" size="icon" className="text-white">
              <User size={20} />
            </Button>
          </Link>
          
          {hasRole(["admin", "system_admin"]) && (
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2 text-xs bg-transparent border-white text-white hover:bg-white/20"
              >
                관리자
              </Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-white"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};
