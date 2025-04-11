
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { MOCK_BOOKS, MOCK_READING_GOAL } from '@/data/mockData';
import { ReadingGoal } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

// Monthly goals data structure
interface MonthlyGoal {
  month: number;
  target: number;
  current: number;
}

const monthNames = [
  "1월", "2월", "3월", "4월", "5월", "6월", 
  "7월", "8월", "9월", "10월", "11월", "12월"
];

const MyPage = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState<ReadingGoal>(MOCK_READING_GOAL);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // Track if goals exist for the current year
  const [hasYearlyGoals, setHasYearlyGoals] = useState(true);
  
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(
    Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      target: Math.floor(Math.random() * 3) + 1, // Random target 1-3 books per month
      current: Math.floor(Math.random() * 3) // Random current 0-2 books per month
    }))
  );
  
  const [newMonthlyTargets, setNewMonthlyTargets] = useState<Record<number, string>>(
    monthlyGoals.reduce((acc, { month, target }) => ({ ...acc, [month]: target.toString() }), {})
  );
  
  const isMobile = useIsMobile();
  
  // Simulate changing goals based on year selection
  const handleYearChange = (year: string) => {
    const yearNumber = parseInt(year);
    setSelectedYear(yearNumber);
    
    // Simulate if goals exist for this year
    // For this example, let's say 2023 and 2024 have goals, but 2025 doesn't
    const exists = yearNumber !== 2025;
    setHasYearlyGoals(exists);
    
    if (exists) {
      // Mock data for existing years
      const mockGoals = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        target: yearNumber === 2024 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2) + 1,
        current: yearNumber === 2024 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2)
      }));
      setMonthlyGoals(mockGoals);
      setNewMonthlyTargets(
        mockGoals.reduce((acc, { month, target }) => ({ ...acc, [month]: target.toString() }), {})
      );
    } else {
      // Reset goals for years without existing data
      const emptyGoals = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        target: 0,
        current: 0
      }));
      setMonthlyGoals(emptyGoals);
      setNewMonthlyTargets(
        emptyGoals.reduce((acc, { month }) => ({ ...acc, [month]: '0' }), {})
      );
    }
  };
  
  const handleGoalUpdate = () => {
    // Validate all monthly targets
    const invalidMonths: number[] = [];
    const newGoals = [...monthlyGoals];
    
    for (let month = 1; month <= 12; month++) {
      const target = parseInt(newMonthlyTargets[month] || '0');
      if (isNaN(target) || target < 0) {
        invalidMonths.push(month);
      } else {
        // Update the goal for valid months
        const index = newGoals.findIndex(g => g.month === month);
        if (index !== -1) {
          newGoals[index] = { ...newGoals[index], target };
        }
      }
    }
    
    if (invalidMonths.length > 0) {
      toast({
        title: "오류",
        description: `${invalidMonths.map(m => monthNames[m-1]).join(', ')}에 유효하지 않은 목표값이 있습니다.`,
        variant: "destructive"
      });
      return;
    }
    
    // Calculate total target
    const totalTarget = newGoals.reduce((sum, { target }) => sum + target, 0);
    const totalCurrent = newGoals.reduce((sum, { current }) => sum + current, 0);
    
    setMonthlyGoals(newGoals);
    setGoal({ ...goal, target: totalTarget, current: totalCurrent });
    setIsEditingGoal(false);
    setHasYearlyGoals(true);
    
    toast({
      title: "성공",
      description: `${selectedYear}년 월별 독서 목표가 업데이트되었습니다.`
    });
  };

  const handleDeleteGoals = () => {
    const emptyGoals = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      target: 0,
      current: 0
    }));
    
    setMonthlyGoals(emptyGoals);
    setNewMonthlyTargets(
      emptyGoals.reduce((acc, { month }) => ({ ...acc, [month]: '0' }), {})
    );
    setGoal({ ...goal, target: 0, current: 0 });
    setHasYearlyGoals(false);
    setIsDeleteConfirmOpen(false);
    
    toast({
      title: "성공",
      description: `${selectedYear}년 독서 목표가 삭제되었습니다.`
    });
  };

  const handleMonthlyTargetChange = (month: number, value: string) => {
    setNewMonthlyTargets(prev => ({
      ...prev,
      [month]: value
    }));
  };

  // Calculate yearly totals
  const yearlyTotal = monthlyGoals.reduce((sum, { target }) => sum + target, 0);
  const yearlyCurrent = monthlyGoals.reduce((sum, { current }) => sum + current, 0);
  
  const progress = yearlyTotal > 0 ? (yearlyCurrent / yearlyTotal * 100) : 0;
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
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>회원 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">사번</div>
                <div className="font-medium">{user?.role === 'ADM' ? 'ADMIN' : user?.employeeId}</div>
              </div>
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
          
          {/* Reading Challenge Card */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>{selectedYear}년 독서 챌린지</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">월별 독서 목표 및 달성 현황</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={selectedYear.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="년도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023년</SelectItem>
                    <SelectItem value="2024">2024년</SelectItem>
                    <SelectItem value="2025">2025년</SelectItem>
                  </SelectContent>
                </Select>
                {hasYearlyGoals ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingGoal(true)}
                    >
                      목표 수정
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingGoal(true)}
                  >
                    목표 등록
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                  <div>
                    <div className="text-4xl font-bold">{yearlyCurrent}</div>
                    <div className="text-sm text-muted-foreground">현재 독서량</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary-realblue">
                      {yearlyTotal}
                    </div>
                    <div className="text-sm text-muted-foreground">목표 독서량</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div>진행률: {yearlyTotal > 0 ? Math.round((yearlyCurrent / yearlyTotal) * 100) : 0}%</div>
                    <div>{yearlyCurrent}/{yearlyTotal} 권</div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressColor}`} 
                      style={{ width: `${yearlyTotal > 0 ? Math.min(100, (yearlyCurrent / yearlyTotal) * 100) : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Monthly goals table with horizontal scroll on mobile */}
              <div className="overflow-x-auto -mx-6">
                <div className="min-w-[600px] px-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">월</th>
                        {monthNames.map((month, index) => (
                          <th key={index} className="text-center py-2 px-1 text-sm font-medium text-gray-600">{month}</th>
                        ))}
                        <th className="text-center py-2 px-3 text-sm font-medium text-gray-600">합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm font-medium text-gray-600">목표</td>
                        {monthlyGoals.map((goal) => (
                          <td key={goal.month} className="text-center py-2 px-1 text-sm">{goal.target}</td>
                        ))}
                        <td className="text-center py-2 px-3 text-sm font-semibold">{yearlyTotal}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium text-gray-600">실적</td>
                        {monthlyGoals.map((goal) => (
                          <td 
                            key={goal.month} 
                            className={`text-center py-2 px-1 text-sm ${
                              goal.current >= goal.target ? 'text-secondary-green font-medium' : 
                              goal.current > 0 ? 'text-secondary-orange' : ''
                            }`}
                          >
                            {goal.current}
                          </td>
                        ))}
                        <td className="text-center py-2 px-3 text-sm font-semibold">{yearlyCurrent}</td>
                      </tr>
                    </tbody>
                  </table>
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
      </div>
      
      {/* Monthly Reading Goals Dialog */}
      <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedYear}년 월별 독서 목표 설정</DialogTitle>
            <DialogDescription>
              각 월별 목표 독서량을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {monthlyGoals.map(({ month }) => (
              <div key={month} className="space-y-2">
                <Label htmlFor={`month-${month}`}>{monthNames[month - 1]}</Label>
                <Input
                  id={`month-${month}`}
                  type="number"
                  min="0"
                  value={newMonthlyTargets[month] || '0'}
                  onChange={(e) => handleMonthlyTargetChange(month, e.target.value)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingGoal(false)}>
              취소
            </Button>
            <Button onClick={handleGoalUpdate}>
              목표 설정하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>독서 목표 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedYear}년 독서 목표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoals} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MyPage;
