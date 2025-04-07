
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Home, BookOpen, MessageSquare, ChevronDown, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-primary-deepblue text-white py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
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
                <NavigationMenuContent className="bg-white rounded-md p-0 mt-0">
                  <div className="grid grid-cols-4 gap-4 w-[600px] p-4">
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">도서관리</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/books')}>도서목록</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/books/details')}>도서대여현황</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">카테고리</h3>
                      {categories.map((category) => (
                        <p key={category} className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                           onClick={() => navigate(`/books?filter=category=${category}`)}>
                          {category}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">커뮤니티</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/announcements')}>공지사항</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/inquiries')}>문의하기</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary-deepblue font-medium mb-3 border-b pb-1">마이페이지</h3>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/mypage')}>내정보</p>
                      <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                         onClick={() => navigate('/mypage/history')}>도서대여내역</p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">카테고리</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-2 w-auto">
                  <div className="grid grid-cols-1 min-w-[200px]">
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">커뮤니티</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-2">
                  <div className="w-[200px]">
                    <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                       onClick={() => navigate('/announcements')}>공지사항</p>
                    <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                       onClick={() => navigate('/inquiries')}>문의하기</p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">마이페이지</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md p-2">
                  <div className="w-[200px]">
                    <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                       onClick={() => navigate('/mypage')}>내정보</p>
                    <p className="text-gray-700 py-2 cursor-pointer hover:bg-gray-100 px-2 rounded-md" 
                       onClick={() => navigate('/mypage/history')}>도서대여내역</p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* User controls */}
        <div className="flex items-center">
          <div className="relative flex items-center">
            <form onSubmit={handleSearch} className="flex items-center border rounded-md bg-white mr-2">
              <Input 
                placeholder="도서 검색..." 
                className="border-0 focus-visible:ring-0 h-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
              >
                <Search size={16} className="text-gray-500" />
              </Button>
            </form>
          </div>
          
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
