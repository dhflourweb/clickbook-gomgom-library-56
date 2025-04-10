
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowLeft, Trash2, PenLine, AlertCircle } from "lucide-react";
import { getAnnouncementById } from '@/data/communityData';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAdmin = hasRole(['admin', 'system_admin']);
  
  const announcement = id ? getAnnouncementById(id) : null;
  
  useEffect(() => {
    if (!announcement) {
      navigate('/announcements');
    }
  }, [announcement, navigate]);
  
  if (!announcement) {
    return null;
  }
  
  const handleDelete = () => {
    setIsDeleting(true);
    
    // Simulate API call for deletion
    setTimeout(() => {
      setIsDeleting(false);
      toast.success('공지사항이 삭제되었습니다.');
      navigate('/announcements');
    }, 800);
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/announcements')}
            className="px-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            공지사항 목록
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="outline" className="bg-gray-100">
                  {announcement.category}
                </Badge>
                {announcement.isPinned && (
                  <Badge variant="secondary" className="bg-primary-deepblue text-white">
                    상단 고정
                  </Badge>
                )}
                {announcement.isPopup && (
                  <Badge variant="secondary" className="bg-secondary-orange text-white">
                    팝업 공지
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl font-bold">{announcement.title}</h1>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/announcements/${id}/edit`)}
                >
                  <PenLine size={16} className="mr-1" />
                  수정
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 border-y border-gray-100 py-3 mb-6">
            <div className="flex items-center gap-4">
              <span>작성자: {announcement.createdBy}</span>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{format(new Date(announcement.createdAt), 'yyyy.MM.dd')}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{announcement.views}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            {/* If there's an image, display it */}
            {announcement.imageUrl && (
              <img 
                src={announcement.imageUrl} 
                alt={announcement.title}
                className="w-full max-h-[400px] object-cover rounded-md mb-6"
              />
            )}
            
            <p className="whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 공지사항을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AnnouncementDetail;
