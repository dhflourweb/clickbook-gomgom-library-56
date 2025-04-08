
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Book } from '@/types';
import { SYSTEM_SETTINGS } from '@/data/mockData';
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
import { Calendar } from "@/components/ui/calendar";

interface ExtendBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExtendBookDialog({ book, isOpen, onOpenChange }: ExtendBookDialogProps) {
  const { user } = useAuth();
  const [showExtensionWarning, setShowExtensionWarning] = useState(false);
  
  // Calculate current return date and extended return date
  const currentReturnDate = book.returnDueDate ? new Date(book.returnDueDate) : new Date();
  const extendedReturnDate = addDays(currentReturnDate, SYSTEM_SETTINGS.extensionDays);
  
  const handleExtend = () => {
    // Check if book has already been extended
    if (book.hasBeenExtended) {
      setShowExtensionWarning(true);
      return;
    }
    
    // Process the extension
    toast.success(`'${book.title}' 도서 대여를 연장했습니다.`);
    onOpenChange(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>도서 대여 연장</DialogTitle>
            <DialogDescription>
              대여 기간을 {SYSTEM_SETTINGS.extensionDays}일 연장합니다.
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
              <div className="text-sm font-medium">대여자</div>
              <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium">현재 반납예정일</div>
              <div className="col-span-3 text-sm">{format(currentReturnDate, 'yyyy-MM-dd')}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium">연장 후 반납예정일</div>
              <div className="col-span-3 text-sm">{format(extendedReturnDate, 'yyyy-MM-dd')}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="text-sm font-medium self-start">반납일 변경</div>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={extendedReturnDate}
                  disabled
                  className="rounded border pointer-events-auto"
                />
              </div>
            </div>

            {book.hasBeenExtended && (
              <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
                <p className="font-medium">이 도서는 이미 연장되었습니다</p>
                <p className="mt-1">도서 연장은 최대 {SYSTEM_SETTINGS.maxExtensionCount}회만 가능합니다.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button 
              onClick={handleExtend}
              disabled={book.hasBeenExtended}
            >
              연장하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showExtensionWarning} onOpenChange={setShowExtensionWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>연장 횟수 초과</AlertDialogTitle>
            <AlertDialogDescription>
              도서 연장은 최대 {SYSTEM_SETTINGS.maxExtensionCount}회만 가능합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowExtensionWarning(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
