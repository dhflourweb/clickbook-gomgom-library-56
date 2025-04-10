
import { format, addDays } from 'date-fns';
import { Book } from '@/types';
import { SYSTEM_SETTINGS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ExtendBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExtendBookDialog({ book, isOpen, onOpenChange }: ExtendBookDialogProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Calculate current return date and extended return date
  const currentReturnDate = book.returnDueDate ? new Date(book.returnDueDate) : new Date();
  const extendedReturnDate = addDays(currentReturnDate, SYSTEM_SETTINGS.extensionDays);
  
  const processExtension = () => {
    // Process the extension
    toast.success(`'${book.title}' 도서 대여를 연장했습니다.`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>도서 대여 연장</DialogTitle>
          <DialogDescription>
            대여 기간을 {SYSTEM_SETTINGS.extensionDays}일 연장합니다.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className={cn("md:pr-4", isMobile ? "max-h-[calc(85vh-140px)]" : "max-h-none")}>
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

            <div className="grid grid-cols-5 gap-2 py-1">
              <div className="col-span-2 text-sm font-medium">대여자</div>
              <div className="col-span-3 text-sm">{user?.name || '로그인 사용자'}</div>
            </div>

            <div className="grid grid-cols-5 gap-2 py-1">
              <div className="col-span-2 text-sm font-medium">현재 반납예정일</div>
              <div className="col-span-3 text-sm">{format(currentReturnDate, 'yyyy-MM-dd')}</div>
            </div>

            <div className="grid grid-cols-5 gap-2 py-1">
              <div className="col-span-2 text-sm font-medium">연장 후 반납예정일</div>
              <div className="col-span-3 text-sm">{format(extendedReturnDate, 'yyyy-MM-dd')}</div>
            </div>

            <div className="flex justify-center pt-3">
              <Calendar
                mode="single"
                selected={extendedReturnDate}
                disabled
                className="mx-auto border rounded pointer-events-none"
              />
            </div>

            <div className="text-center text-[#E6282D] font-medium text-sm pt-2">
              도서 반납일 연장은 최대 1회 가능합니다.
            </div>

            {book.hasBeenExtended && (
              <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
                <p className="font-medium">이 도서는 이미 연장되었습니다</p>
                <p className="mt-1">도서 연장은 최대 {SYSTEM_SETTINGS.maxExtensionCount}회만 가능합니다.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:mt-0">취소</Button>
          <Button 
            onClick={processExtension}
            disabled={book.hasBeenExtended}
          >
            연장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
