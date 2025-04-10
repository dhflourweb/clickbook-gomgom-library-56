import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageCircle, Search, Lock, CheckCircle2, Clock } from "lucide-react";
import { getInquiries, getInquiriesByAdmin, INQUIRY_CATEGORIES } from '@/data/communityData';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Inquiries = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tabFilter, setTabFilter] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const isAdmin = hasRole(['admin', 'system_admin']);
  
  // Get inquiries based on user role
  const inquiries = isAdmin ? getInquiriesByAdmin() : getInquiries(user?.id);
  
  // Filter inquiries based on search term, category, and status (tab)
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = searchTerm === '' || 
      inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || inquiry.category === categoryFilter;
    const matchesStatus = tabFilter === 'all' || 
      (tabFilter === 'pending' && inquiry.status === 'pending') ||
      (tabFilter === 'answered' && inquiry.status === 'answered');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const itemsPerPage = parseInt(displayCount);
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">문의하기</h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin ? '회원들의 문의사항을 관리하세요' : '궁금한 점이나 요청사항을 문의하세요'}
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/inquiries/new')} 
            className="mt-4 md:mt-0"
          >
            문의하기
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4">
            <Tabs 
              defaultValue="all" 
              value={tabFilter} 
              onValueChange={setTabFilter}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="pending">답변 대기</TabsTrigger>
                <TabsTrigger value="answered">답변 완료</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="문의사항 검색..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-1 gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    {INQUIRY_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={displayCount}
                  onValueChange={(value) => {
                    setDisplayCount(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="표시개수" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10개</SelectItem>
                    <SelectItem value="30">30개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <div className="space-y-3">
              {paginatedInquiries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isAdmin ? '해당하는 문의사항이 없습니다.' : '문의 내역이 없습니다. 새로운 문의를 작성해보세요.'}
                  </p>
                </div>
              ) : (
                paginatedInquiries.map((inquiry) => (
                  <Card 
                    key={inquiry.id} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      inquiry.status === 'pending' ? 'border-secondary-orange border-l-4' : ''
                    }`}
                    onClick={() => navigate(`/inquiries/${inquiry.id}`)}
                  >
                    <CardHeader className="pb-2 px-4 pt-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gray-100">
                            {inquiry.category}
                          </Badge>
                          <Badge 
                            variant={inquiry.status === 'pending' ? 'outline' : 'secondary'}
                            className={inquiry.status === 'pending' ? 
                              'border-secondary-orange text-secondary-orange' : 
                              'bg-primary text-white'
                            }
                          >
                            {inquiry.status === 'pending' ? (
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                답변 대기
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <CheckCircle2 size={12} className="mr-1" />
                                답변 완료
                              </div>
                            )}
                          </Badge>
                          {!inquiry.isPublic && (
                            <Badge variant="secondary" className="bg-gray-700 text-white">
                              <div className="flex items-center">
                                <Lock size={12} className="mr-1" />
                                비공개
                              </div>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>{format(new Date(inquiry.createdAt), 'yyyy.MM.dd')}</span>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-1">{inquiry.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="px-4 py-1">
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {inquiry.content}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-1 pb-2 px-4 text-sm text-gray-500">
                      <span>{isAdmin ? `작성자: ${inquiry.createdBy}` : ''}</span>
                      <div className="flex items-center">
                        {inquiry.status === 'answered' && (
                          <>
                            <MessageCircle size={14} className="mr-1" />
                            <span>1개 답변</span>
                          </>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            isActive={currentPage === totalPages}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inquiries;
