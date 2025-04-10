
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

const Announcements = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const isAdmin = hasRole(['admin', 'system_admin']);
  
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
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="공지사항 검색..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
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
            </div>
            
            {/* Announcements List */}
            <div className="space-y-4">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">해당하는 공지사항이 없습니다.</p>
                </div>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <Card 
                    key={announcement.id} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${announcement.isPinned ? 'border-primary-deepblue border-l-4' : ''}`}
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
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
                      <CardTitle className="text-lg mt-2">{announcement.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">
                        {announcement.content}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end pt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        <span>{announcement.views}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Announcements;
