
import { useState, useRef } from 'react';
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
  const [locationError, setLocationError] = useState<boolean>(false);

  const dummyRef = useRef<HTMLButtonElement | null>(null); // ✅ 더미 ref
  
  const today = new Date();
  const returnDate = format(today, 'yyyy-MM-dd');
  
  const handleReturn = () => {
    // Validate return location is provided
    if (!returnLocation.trim()) {
      setLocationError(true);
      return;
    }
    
    // Process the return
    toast.success(`'${book.title}' 도서를 반납했습니다.`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
          {...{ initialFocusRef: dummyRef }} // ✅ 타입 무시 트릭
          className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto"
      >
        {/* ✅ 숨겨진 포커스 요소 */}
        <button
            ref={dummyRef}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              height: 0,
              width: 0,
            }}
            aria-hidden
        />
        <DialogHeader>
          <DialogTitle>도서 반납</DialogTitle>
          <DialogDescription>
            도서 반납 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-3">
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

          <div className="grid grid-cols-4 gap-2 py-1">
            <div className="text-sm font-medium">반납자</div>
            <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
            <div className="text-sm font-medium">반납일자</div>
            <div className="col-span-3 text-sm">{returnDate}</div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
            <Label htmlFor="returnLocation" className="text-sm font-medium flex items-center gap-1">
              반납 위치
              <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="returnLocation"
                value={returnLocation}
                onChange={(e) => {
                  setReturnLocation(e.target.value);
                  if (e.target.value.trim()) setLocationError(false);
                }}
                placeholder="반납 위치 번호를 입력해주세요."
                className={`w-full ${locationError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                type="text"
                autoFocus={false}
                required
              />
              {locationError && (
                <p className="text-red-500 text-xs mt-1">반납 위치를 입력해주세요.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
            <Label htmlFor="rating" className="text-sm font-medium">만족도</Label>
            <div className="col-span-3">
              <StarRating 
                value={rating} 
                onChange={setRating} 
                size={20} 
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
            <Label htmlFor="review" className="text-sm font-medium self-start">후기</Label>
            <div className="col-span-3">
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="이 책에 대한 후기를 남겨주세요."
                className="h-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 py-1">
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

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:mt-0">취소</Button>
          <Button onClick={handleReturn}>반납하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
