
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getBookById, getReviewsForBook } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/books/StarRating';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [locationInput, setLocationInput] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  
  if (!id) {
    navigate('/books');
    return null;
  }
  
  const book = getBookById(id);
  
  if (!book) {
    navigate('/books');
    return null;
  }

  const reviews = getReviewsForBook(id);
  const isAvailable = book.status.available > 0;
  
  const handleBorrow = () => {
    // In a real app, this would call an API to borrow the book
    toast({
      title: "도서 대여 신청 완료",
      description: `'${book.title}' 도서를 대여했습니다. 지정된 위치에서 수령해주세요.`,
    });
  };

  const handleReturn = () => {
    if (!locationInput.trim()) {
      toast({
        title: "오류",
        description: "도서 위치를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to return the book
    toast({
      title: "도서 반납 완료",
      description: `'${book.title}' 도서가 성공적으로 반납되었습니다.`,
    });
  };

  const handleReserve = () => {
    // In a real app, this would call an API to reserve the book
    toast({
      title: "도서 예약 신청 완료",
      description: `'${book.title}' 도서 예약이 완료되었습니다. 대여 가능 시 알림을 드립니다.`,
    });
  };
  
  const handleExtend = () => {
    // In a real app, this would call an API to extend the book
    toast({
      title: "대여 기간 연장 완료",
      description: `'${book.title}' 도서의 대여 기간이 7일 연장되었습니다.`,
    });
  };
  
  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      toast({
        title: "오류",
        description: "리뷰 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to submit the review
    toast({
      title: "리뷰 등록 완료",
      description: "도서 리뷰가 성공적으로 등록되었습니다.",
    });
    
    setReviewContent('');
    setRating(5);
  };

  // Mock functions to simulate user permissions
  const canBorrow = isAvailable && user?.borrowedBooks !== undefined && user.borrowedBooks < 2;
  const canReserve = !isAvailable && user?.reservedBooks !== undefined && user.reservedBooks < 1;
  const canReturn = true; // Mock: In real app, check if user has borrowed this book
  const canExtend = true; // Mock: In real app, check if book is borrowed and hasn't been extended

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Book cover */}
            <div className="md:w-1/3 p-6">
              <img
                src={book.coverImage}
                alt={`${book.title} 표지`}
                className="w-full aspect-[3/4] object-cover rounded-md shadow-md"
              />
            </div>
            
            {/* Book details */}
            <div className="md:w-2/3 p-6">
              <div className="mb-4">
                <BadgeDisplay badges={book.badges} size="md" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700"><span className="font-semibold">저자:</span> {book.author}</p>
                <p className="text-gray-700"><span className="font-semibold">출판사:</span> {book.publisher}</p>
                <p className="text-gray-700"><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                <p className="text-gray-700"><span className="font-semibold">카테고리:</span> {book.category}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">대여 상태:</span> 
                  <span className={`ml-1 ${isAvailable ? 'text-secondary-green' : 'text-point-red'}`}>
                    {isAvailable ? `대여 가능 (${book.status.available}/${book.status.total})` : '대여중'}
                  </span>
                </p>
                <p className="text-gray-700"><span className="font-semibold">위치:</span> {book.location}</p>
              </div>
              
              {book.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">도서 소개</h2>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-6">
                {canBorrow && (
                  <Button onClick={handleBorrow} className="bg-secondary-green hover:bg-secondary-green/90">
                    대여하기
                  </Button>
                )}
                
                {canReserve && (
                  <Button onClick={handleReserve} className="bg-secondary-blue hover:bg-secondary-blue/90">
                    예약하기
                  </Button>
                )}
                
                {canReturn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-point-red text-point-red hover:bg-point-red/10">
                        반납하기
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>도서 반납</DialogTitle>
                        <DialogDescription>
                          반납 위치를 명확히 입력해 주세요. 다른 사용자가 쉽게 찾을 수 있도록 상세하게 작성해주세요.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">반납 위치</Label>
                          <Input
                            id="location"
                            placeholder="예: 3층 개발서적 책장 A-5"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="mr-2">
                          취소
                        </Button>
                        <Button onClick={handleReturn} className="bg-point-red hover:bg-point-red/90">
                          반납 완료
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {canExtend && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">연장하기</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>대여 기간 연장</AlertDialogTitle>
                        <AlertDialogDescription>
                          도서 대여 기간을 7일 연장합니다. 연장은 1회만 가능합니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExtend}>
                          연장하기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">도서 리뷰</h2>
          
          {/* Review form */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium mb-2">리뷰 작성</h3>
            <div className="mb-4">
              <Label htmlFor="rating">평점</Label>
              <div className="mt-1">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  max={5}
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="review">리뷰 내용</Label>
              <Textarea
                id="review"
                placeholder="이 책에 대한 의견을 남겨주세요."
                className="mt-1"
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmitReview}>
              리뷰 등록
            </Button>
          </div>
          
          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 작성된 리뷰가 없습니다.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="font-medium">{review.userName}</div>
                    <div className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</div>
                    <div className="ml-auto text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetail;
