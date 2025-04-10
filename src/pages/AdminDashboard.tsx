import { MainLayout } from '@/components/layout/MainLayout';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardMetricCard } from '@/components/admin/DashboardMetricCard';
import { Book, Users, FileText, AlertTriangle, BookMarked } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const borrowingData = [
  { month: '1월', 대여: 40, 반납: 24 },
  { month: '2월', 대여: 30, 반납: 28 },
  { month: '3월', 대여: 45, 반납: 35 },
  { month: '4월', 대여: 38, 반납: 40 },
  { month: '5월', 대여: 55, 반납: 49 },
  { month: '6월', 대여: 42, 반납: 44 },
];

const categoryData = [
  { name: 'IT/개발', count: 28 },
  { name: '경영/경제', count: 18 },
  { name: '자기계발', count: 15 },
  { name: '인문/사회', count: 12 },
  { name: '과학/기술', count: 10 },
  { name: '소설', count: 7 },
];

const AdminDashboard = () => {
  const { user, hasRole } = useAuth();
  
  if (!hasRole("ADM")) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{user?.name}님, 안녕하세요</h1>
          <p className="text-muted-foreground">
            관리자 대시보드에 오신 것을 환영합니다. 도서관 현황을 한 눈에 확인하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardMetricCard
            title="전체 도서 수"
            value="120"
            description="전년 대비 15% 증가"
            icon={<Book size={20} />}
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardMetricCard
            title="대여 중인 도서"
            value="45"
            description="전체의 37.5%"
            icon={<BookMarked size={20} />}
          />
          <DashboardMetricCard
            title="등록 사용자"
            value="85"
            description="활성 사용자 78명"
            icon={<Users size={20} />}
          />
          <DashboardMetricCard
            title="미처리 문의"
            value="4"
            description="24시간 이내: 2건"
            icon={<AlertTriangle size={20} />}
            className="border-amber-200 bg-amber-50"
          />
        </div>
        
        <Tabs defaultValue="borrowing">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="borrowing">대여 현황</TabsTrigger>
            <TabsTrigger value="categories">카테고리 분석</TabsTrigger>
            <TabsTrigger value="users">사용자 활동</TabsTrigger>
          </TabsList>
          
          <TabsContent value="borrowing" className="p-4 pt-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">월별 도서 대여 및 반납 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={borrowingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="대여" 
                  stroke="#1F3E85" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="반납" 
                  stroke="#6AB960" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories" className="p-4 pt-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">카테고리별 도서 현황</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#5AB6D5" name="도서 수" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="users" className="p-4 pt-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">최근 활동 사용자</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활동</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">김철수</td>
                    <td className="px-6 py-4 whitespace-nowrap">개발팀</td>
                    <td className="px-6 py-4 whitespace-nowrap">도서 대여</td>
                    <td className="px-6 py-4 whitespace-nowrap">오늘 10:23</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">이영희</td>
                    <td className="px-6 py-4 whitespace-nowrap">마케팅팀</td>
                    <td className="px-6 py-4 whitespace-nowrap">도서 반납</td>
                    <td className="px-6 py-4 whitespace-nowrap">오늘 09:45</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">박지민</td>
                    <td className="px-6 py-4 whitespace-nowrap">인사팀</td>
                    <td className="px-6 py-4 whitespace-nowrap">리뷰 작성</td>
                    <td className="px-6 py-4 whitespace-nowrap">어제 17:30</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">최준호</td>
                    <td className="px-6 py-4 whitespace-nowrap">회계팀</td>
                    <td className="px-6 py-4 whitespace-nowrap">문의 등록</td>
                    <td className="px-6 py-4 whitespace-nowrap">어제 16:15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 문의사항</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">도서 기증 방법 문의</div>
                  <div className="text-xs text-muted-foreground">오늘 11:23</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">김철수 (개발팀)</div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">도서 대여 기간 확인</div>
                  <div className="text-xs text-muted-foreground">오늘 09:17</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">박지민 (인사팀)</div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">새 도서 요청</div>
                  <div className="text-xs text-muted-foreground">어제</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">이영희 (마케팅팀)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>미반납 도서</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">클린 코드</div>
                  <div className="text-xs text-point-red">기한 초과: 3일</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">홍길동 (IT팀) - 2024/03/28</div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">함께 자라기</div>
                  <div className="text-xs text-amber-500">오늘 마감</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">김철수 (개발팀) - 2024/04/07</div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">사피엔스</div>
                  <div className="text-xs text-gray-500">남은 기간: 2일</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">이영희 (마케팅팀) - 2024/04/09</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
