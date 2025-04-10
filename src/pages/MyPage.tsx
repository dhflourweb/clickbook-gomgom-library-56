import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookGrid } from '@/components/books/BookGrid';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { MOCK_BOOKS, MOCK_READING_GOAL } from '@/data/mockData';
import { ReadingGoal } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const MyPage = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState<ReadingGoal>(MOCK_READING_GOAL);
  const [newGoalTarget, setNewGoalTarget] = useState(goal.target.toString());
  const isMobile = useIsMobile();
  
  const handleGoalUpdate = () => {
    const target = parseInt(newGoalTarget);
    if (isNaN(target) || target <= 0) {
      toast({
        title: "오류",
        description: '유효한 목표 권수를 입력해주세요.',
        variant: "destructive"
      });
      return;
    }
    
    setGoal({ ...goal, target });
    toast({
      title: "성공",
      description: '독서 목표가 업데이트되었습니다.'
    });
  };

  const borrowedBooks = MOCK_BOOKS.slice(0, 2);
  const historyBooks = MOCK_BOOKS.slice(2, 6);
  
  const progress = goal.current / goal.target * 100;
  const progressColor = progress < 30 ? 'bg-point-red' : 
                        progress < 70 ? 'bg-secondary-orange' : 
                        'bg-secondary-green';

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">마이 페이지</h1>
          <p className="text-muted-foreground">
            회원 정보와 도서 대여 정보를 확인하실 수 있습니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>회원 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">이름</div>
                <div className="font-medium">{user?.name}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">이메일</div>
                <div className="font-medium">{user?.email}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">연락처</div>
                <div className="font-medium">{user?.phone}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">부서</div>
                <div className="font-medium">{user?.department}</div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">대여 가능 도서</div>
                  <Badge variant="outline" className="bg-primary-skyblue/10 text-primary-skyblue">
                    {2 - (user?.borrowedBooks || 0)}/2
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">예약 가능 도서</div>
                  <Badge variant="outline" className="bg-secondary-orange/10 text-secondary-orange">
                    {1 - (user?.reservedBooks || 0)}/1
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>2024 독서 목표</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    목표 수정
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>독서 목표 설정</DialogTitle>
                    <DialogDescription>
                      올해 읽고 싶은 책의 수를 입력해 주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">목표 권수</Label>
                      <Input
                        id="goal"
                        type="number"
                        min="1"
                        value={newGoalTarget}
                        onChange={(e) => setNewGoalTarget(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleGoalUpdate}>
                      목표 설정하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold">{goal.current}</div>
                    <div className="text-sm text-muted-foreground">현재 독서량</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary-realblue">
                      {goal.target}
                    </div>
                    <div className="text-sm text-muted-foreground">목표 독서량</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div>진행률: {Math.round(progress)}%</div>
                    <div>{goal.current}/{goal.target} 권</div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressColor}`} 
                      style={{ width: `${Math.min(100, progress)}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-semibold">4</div>
                  <div className="text-xs text-muted-foreground">지난달 독서량</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-semibold">12</div>
                  <div className="text-xs text-muted-foreground">작년 동기 대비</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-semibold">3.5</div>
                  <div className="text-xs text-muted-foreground">월평균 독서량</div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  독서량 기준: 반납 완료된 도서에 한함
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="current">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="current">현재 대여/예약</TabsTrigger>
            <TabsTrigger value="history">대여 이력</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="pt-6">
            <h2 className="text-xl font-semibold mb-4">현재 대여/예약 도서</h2>
            {borrowedBooks.length > 0 ? (
              <BookGrid books={borrowedBooks} viewMode={isMobile ? 'list' : 'grid'} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">현재 대여 중인 도서가 없습니다.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <h2 className="text-xl font-semibold mb-4">대여 이력</h2>
            {historyBooks.length > 0 ? (
              <BookGrid books={historyBooks} viewMode={isMobile ? 'list' : 'grid'} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">대여 이력이 없습니다.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MyPage;
