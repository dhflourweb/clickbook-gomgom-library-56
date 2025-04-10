
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Book } from '@/types';
import { SYSTEM_SETTINGS, hasReachedBorrowLimit } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from "@/components/ui/calendar";
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";
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
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
      // Close the dialog first, then show the warning
      onOpenChange(false);
      setTimeout(() => {
        setShowLimitWarning(true);
      }, 100);
      return;
    }
    
    // Process the borrow
    toast.success(`'${book.title}' 도서를 대여했습니다.`);
    onOpenChange(false);
  };
  
  const handleAlertClose = () => {
    setShowLimitWarning(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-[500px] max-h-[85vh]", isMobile ? "" : "h-auto min-h-[450px]")}>
          <DialogHeader>
            <DialogTitle>도서 대여</DialogTitle>
            <DialogDescription>
              다음 정보를 확인하고 도서를 대여해 주세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className={cn(isMobile ? "max-h-[calc(70vh-140px)]" : "")}>
            {isMobile ? (
              <ScrollArea className="pr-4" type="always">
                <div className="grid gap-3">
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

                  <div className="grid grid-cols-5 gap-2 py-1">
                    <div className="col-span-2 text-sm font-medium">대여자</div>
                    <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 py-1">
                    <div className="col-span-2 text-sm font-medium">대여일자</div>
                    <div className="col-span-3 text-sm">{format(borrowDate, 'yyyy-MM-dd')}</div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 py-1">
                    <div className="col-span-2 text-sm font-medium">반납 예정일</div>
                    <div className="col-span-3 text-sm whitespace-nowrap">{format(returnDueDate, 'yyyy-MM-dd')}</div>
                  </div>
                  
                  <div className="flex justify-center pt-3 pb-2">
                    <Calendar
                      mode="single"
                      selected={returnDueDate}
                      disabled
                      className="mx-auto border rounded pointer-events-none"
                    />
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="grid gap-3">
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

                <div className="grid grid-cols-5 gap-2 py-1">
                  <div className="col-span-2 text-sm font-medium">대여자</div>
                  <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
                </div>

                <div className="grid grid-cols-5 gap-2 py-1">
                  <div className="col-span-2 text-sm font-medium">대여일자</div>
                  <div className="col-span-3 text-sm">{format(borrowDate, 'yyyy-MM-dd')}</div>
                </div>

                <div className="grid grid-cols-5 gap-2 py-1">
                  <div className="col-span-2 text-sm font-medium">반납 예정일</div>
                  <div className="col-span-3 text-sm whitespace-nowrap">{format(returnDueDate, 'yyyy-MM-dd')}</div>
                </div>
                
                <div className="flex justify-center pt-3 pb-2">
                  <Calendar
                    mode="single"
                    selected={returnDueDate}
                    disabled
                    className="mx-auto border rounded pointer-events-none"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button onClick={handleBorrow}>대여하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLimitWarning} onOpenChange={setShowLimitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>대여 한도 초과</AlertDialogTitle>
            <AlertDialogDescription>
              최대 {SYSTEM_SETTINGS.maxBorrowLimit}권까지 대여할 수 있습니다!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogAction onClick={handleAlertClose}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
