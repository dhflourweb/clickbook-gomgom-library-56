
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INQUIRY_CATEGORIES } from '@/data/communityData';

const InquiryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isPublic: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    
    if (!formData.category) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock saving data - in a real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(
        isEditing ? "문의사항이 수정되었습니다." : "문의사항이 등록되었습니다.",
        { duration: 3000 }
      );
      
      navigate('/inquiries');
    } catch (error) {
      toast.error("문의사항 저장 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/inquiries')}
            className="px-2 hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            문의하기 목록
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? '문의사항 수정' : '문의사항 작성'}
        </h1>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="category" className="block font-medium">카테고리</label>
                  <Select
                    value={formData.category}
                    onValueChange={handleSelectChange('category')}
                  >
                    <SelectTrigger className="w-full md:w-1/3">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="title" className="block font-medium">제목</label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="제목을 입력하세요"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="block font-medium">내용</label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="문의 내용을 입력하세요"
                    className="w-full min-h-[240px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPublic" 
                    checked={formData.isPublic}
                    onCheckedChange={handleCheckboxChange('isPublic')}
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    내 문의를 공개로 설정합니다
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/inquiries')}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      '저장 중...'
                    ) : (
                      isEditing ? '수정하기' : '등록하기'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InquiryForm;
