
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Book } from '@/types';
import { SYSTEM_SETTINGS, hasReachedBorrowLimit } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from "@/components/ui/calendar";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface BorrowBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BorrowBookDialog({ book, isOpen, onOpenChange }: BorrowBookDialogProps) {
  const { user } = useAuth();
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const isMobile = useIsMobile();
  
  const today = new Date();
  const borrowDate = today;
  const returnDueDate = addDays(today, SYSTEM_SETTINGS.borrowDays);
  
  const handleBorrow = () => {
    if (!user) return;
    
    // Check if user has reached borrow limit
    if (hasReachedBorrowLimit(user.id)) {
      setShowLimitWarning(true);
      return;
    }
    
    // Process the borrow
    toast.success(`'${book.title}' 도서를 대여했습니다.`);
    onOpenChange(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className={isMobile ? "w-[90%] max-h-[90vh] overflow-y-auto p-4 sm:max-w-[400px]" : "sm:max-w-[425px]"}>
          <DialogHeader>
            <DialogTitle>도서 대여</DialogTitle>
            <DialogDescription>
              다음 정보를 확인하고 도서를 대여해 주세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-3">
            <div className="flex items-center gap-3 border-b pb-3">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-14 h-18 object-cover rounded-sm"
              />
              <div>
                <h3 className="font-medium text-sm">{book.title}</h3>
                <p className="text-muted-foreground text-xs">{book.author}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium">대여자</div>
              <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium">대여일자</div>
              <div className="col-span-3 text-sm">{format(borrowDate, 'yyyy-MM-dd')}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium whitespace-nowrap self-start">반납예정일</div>
              <div className="col-span-3">
                <div className="text-sm mb-2 whitespace-nowrap">{format(returnDueDate, 'yyyy-MM-dd')}</div>
                <div className={isMobile ? "scale-90 origin-top-left" : ""}>
                  <Calendar
                    mode="single"
                    selected={returnDueDate}
                    disabled
                    className="rounded border"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button onClick={handleBorrow}>대여하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLimitWarning} onOpenChange={setShowLimitWarning}>
        <AlertDialogContent className={isMobile ? "max-w-[90%]" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>대여 한도 초과</AlertDialogTitle>
            <AlertDialogDescription>
              최대 {SYSTEM_SETTINGS.maxBorrowLimit}권까지 대여할 수 있습니다!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLimitWarning(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
