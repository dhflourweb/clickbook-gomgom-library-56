
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
            <DropdownMenuContent className="w-64 bg-white">
              <DropdownMenuLabel>메뉴</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <DropdownMenuItem className="cursor-pointer">
                  <Menu className="mr-2 h-4 w-4" />
                  <span>메인 화면</span>
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>도서 관리</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white">
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books')}>
                    전체도서목록
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books', 'new')}>
                    신규도서
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books', 'recommended')}>
                    추천도서
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/books', 'best')}>
                    베스트도서(국내)
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Layers className="mr-2 h-4 w-4" />
                  <span>카테고리</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white">
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => navigateWithFilter('/books', `category=${category}`)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>커뮤니티</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white">
                  <DropdownMenuItem onClick={() => navigateWithFilter('/announcements')}>
                    공지사항
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/inquiries')}>
                    문의하기
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <span>마이페이지</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white">
                  <DropdownMenuItem onClick={() => navigateWithFilter('/mypage')}>
                    내 정보
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateWithFilter('/mypage/history')}>
                    도서대여내역
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              {hasRole(["admin", "system_admin"]) && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  <DropdownMenuItem className="cursor-pointer">
                    <span>관리자</span>
                  </DropdownMenuItem>
                </Link>
              )}
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">도서관리</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">카테고리</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">커뮤니티</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-primary-deepblue/50">마이페이지</NavigationMenuTrigger>
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
