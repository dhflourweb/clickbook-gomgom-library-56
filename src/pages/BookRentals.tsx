
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MOCK_BOOKS } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookRental {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  rentedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'rented' | 'returned' | 'overdue';
}

// Mock rental data
const generateMockRentals = (): BookRental[] => {
  return MOCK_BOOKS.slice(0, 10).map((book, index) => {
    const isReturned = index % 3 === 0;
    const isOverdue = !isReturned && index % 4 === 0;
    
    // Generate random rental dates
    const today = new Date();
    const rentedDate = new Date(today);
    rentedDate.setDate(rentedDate.getDate() - (Math.floor(Math.random() * 30) + 1));
    
    const dueDate = new Date(rentedDate);
    dueDate.setDate(dueDate.getDate() + 14);
    
    const returnedDate = isReturned ? 
      new Date(rentedDate.getTime() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000) : 
      undefined;
    
    let status: 'rented' | 'returned' | 'overdue' = 'rented';
    if (isReturned) status = 'returned';
    else if (isOverdue) status = 'overdue';
    
    return {
      id: `rental-${book.id}`,
      bookId: book.id,
      bookTitle: book.title,
      userId: `user-${index}`,
      userName: `사용자 ${index + 1}`,
      rentedAt: rentedDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnedAt: returnedDate?.toISOString().split('T')[0],
      status
    };
  });
};

const BookRentals = () => {
  const [rentals, setRentals] = useState<BookRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRentals = generateMockRentals();
      setRentals(mockRentals);
      setLoading(false);
    }, 500);
  }, []);

  // Filter rentals based on search query and status filter
  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = searchQuery === '' || 
      rental.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      rental.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'rented':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs';
      case 'returned':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs';
      case 'overdue':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs';
    }
  };

  // Get status text in Korean
  const getStatusText = (status: string) => {
    switch(status) {
      case 'rented': return '대여중';
      case 'returned': return '반납완료';
      case 'overdue': return '연체';
      default: return status;
    }
  };

  // Mobile card view for book rentals
  const MobileRentalCard = ({ rental }: { rental: BookRental }) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{rental.bookTitle}</h3>
            <span className={getStatusBadge(rental.status)}>
              {getStatusText(rental.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500">대여자: {rental.userName}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>대여일: {rental.rentedAt}</span>
            <span>반납예정일: {rental.dueDate}</span>
          </div>
          {rental.returnedAt && (
            <p className="text-xs text-gray-500">반납일: {rental.returnedAt}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">도서대여현황</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Input 
                type="text" 
                placeholder="도서명 또는 대여자 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
            </div>
            
            {/* Status filter buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                전체
              </Button>
              <Button 
                variant={statusFilter === 'rented' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('rented')}
              >
                대여중
              </Button>
              <Button 
                variant={statusFilter === 'returned' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('returned')}
              >
                반납완료
              </Button>
              <Button 
                variant={statusFilter === 'overdue' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('overdue')}
              >
                연체
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="py-8">
              <p className="text-center text-gray-500">로딩 중...</p>
            </div>
          ) : (
            <>
              {filteredRentals.length === 0 ? (
                <div className="py-8">
                  <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
                </div>
              ) : (
                <>
                  {/* Mobile view: Cards */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {filteredRentals.map(rental => (
                        <MobileRentalCard key={rental.id} rental={rental} />
                      ))}
                    </div>
                  ) : (
                    /* Desktop view: Table */
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>도서명</TableHead>
                            <TableHead>대여자</TableHead>
                            <TableHead>대여일</TableHead>
                            <TableHead>반납예정일</TableHead>
                            <TableHead>반납일</TableHead>
                            <TableHead>상태</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRentals.map(rental => (
                            <TableRow key={rental.id}>
                              <TableCell className="font-medium">{rental.bookTitle}</TableCell>
                              <TableCell>{rental.userName}</TableCell>
                              <TableCell>{rental.rentedAt}</TableCell>
                              <TableCell>{rental.dueDate}</TableCell>
                              <TableCell>{rental.returnedAt || '-'}</TableCell>
                              <TableCell>
                                <span className={getStatusBadge(rental.status)}>
                                  {getStatusText(rental.status)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookRentals;
