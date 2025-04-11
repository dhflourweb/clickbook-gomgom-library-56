import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BadgeDisplay } from '@/components/ui/badge-display';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { getBookById, getReviewsForBook } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/books/StarRating';
import { BorrowBookDialog } from '@/components/books/BorrowBookDialog';
import { ReturnBookDialog } from '@/components/books/ReturnBookDialog';
import { ExtendBookDialog } from '@/components/books/ExtendBookDialog';
import { cn } from '@/lib/utils';
import { Heart, Calendar, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  
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
  
  const shelfLocation = `${parseInt(book.id.replace(/\D/g, ''), 10) % 10 + 1}`;
  
  const handleBorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setBorrowDialogOpen(true);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setReturnDialogOpen(true);
  };

  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsReserved(!isReserved);
    
    toast({
      title: isReserved ? "도서 예약 취소 완료" : "도서 예약 신청 완료",
      description: isReserved 
        ? `'${book.title}' 도서 예약이 취소되었습니다.` 
        : `'${book.title}' 도서 예약이 완료되었습니다. 대여 가능 시 알림을 드립니다.`,
    });
  };
  
  const handleExtend = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExtendDialogOpen(true);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "관심 도서 제거" : "관심 도서 등록",
      description: isFavorite 
        ? `'${book.title}' 도서가 관심 목록에서 제거되었습니다.` 
        : `'${book.title}' 도서가 관심 목록에 추가되었습니다.`,
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
    
    toast({
      title: "리뷰 등록 완료",
      description: "도서 리뷰가 성공적으로 등록되었습니다.",
    });
    
    setReviewContent('');
    setRating(5);
  };

  const canBorrow = isAvailable && user?.borrowedCount < 2;
  const canReserve = !isAvailable && book.isReservable !== false;
  const isBorrowedByUser = book.borrowedByCurrentUser || false;
  const hasReachedBorrowLimit = user?.borrowedCount >= 2;

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  const getStatusClass = () => {
    if (isAvailable) return "bg-primary-deepblue";
    if (isReserved || book.isReservable === false) return "bg-secondary-orange";
    return "bg-point-red";
  };

  const renderActionButtons = () => {
    if (isAvailable) {
      return (
        <Button 
          variant="default" 
          onClick={handleBorrow} 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={hasReachedBorrowLimit}
        >
          대여하기
        </Button>
      );
    }
    
    if (isBorrowedByUser) {
      return (
        <div className="w-full flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={handleReturn} 
            className="w-full border-secondary-orange text-secondary-orange hover:bg-secondary-orange/10"
          >
            반납하기
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExtend} 
            className="w-full border-primary text-primary hover:bg-primary/10"
            disabled={!book.isExtendable}
          >
            연장하기
          </Button>
        </div>
      );
    }
    
    if (book.isReservable === false) {
      return (
        <Button 
          variant="secondary"
          className="w-full bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"
          disabled={true}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          예약불가
        </Button>
      );
    }
    
    return (
      <Button 
        variant={isReserved ? "outline" : "secondary"}
        onClick={handleReserve}
        className={cn(
          "w-full",
          isReserved 
            ? "border-primary text-primary hover:bg-primary/10" 
            : "bg-secondary hover:bg-secondary/90"
        )}
      >
        {isReserved ? "예약 취소" : "예약하기"}
      </Button>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 flex flex-col items-center border-r border-gray-100 md:min-h-[600px]">
              <div className="relative w-full max-w-[250px]">
                <img
                  src={book.coverImage}
                  alt={`${book.title} 표지`}
                  className="w-full aspect-[3/4] object-cover rounded-md shadow-md mb-6"
                />
                <button
                  className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                    isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-white/90 hover:bg-gray-100'
                  }`}
                  onClick={handleFavoriteToggle}
                  aria-label={isFavorite ? '관심 도서 제거' : '관심 도서 추가'}
                >
                  <Heart 
                    size={18} 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke={isFavorite ? "currentColor" : "#000000"}
                    strokeWidth={1.5}
                    className="transition-all"
                  />
                </button>
              </div>
              
              <div className="w-full mt-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    출판일
                  </div>
                  <div className="font-medium">{book.publishDate}</div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    대여상태
                  </div>
                  <div>
                    <BadgeDisplay
                      badges={[isAvailable ? "available" : (isReserved || book.isReservable === false) ? "reserved" : "borrowed"]}
                      size="sm"
                    />
                  </div>
                </div>
                
                {book.rating && (
                  <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                    <div>평점</div>
                    <div className="flex items-center">
                      <StarRating value={book.rating} size={16} interactive={false} />
                      <span className="ml-1 font-medium">({book.rating})</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-3 mt-2">
                {renderActionButtons()}
              </div>
            </div>
          </div>
            
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              {book.badges && book.badges.length > 0 && (
                <div className="mb-4">
                  <BadgeDisplay badges={book.badges} size="md" />
                </div>
              )}
              
              <h1 className="text-2xl font-bold mb-3">{book.title}</h1>
              <p className="text-gray-700 mb-6">{book.author}</p>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="info">도서 정보</TabsTrigger>
                  <TabsTrigger value="reviews">리뷰 ({reviews.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="pt-2">
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-semibold mb-4">상세 정보</h2>
                    
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">카테고리:</span>
                          <span className="font-medium">{book.category}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">출판일:</span>
                          <span className="font-medium">{book.publishDate}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">출판사:</span>
                          <span className="font-medium">{book.publisher}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">ISBN:</span>
                          <span className="font-medium">{book.isbn}</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">위치:</span>
                          <span className="font-medium">{shelfLocation}번 서가</span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">등록일:</span>
                          <span className="font-medium">{book.registeredDate}</span>
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="flex items-baseline gap-2">
                          <span className="text-gray-500 text-sm">대여 상태:</span>
                          <BadgeDisplay
                            badges={[isAvailable ? "available" : (isReserved || book.isReservable === false) ? "reserved" : "borrowed"]}
                            size="sm"
                          />
                          <span className="ml-2">
                            ({book.status.available}/{book.status.total})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {book.description && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <Collapsible 
                        open={isDescriptionOpen} 
                        onOpenChange={setIsDescriptionOpen}
                        className="border rounded-md"
                      >
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-md">
                          <h2 className="text-lg font-semibold">도서 줄거리</h2>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                              {isDescriptionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="p-4">
                          <p className="text-gray-700 whitespace-pre-line">
                            {book.description || "이 책은 다양한 주제에 대한 깊은 통찰력을 제공합니다. 저자는 자신의 경험과 연구를 바탕으로 독자들에게 새로운 관점을 제시합니다. 각 장은 특정 주제를 다루며, 이해하기 쉬운 설명과 예시를 통해 복잡한 개념을 명확히 전달합니다. 또한 책의 후반부에서는 실제 사례 연구와 적용 방법을 제시하여 독자들이 배운 내용을 실생활에 활용할 수 있도록 돕습니다. 이 책은 해당 분야에 관심 있는 모든 독자에게 가치 있는 자료가 될 것입니다. 저자의 명확한 문체와 체계적인 접근 방식은 복잡한 주제를 이해하기 쉽게 만들어 주며, 다양한 사례 연구와 예시를 통해 이론이 실제로 어떻게 적용되는지 보여줍니다. 이 책은 학문적 연구뿐만 아니라 실용적인 지식을 찾는 독자들에게도 유용한 자료가 될 것입니다."}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-2">
                  <div className="mb-6 border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium mb-4">리뷰 작성</h3>
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">평점</div>
                      <div>
                        <StarRating
                          value={rating}
                          onChange={setRating}
                          max={5}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">리뷰 내용</div>
                      <Textarea
                        placeholder="이 책에 대한 의견을 남겨주세요."
                        rows={4}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSubmitReview}>
                      리뷰 등록
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-2">리뷰 {reviews.length}건</h3>
                    
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">아직 작성된 리뷰가 없습니다.</p>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                          <div className="flex items-center mb-2">
                            <div className="font-medium">{review.userName}</div>
                            <div className="ml-2">
                              <StarRating value={review.rating} size={14} interactive={false} />
                            </div>
                            <div className="ml-auto text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <BorrowBookDialog 
        book={book}
        isOpen={borrowDialogOpen}
        onOpenChange={setBorrowDialogOpen}
      />
      
      <ReturnBookDialog 
        book={book}
        isOpen={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
      />
      
      <ExtendBookDialog 
        book={book}
        isOpen={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
      />
    </MainLayout>
  );
};

export default BookDetail;
