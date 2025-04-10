
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PinIcon, Calendar, Eye, Search } from "lucide-react";
import { getAnnouncements, ANNOUNCEMENT_CATEGORIES } from '@/data/communityData';
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

const Announcements = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const isAdmin = hasRole("ADM");
  
  // Get announcements
  const announcements = getAnnouncements();
  
  // Filter announcements based on search term and category
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = searchTerm === '' || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Separate pinned and unpinned announcements
  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const unpinnedAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);
  
  // Pagination logic
  const itemsPerPage = parseInt(displayCount);
  const totalPages = Math.ceil(unpinnedAnnouncements.length / itemsPerPage);
  
  const paginatedAnnouncements = unpinnedAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Display announcements: pinned first, then paginated unpinned
  const displayedAnnouncements = [...pinnedAnnouncements, ...paginatedAnnouncements];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">공지사항</h1>
            <p className="text-muted-foreground mt-1">중요 소식과 안내사항을 확인하세요</p>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/announcements/new')} 
              className="mt-4 md:mt-0"
            >
              공지사항 작성
            </Button>
          )}
        </div>
        
        {/* Filter Section - Completely separated */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="공지사항 검색..."
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
                    {ANNOUNCEMENT_CATEGORIES.map((category) => (
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
                    setCurrentPage(1); // Reset to first page when changing display count
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
          
        {/* Content Section - Completely separated */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <div className="space-y-3">
              {displayedAnnouncements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">해당하는 공지사항이 없습니다.</p>
                </div>
              ) : (
                displayedAnnouncements.map((announcement) => (
                  <Card 
                    key={announcement.id} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${announcement.isPinned ? 'border-primary-deepblue border-l-4' : ''}`}
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                  >
                    <CardHeader className="pb-2 px-4 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gray-100">
                            {announcement.category}
                          </Badge>
                          {announcement.isPinned && (
                            <PinIcon size={16} className="text-primary-deepblue" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>{format(new Date(announcement.createdAt), 'yyyy.MM.dd')}</span>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-1">{announcement.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="px-4 py-1">
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {announcement.content}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end pt-1 pb-2 px-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        <span>{announcement.views}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {/* Pagination */}
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
                      // Simple pagination logic for up to 5 pages
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

export default Announcements;
