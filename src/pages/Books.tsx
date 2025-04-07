
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BookFilters } from '@/components/books/BookFilters';
import { BookGrid } from '@/components/books/BookGrid';
import { getBooksByCategory, MOCK_BOOKS } from '@/data/mockData';
import { Book } from '@/types';

const Books = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    query: '',
    category: '전체',
    status: '전체',
    sort: '추천순',
    favorite: false,
  });

  useEffect(() => {
    // Parse URL query parameters if needed
    // This would be filled out in a real application
  }, []);

  const handleSearch = (newFilter: any) => {
    setLoading(true);
    setFilter(newFilter);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredBooks = [...MOCK_BOOKS];
      
      // Apply category filter
      if (newFilter.category !== '전체') {
        filteredBooks = filteredBooks.filter(book => book.category === newFilter.category);
      }
      
      // Apply status filter
      if (newFilter.status !== '전체') {
        if (newFilter.status === '대여가능') {
          filteredBooks = filteredBooks.filter(book => book.status.available > 0);
        } else if (newFilter.status === '대여중') {
          filteredBooks = filteredBooks.filter(book => book.status.available === 0);
        }
      }
      
      // Apply search query
      if (newFilter.query) {
        const query = newFilter.query.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.publisher.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      if (newFilter.sort === '추천순') {
        filteredBooks.sort((a, b) => {
          const aHasRecommended = a.badges.includes('recommended');
          const bHasRecommended = b.badges.includes('recommended');
          return bHasRecommended ? 1 : aHasRecommended ? -1 : 0;
        });
      } else if (newFilter.sort === '평점순') {
        filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (newFilter.sort === '제목순') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      // Apply favorite filter (for demonstration, we'll just show fewer books)
      if (newFilter.favorite) {
        filteredBooks = filteredBooks.slice(0, 3);
      }
      
      setBooks(filteredBooks);
      setLoading(false);
    }, 300);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">전체 도서</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <BookFilters onSearch={handleSearch} />
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
