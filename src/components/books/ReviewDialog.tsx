
import { useState } from 'react';
import { Book } from '@/types';
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
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewDialogProps {
  book?: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ book, isOpen, onOpenChange }: ReviewDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!book) return;
    
    // Process the review submission
    toast.success(`'${book.title}' 도서에 리뷰를 등록했습니다.`);
    
    // Reset form
    setRating(0);
    setReview('');
    setIsRecommended(false);
    
    // Close dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>도서 리뷰 작성</DialogTitle>
          <DialogDescription>
            도서에 대한 평점과 리뷰를 남겨주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {book && (
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
          )}
          
          <div>
            <Label htmlFor="rating" className="mb-2 text-sm font-medium">만족도</Label>
            <StarRating
              value={rating}
              onChange={setRating}
              size={24}
            />
          </div>
          <div>
            <Label htmlFor="review" className="mb-2 text-sm font-medium">후기</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="이 책에 대한 후기를 남겨주세요."
              className="h-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recommend"
              checked={isRecommended}
              onCheckedChange={(checked) => 
                setIsRecommended(checked as boolean)
              }
            />
            <Label
              htmlFor="recommend"
              className="text-sm font-medium leading-none"
            >
              이 책을 추천하시겠어요?
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={!rating || !review}
          >
            리뷰 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
