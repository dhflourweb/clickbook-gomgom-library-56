
import { useState } from 'react';
import { format } from 'date-fns';
import { Book } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from '@/components/books/StarRating';
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReturnBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReturnBookDialog({ book, isOpen, onOpenChange }: ReturnBookDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [returnLocation, setReturnLocation] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(false);
  
  const today = new Date();
  const returnDate = format(today, 'yyyy-MM-dd');
  
  const handleReturn = () => {
    // Process the return
    toast.success(`'${book.title}' 도서를 반납했습니다.`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>도서 반납</DialogTitle>
          <DialogDescription>
            도서 반납 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 border-b pb-3">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-16 h-20 object-cover rounded-sm"
            />
            <div>
              <h3 className="font-medium text-sm">{book.title}</h3>
              <p className="text-muted-foreground text-xs">{book.author}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <div className="text-sm font-medium">반납자</div>
            <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <div className="text-sm font-medium">반납일자</div>
            <div className="col-span-3 text-sm">{returnDate}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <Label htmlFor="returnLocation" className="text-sm font-medium">반납 위치</Label>
            <div className="col-span-3">
              <Input
                id="returnLocation"
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                placeholder="반납 위치 번호를 입력해주세요."
                className="w-full"
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <Label htmlFor="rating" className="text-sm font-medium">만족도</Label>
            <div className="col-span-3">
              <StarRating 
                value={rating} 
                onChange={setRating} 
                size={20} 
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <Label htmlFor="review" className="text-sm font-medium self-start">후기</Label>
            <div className="col-span-3">
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="이 책에 대한 후기를 남겨주세요."
                className="h-24"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-2">
            <div className="text-sm font-medium">추천</div>
            <div className="col-span-3">
              <Button
                type="button"
                variant={isRecommended ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setIsRecommended(!isRecommended)}
              >
                {isRecommended && <Check className="h-4 w-4" />}
                {isRecommended ? '추천함' : '이 책을 추천하시겠어요?'}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleReturn}>반납하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
