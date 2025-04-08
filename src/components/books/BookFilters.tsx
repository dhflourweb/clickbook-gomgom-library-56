import { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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

import { useIsMobile } from '@/hooks/use-mobile';

interface BookFiltersProps {
  onSearch: (filters: FilterState) => void;
  initialFilter?: FilterState;
  onItemsPerPageChange: (value: number) => void;
  itemsPerPage: number;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  viewMode?: 'grid' | 'list';
}

interface FilterState {
  query: string;
  category: string;
  status: string;
  sort: string;
  favorite: boolean;
}

const CATEGORIES = ["전체", "문학", "경제/경영", "자기개발", "인문/역사", "사회", "취미/생활", "기타"];

const STATUS_OPTIONS = ['전체', '대여가능', '대여중', '예약중'];
const SORT_OPTIONS = ['인기도순', '최신등록순', '평점순', '이름순', '추천순', '베스트도서순'];
const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 100];

export const BookFilters = ({ 
  onSearch, 
  initialFilter, 
  onItemsPerPageChange,
  itemsPerPage,
  onViewModeChange,
  viewMode = 'grid'
}: BookFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: '전체',
    status: '전체',
    sort: '인기도순',
    favorite: false,
    ...(initialFilter || {})
  });

  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (initialFilter) {
      setFilters(initialFilter);
      setTempFilters(initialFilter);
    }
  }, [initialFilter]);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMobileSearch = () => {
    setFilters(tempFilters);
    onSearch(tempFilters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    if (isMobile) {
      setTempFilters(prev => ({
        ...prev,
        [name]: newValue,
      }));
      
      if (type === 'checkbox') {
        const updatedTempFilters = {
          ...tempFilters,
          [name]: newValue,
        };
        setTempFilters(updatedTempFilters);
        onSearch(updatedTempFilters);
      }
    } else {
      const updatedFilters = {
        ...filters,
        [name]: newValue,
      };
      setFilters(updatedFilters);
      
      if (type === 'checkbox') {
        onSearch(updatedFilters);
      }
    }
  };

  const handleSelectChange = (name: keyof FilterState, value: string) => {
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, [name]: value }));
    } else {
      const updatedFilters = { ...filters, [name]: value };
      setFilters(updatedFilters);
      
      onSearch(updatedFilters);
    }
  };

  const handleViewModeToggle = (mode: 'grid' | 'list') => {
    if (isMobile) return;
    
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const handleFavoriteToggle = (checked: boolean) => {
    const updatedFilters = { ...filters, favorite: checked };
    setFilters(updatedFilters);
    onSearch(updatedFilters);
  };

  const MobileFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter size={16} className="mr-2" />
          필터
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] overflow-y-auto">
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
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleMobileSearch}>적용하기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const MobileExtraControls = () => (
    <div className="flex flex-col gap-3 mt-3 border-t pt-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">표시 개수</label>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-24 h-9">
            <SelectValue placeholder="개수" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count}개
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <label className="text-sm font-medium" htmlFor="mobile-favorite-toggle">관심 도서만</label>
        <Switch 
          id="mobile-favorite-toggle"
          checked={filters.favorite}
          onCheckedChange={handleFavoriteToggle}
        />
      </div>
    </div>
  );

  const DesktopFilters = () => (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="w-28">
        <Select
          value={filters.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="h-10">
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
          <SelectTrigger className="h-10">
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
      
      <div className="w-36">
        <Select
          value={filters.sort}
          onValueChange={(value) => handleSelectChange('sort', value)}
        >
          <SelectTrigger className="h-10">
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

      <div className="w-28">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="표시 개수" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count}개
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 mr-2">
        <Checkbox
          id="desktop-favorite"
          checked={filters.favorite}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            const updatedFilters = {...filters, favorite: isChecked};
            setFilters(updatedFilters);
            onSearch(updatedFilters);
          }}
        />
        <label htmlFor="desktop-favorite" className="text-sm whitespace-nowrap">
          관심 도서만
        </label>
      </div>
      
      {onViewModeChange && !isMobile && (
        <div className="flex gap-1 ml-auto">
          <Button 
            size="sm" 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => handleViewModeToggle('grid')}
            className="px-2"
          >
            <LayoutGrid size={16} />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => handleViewModeToggle('list')}
            className="px-2"
          >
            <LayoutList size={16} />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {!isMobile && (
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-80 relative shrink-0">
            <Input
              type="text"
              name="query"
              placeholder="도서명, 저자, 출판사 검색..."
              value={filters.query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pr-10 h-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <DesktopFilters />
        </div>
      )}
      
      {isMobile && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                name="query"
                placeholder="도서 검색..."
                value={filters.query}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMobileSearch();
                }}
                className="pr-10 h-10"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
                onClick={handleMobileSearch}
              >
                <Search size={18} />
              </Button>
            </div>
            <MobileFilters />
          </div>
          <MobileExtraControls />
        </>
      )}
    </div>
  );
};
