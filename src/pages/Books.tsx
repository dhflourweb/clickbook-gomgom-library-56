
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookFilters } from '@/components/books/BookFilters';
import { BookGrid } from '@/components/books/BookGrid';
import { getBooksByCategory, MOCK_BOOKS } from '@/data/mockData';
import { Book } from '@/types';
import { toast } from "sonner";

const Books = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  const [filter, setFilter] = useState({
    query: '',
    category: '전체',
    status: '전체',
    sort: '추천순',
    favorite: false,
  });

  // Parse URL query parameters when page loads or URL changes
  useEffect(() => {
    const queryParam = searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || '전체';
    const statusParam = searchParams.get('status') || '전체';
    const sortParam = searchParams.get('sort') || '추천순';
    const favoriteParam = searchParams.get('favorite') === 'true';
    
    // Handle special case when coming from category links
    const filterParam = searchParams.get('filter');
    let finalCategory = categoryParam;
    
    if (filterParam && filterParam.startsWith('category=')) {
      finalCategory = filterParam.split('=')[1];
    }

    const newFilter = {
      query: queryParam,
      category: finalCategory,
      status: statusParam,
      sort: sortParam,
      favorite: favoriteParam
    };
    
    setFilter(newFilter);
    applyFilters(newFilter);
  }, [location.search]);

  const applyFilters = (filters: any) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredBooks = [...MOCK_BOOKS];
      
      // Apply category filter
      if (filters.category !== '전체') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
      }
      
      // Apply status filter
      if (filters.status !== '전체') {
        if (filters.status === '대여가능') {
          filteredBooks = filteredBooks.filter(book => book.status.available > 0);
        } else if (filters.status === '대여중') {
          filteredBooks = filteredBooks.filter(book => book.status.available === 0);
        }
      }
      
      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.publisher.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      if (filters.sort === '추천순') {
        filteredBooks.sort((a, b) => {
          const aHasRecommended = a.badges.includes('recommended');
          const bHasRecommended = b.badges.includes('recommended');
          return bHasRecommended ? 1 : aHasRecommended ? -1 : 0;
        });
      } else if (filters.sort === '평점순') {
        filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sort === '제목순') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      // If favorite filter is on, mark all returned books as favorites
      if (filters.favorite) {
        // For demonstration, we'll just show fewer books but mark them as favorites
        filteredBooks = filteredBooks.slice(0, 3).map(book => ({
          ...book,
          isFavorite: true
        }));
      }
      
      setBooks(filteredBooks);
      setLoading(false);
      
      // Show toast notification with filter results
      toast(`${filteredBooks.length}권의 도서가 검색되었습니다.`);
    }, 300);
  };

  const handleSearch = (newFilter: any) => {
    // Update URL with new search parameters
    const params = new URLSearchParams();
    if (newFilter.query) params.set('query', newFilter.query);
    if (newFilter.category !== '전체') params.set('category', newFilter.category);
    if (newFilter.status !== '전체') params.set('status', newFilter.status);
    if (newFilter.sort !== '추천순') params.set('sort', newFilter.sort);
    if (newFilter.favorite) params.set('favorite', 'true');
    
    setSearchParams(params);
    setFilter(newFilter);
    applyFilters(newFilter);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">전체 도서</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BookFilters onSearch={handleSearch} initialFilter={filter} />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </MainLayout>
  );
};

export default Books;
