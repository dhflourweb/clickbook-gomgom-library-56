
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, BookOpen, Layers, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-primary-deepblue text-white py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 text-white">
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel>메뉴</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <Link to="/">
                <DropdownMenuItem className="cursor-pointer">
                  <Menu className="mr-2 h-4 w-4" />
                  <span>메인 화면</span>
                </DropdownMenuItem>
              </Link>
              
              <Link to="/books">
                <DropdownMenuItem className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>도서 관리</span>
                </DropdownMenuItem>
              </Link>
              
              <Link to="/categories">
                <DropdownMenuItem className="cursor-pointer">
                  <Layers className="mr-2 h-4 w-4" />
                  <span>카테고리</span>
                </DropdownMenuItem>
              </Link>
              
              <Link to="/community">
                <DropdownMenuItem className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>커뮤니티</span>
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSeparator />
              
              {hasRole(["admin", "system_admin"]) && (
                <Link to="/admin">
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
        
        {/* Search bar and user controls */}
        <div className="flex items-center">
          {isSearchOpen ? (
            <div className="relative flex items-center md:w-auto w-full">
              <Input 
                type="text"
                placeholder="도서 검색..."
                className="w-[200px] bg-white/10 border-none text-white placeholder:text-gray-300"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 text-white"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-white"
            >
              <Search size={20} />
            </Button>
          )}
          
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
