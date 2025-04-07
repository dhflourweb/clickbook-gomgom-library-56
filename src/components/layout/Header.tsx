
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Menu } from 'lucide-react';
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
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateWithFilter = (path: string, filter?: string) => {
    if (filter) {
      navigate(`${path}?filter=${filter}`);
    } else {
      navigate(path);
    }
    setIsSidebarOpen(false);
  };

  return (
    <header className="bg-primary-deepblue text-white py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center space-x-4">
          <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="p-2 text-white">
                <Menu size={24} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] bg-white rounded-t-md p-0">
              <div className="flex h-full">
                <div className="w-full">
                  <div className="p-4">
                    <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                      <div className="text-xl font-bold flex items-center">
                        <span className="text-secondary-orange">곰클릭</span>
                        <span className="text-black">+</span>
                        <span className="text-primary-skyblue">책방</span>
                      </div>
                    </Link>
                  </div>
                  <div className="h-full overflow-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center py-3 px-4 hover:bg-gray-100">
                        <Home size={20} className="mr-3 text-gray-600" />
                        <Link to="/" className="text-gray-800" onClick={() => setIsSidebarOpen(false)}>
                          메인 화면
                        </Link>
                      </div>
                      
                      <div className="flex items-center py-3 px-4 hover:bg-gray-100">
                        <BookOpen size={20} className="mr-3 text-gray-600" />
                        <span className="text-gray-800">도서 관리</span>
                        <ChevronDown size={18} className="ml-auto text-gray-500" />
                      </div>
                      
                      <div className="bg-gray-50 py-2">
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/books')}>
                          도서목록
                        </div>
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/books/details')}>
                          도서대여현황
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 px-4 hover:bg-gray-100">
                        <Layers size={20} className="mr-3 text-gray-600" />
                        <span className="text-gray-800">카테고리</span>
                        <ChevronDown size={18} className="ml-auto text-gray-500" />
                      </div>
                      
                      <div className="bg-gray-50 py-2">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/books', `category=${category}`)}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center py-3 px-4 hover:bg-gray-100">
                        <MessageSquare size={20} className="mr-3 text-gray-600" />
                        <span className="text-gray-800">커뮤니티</span>
                        <ChevronDown size={18} className="ml-auto text-gray-500" />
                      </div>
                      
                      <div className="bg-gray-50 py-2">
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/announcements')}>
                          공지사항
                        </div>
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/inquiries')}>
                          문의하기
                        </div>
                      </div>
                      
                      <div className="flex items-center py-3 px-4 hover:bg-gray-100">
                        <User size={20} className="mr-3 text-gray-600" />
                        <span className="text-gray-800">마이 페이지</span>
                        <ChevronDown size={18} className="ml-auto text-gray-500" />
                      </div>
                      
                      <div className="bg-gray-50 py-2">
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/mypage')}>
                          내 정보
                        </div>
                        <div className="py-2 px-11 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigateWithFilter('/mypage/history')}>
                          도서대여내역
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
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
                         onClick={() => navigate('/mypage/history')}>도서대여내역</p>
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
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/search')}>
            <Search size={20} />
          </Button>
          
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
