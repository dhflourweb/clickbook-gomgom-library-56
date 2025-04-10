
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, ArrowLeft, Trash2, PenLine, Lock, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { getInquiryById } from '@/data/communityData';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
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

const InquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [answerContent, setAnswerContent] = useState('');
  const [isPublicAnswer, setIsPublicAnswer] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isAdmin = hasRole(['admin', 'system_admin']);
  
  const inquiry = id ? getInquiryById(id, user?.id) : null;
  
  useEffect(() => {
    if (!inquiry) {
      navigate('/inquiries');
    }
  }, [inquiry, navigate]);
  
  if (!inquiry) {
    return null;
  }
  
  const canEdit = inquiry.createdBy === user?.id && inquiry.status !== 'answered';
  const canDelete = inquiry.createdBy === user?.id && inquiry.status !== 'answered';
  const canAnswer = isAdmin && inquiry.status !== 'answered';
  
  const handleDelete = () => {
    // In a real app, this would delete the inquiry
    toast({
      title: "문의사항이 삭제되었습니다.",
      description: "문의사항이 성공적으로 삭제되었습니다.",
    });
    navigate('/inquiries');
  };
  
  const handleAnswerSubmit = () => {
    if (!answerContent.trim()) {
      toast({
        title: "답변 내용을 입력해주세요",
        description: "답변 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit the answer
    toast({
      title: "답변이 등록되었습니다.",
      description: "문의사항에 대한 답변이 성공적으로 등록되었습니다.",
    });
    
    // Simulate a page refresh
    navigate('/inquiries');
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/inquiries')}
            className="px-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            문의하기 목록
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
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
              
              <h1 className="text-2xl font-bold">{inquiry.title}</h1>
            </div>
            
            <div className="flex gap-2">
              {canEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/inquiries/${id}/edit`)}
                >
                  <PenLine size={16} className="mr-1" />
                  수정
                </Button>
              )}
              {canDelete && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 border-y border-gray-100 py-3 mb-6">
            <div className="flex items-center gap-4">
              <span>작성자: {inquiry.createdBy === user?.id ? '나' : inquiry.createdBy}</span>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{format(new Date(inquiry.createdAt), 'yyyy.MM.dd')}</span>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{inquiry.content}</p>
          </div>
          
          {/* Answer section */}
          {inquiry.answer && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary text-white">
                  답변
                </Badge>
                <span className="text-sm text-gray-500">
                  {format(new Date(inquiry.answer.createdAt), 'yyyy.MM.dd')}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap">{inquiry.answer.content}</p>
                <p className="text-sm text-gray-500 mt-4">답변자: {inquiry.answer.createdBy}</p>
              </div>
            </div>
          )}
          
          {/* Admin answer form */}
          {canAnswer && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-medium mb-4">답변 작성</h3>
              
              <Textarea
                placeholder="답변 내용을 입력하세요."
                className="min-h-[150px] mb-4"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
              />
              
              <div className="flex items-center gap-2 mb-4">
                <Checkbox 
                  id="public-answer" 
                  checked={isPublicAnswer} 
                  onCheckedChange={(checked) => setIsPublicAnswer(!!checked)} 
                />
                <label htmlFor="public-answer" className="text-sm cursor-pointer">
                  이 답변을 공개로 설정합니다
                </label>
              </div>
              
              <Button onClick={handleAnswerSubmit}>
                답변 등록
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>문의사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 문의사항을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default InquiryDetail;
