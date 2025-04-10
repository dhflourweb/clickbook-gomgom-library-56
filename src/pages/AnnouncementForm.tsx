
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Upload, Image, X } from "lucide-react";
import { format } from 'date-fns';
import { getAnnouncementById, ANNOUNCEMENT_CATEGORIES } from '@/data/communityData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
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
import { Card, CardContent } from "@/components/ui/card";

const AnnouncementForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [popupEndDate, setPopupEndDate] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load announcement data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const announcement = getAnnouncementById(id);
      if (announcement) {
        setTitle(announcement.title);
        setContent(announcement.content);
        setCategory(announcement.category);
        setIsPinned(announcement.isPinned);
        setIsPopup(announcement.isPopup);
        if (announcement.popupEndDate) {
          setPopupEndDate(new Date(announcement.popupEndDate));
        }
        setImageUrl(announcement.imageUrl);
        if (announcement.imageUrl) {
          setImagePreview(announcement.imageUrl);
        }
      } else {
        navigate('/announcements');
      }
    }
  }, [id, isEditMode, navigate]);

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return false;
    }
    
    if (title.length > 50) {
      toast.error('제목은 50자 이내로 입력해주세요.');
      return false;
    }
    
    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return false;
    }
    
    if (content.length > 1000) {
      toast.error('내용은 1000자 이내로 입력해주세요.');
      return false;
    }
    
    if (!category) {
      toast.error('카테고리를 선택해주세요.');
      return false;
    }
    
    if (isPopup && !popupEndDate) {
      toast.error('팝업 종료일을 선택해주세요.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast.success(
        isEditMode ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.'
      );
      
      navigate('/announcements');
    }, 800);
  };
  
  const handleCancel = () => {
    // If the form has been modified, show confirm dialog
    if (title || content || category || isPinned || isPopup || popupEndDate || imageUrl) {
      setShowConfirmDialog(true);
    } else {
      navigate('/announcements');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // In a real app, this would upload the file and set the returned URL
      setImageUrl("mock-image-url.jpg");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="px-2 hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            공지사항 목록
          </Button>
        </div>
        
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-8 pb-2 border-b">
              {isEditMode ? '공지사항 수정' : '공지사항 작성'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-base font-medium">제목</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요 (50자 이내)"
                    className="mt-1.5"
                    maxLength={50}
                    required
                  />
                  <div className="text-xs text-right mt-1 text-gray-500">
                    {title.length}/50
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-base font-medium">카테고리</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content" className="text-base font-medium">내용</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요 (1000자 이내)"
                  className="mt-1.5 min-h-[240px] resize-y"
                  required
                />
                <div className="text-xs text-right mt-1 text-gray-500">
                  {content.length}/1000
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium block mb-2">이미지 업로드</Label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center justify-center gap-2 w-full text-base"
                    >
                      <Upload size={18} />
                      파일 선택
                    </Button>
                    
                    {imagePreview && (
                      <div className="relative mt-2">
                        <div className="relative group overflow-hidden rounded-md">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-auto max-h-[180px] object-cover rounded-md" 
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="p-1"
                              onClick={handleRemoveImage}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {imageUrl ? "이미지가 업로드되었습니다" : "미리보기"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <Label htmlFor="isPinned" className="cursor-pointer text-base font-medium">
                        상단 고정
                        <p className="text-xs text-gray-500 font-normal mt-0.5">
                          중요 공지사항을 목록 상단에 고정합니다
                        </p>
                      </Label>
                      <Switch
                        id="isPinned"
                        checked={isPinned}
                        onCheckedChange={setIsPinned}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isPopup" className="cursor-pointer text-base font-medium">
                        팝업 공지
                        <p className="text-xs text-gray-500 font-normal mt-0.5">
                          로그인 후 팝업으로 표시됩니다
                        </p>
                      </Label>
                      <Switch
                        id="isPopup"
                        checked={isPopup}
                        onCheckedChange={setIsPopup}
                      />
                    </div>
                    
                    {isPopup && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Label className="block mb-1.5 text-sm font-medium">팝업 종료일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !popupEndDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {popupEndDate ? format(popupEndDate, "yyyy-MM-dd") : "날짜 선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={popupEndDate}
                              onSelect={setPopupEndDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleCancel}
                  className="px-6"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving} 
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '수정하기' : '등록하기')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작성 취소</AlertDialogTitle>
            <AlertDialogDescription>
              작성 중인 내용이 저장되지 않습니다. 정말로 취소하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 작성하기</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/announcements')}>
              취소하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AnnouncementForm;
