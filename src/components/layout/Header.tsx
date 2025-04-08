
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import logo from '@/assets/images/icon_logo.svg';

// Define categories - these will be consistent across the app
export const categories = ["문학", "경제/경영", "자기개발", "인문/역사", "사회", "취미/생활", "기타"];

export const Header = () => {
  const {
    user,
    logout,
    hasRole
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchBar(false);
      setShowSearchModal(false);
    }
  };
  
  const toggleSearchBar = () => {
    if (isMobile) {
      setShowSearchModal(true);
    } else {
      setShowSearchBar(!showSearchBar);
      if (!showSearchBar) {
        // Focus the search input when it appears
        setTimeout(() => {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.focus();
        }, 100);
      }
    }
  };
  
  return <>
        <div className="t-banner text-sm md:text-base">
          <p className="text-white">
            지식을 넓히는 첫걸음! 사내문고 서비스에서 다양한 도서를 만나보세요.
          </p>
        </div>
        <header className="bg-white text-black py-3 px-4 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold flex items-center">
                <img src={logo} alt="" className={cn("h-10")} />
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            {!isMobile && <div className="flex items-center">
                  <NavigationMenu>
                    <NavigationMenuList className="gap-1">
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent text-black hover:bg-gray-100 text-xs font-medium">전체메뉴</NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-white rounded-md p-0 shadow-lg border border-gray-100">
                          <div className="grid grid-cols-4 gap-3 p-4">
                            <div className="space-y-1">
                              <h3 className="text-primary-deepblue text-xs font-medium mb-1.5 border-b pb-1">도서관리</h3>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books')}>도서목록</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=최신등록순')}>신규도서</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=추천순')}>추천도서</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=베스트도서순')}>베스트도서(사내)</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=베스트도서순')}>베스트도서(국내)</p>
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-primary-deepblue text-xs font-medium mb-1.5 border-b pb-1">카테고리</h3>
                              {categories.map(category => <p key={category} className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate(`/books?filter=category=${category}`)}>
                                    {category}
                                  </p>)}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-primary-deepblue text-xs font-medium mb-1.5 border-b pb-1">커뮤니티</h3>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/announcements')}>공지사항</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/inquiries')}>문의하기</p>
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-primary-deepblue text-xs font-medium mb-1.5 border-b pb-1">마이페이지</h3>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/mypage')}>내정보</p>
                              <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/mypage/history')}>도서대여내역</p>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent text-black hover:bg-gray-100 text-xs font-medium">도서관리</NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-white rounded-md p-2 w-auto shadow-lg border border-gray-100">
                          <div className="grid grid-cols-1 min-w-[160px]">
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books')}>도서목록</p>
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=최신등록순')}>신규도서</p>
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=추천순')}>추천도서</p>
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=베스트도서순')}>베스트도서(사내)</p>
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/books?sort=베스트도서순')}>베스트도서(국내)</p>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent text-black hover:bg-gray-100 text-xs font-medium">카테고리</NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-white rounded-md p-2 w-auto shadow-lg border border-gray-100">
                          <div className="grid grid-cols-1 min-w-[160px]">
                            {categories.map(category => <p key={category} className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate(`/books?filter=category=${category}`)}>
                                  {category}
                                </p>)}
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent text-black hover:bg-gray-100 text-xs font-medium">커뮤니티</NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-white rounded-md p-2 shadow-lg border border-gray-100">
                          <div className="w-[160px]">
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/announcements')}>공지사항</p>
                            <p className="text-gray-700 text-[11px] py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md" onClick={() => navigate('/inquiries')}>문의하기</p>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>}

            {/* User controls */}
            <div className="flex items-center">
              {showSearchBar ? (
                <div className="relative flex items-center animated-search">
                  <form onSubmit={handleSearch} className="flex items-center border rounded-md bg-white">
                    <Input 
                      id="searchInput" 
                      placeholder="도서명, 저자, 출판사 검색..." 
                      className="border-0 focus-visible:ring-0 h-10 w-[280px] md:w-[320px] sm:w-[240px]"
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSearchBar}>
                      <X size={16} className="text-gray-500" />
                    </Button>
                  </form>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="text-black" onClick={toggleSearchBar}>
                  <Search size={20} />
                </Button>
              )}

              <Link to="/mypage">
                <Button variant="ghost" size="icon" className="text-black">
                  <User size={20} />
                </Button>
              </Link>

              {isMobile ? (
                <div className="flex ml-1">
                  {hasRole(["admin", "system_admin"]) && (
                    <Link to="/admin" className="ml-1">
                      <Button variant="outline" size="sm" className="text-xs bg-transparent border-gray-300 text-black hover:bg-gray-100 px-2 py-1 h-auto">
                        관리자
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {hasRole(["admin", "system_admin"]) && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="ml-2 text-xs bg-transparent border-gray-300 text-black hover:bg-gray-100">
                        관리자
                      </Button>
                    </Link>
                  )}
                </>
              )}

              <Button variant="ghost" size="icon" onClick={logout} className="text-black ml-1">
                <LogOut size={20} />
              </Button>
            </div>
          </div>

          {/* Mobile Search Modal */}
          {isMobile && (
            <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>도서 검색</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <Input 
                    placeholder="도서명, 저자, 출판사 검색..." 
                    className="flex-1" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    autoFocus 
                  />
                  <Button type="submit">검색</Button>
                </form>
                <DialogFooter className="sm:justify-start">
                  <Button type="button" variant="secondary" onClick={() => setShowSearchModal(false)}>
                    취소
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </header>
      </>;
};
