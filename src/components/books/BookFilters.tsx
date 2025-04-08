
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useIsMobile } from '@/hooks/use-mobile';

interface BookFiltersProps {
  onSearch: (filters: FilterState) => void;
  initialFilter?: FilterState;
}

interface FilterState {
  query: string;
  category: string;
  status: string;
  sort: string;
  favorite: boolean;
}

const CATEGORIES = [
  '전체',
  'IT/개발',
  '경영/경제',
  '자기계발',
  '소설',
  '인문/사회',
  '과학/기술',
];

const STATUS_OPTIONS = ['전체', '대여가능', '대여중', '예약가능'];
const SORT_OPTIONS = ['추천순', '평점순', '최신순', '제목순'];

export const BookFilters = ({ onSearch, initialFilter }: BookFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: '전체',
    status: '전체',
    sort: '추천순',
    favorite: false,
    ...(initialFilter || {})
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Update filters when initialFilter changes
  useEffect(() => {
    if (initialFilter) {
      setFilters(initialFilter);
      setTempFilters(initialFilter);
    }
  }, [initialFilter]);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleMobileSearch = () => {
    setFilters(tempFilters);
    onSearch(tempFilters);
    setSearchDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (isMobile) {
      setTempFilters(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSelectChange = (name: keyof FilterState, value: string) => {
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, [name]: value }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const MobileFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter size={16} className="mr-2" />
          필터
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>검색 필터</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">카테고리</label>
            <Select
              value={tempFilters.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">상태</label>
            <Select
              value={tempFilters.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">정렬</label>
            <Select
              value={tempFilters.sort}
              onValueChange={(value) => handleSelectChange('sort', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="정렬 방식 선택" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((sort) => (
                  <SelectItem key={sort} value={sort}>
                    {sort}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mobile-favorite"
              name="favorite"
              checked={tempFilters.favorite}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="mobile-favorite" className="text-sm font-medium">
              관심 도서만 보기
            </label>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleMobileSearch}>적용하기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const MobileSearchModal = () => (
    <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>도서 검색</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="text"
            name="query"
            placeholder="도서명, 저자, 출판사 검색..."
            value={tempFilters.query}
            onChange={handleInputChange}
            className="mt-2"
            autoFocus
          />
          <Button onClick={handleMobileSearch} className="w-full">
            검색
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const DesktopFilters = () => (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="w-28">
        <Select
          value={filters.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-28">
        <Select
          value={filters.status}
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-24">
        <Select
          value={filters.sort}
          onValueChange={(value) => handleSelectChange('sort', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((sort) => (
              <SelectItem key={sort} value={sort}>
                {sort}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="desktop-favorite"
          name="favorite"
          checked={filters.favorite}
          onChange={handleInputChange}
          className="w-4 h-4 rounded border-gray-300"
        />
        <label htmlFor="desktop-favorite" className="text-sm">
          관심 도서만
        </label>
      </div>
      
      <Button onClick={handleSearch} size="sm">검색</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {!isMobile && (
        <div className="flex items-center gap-3">
          <div className="w-[200px] relative">
            <Input
              type="text"
              name="query"
              placeholder="도서명, 저자, 출판사 검색..."
              value={filters.query}
              onChange={handleInputChange}
              className="pr-10"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search size={18} />
            </button>
          </div>
          <DesktopFilters />
        </div>
      )}
      
      {isMobile && (
        <div className="flex justify-between items-center">
          <MobileSearchModal />
          <MobileFilters />
        </div>
      )}
    </div>
  );
};
