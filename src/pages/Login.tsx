
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      toast.error("이메일을 입력해주세요");
      return;
    }
    
    setIsRecoveryLoading(true);
    
    // Simulate password recovery process
    setTimeout(() => {
      toast.success("비밀번호 재설정 이메일이 발송되었습니다", {
        description: "이메일 내 링크를 통해 비밀번호를 재설정하세요.",
      });
      setIsRecoveryLoading(false);
      setIsRecoveryOpen(false);
      setRecoveryEmail('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-deepblue to-primary-realblue py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center">
              <span className="text-secondary-orange">곰클릭</span>
              <span className="text-white">+</span>
              <span className="text-primary-skyblue">책방</span>
            </h1>
            <p className="mt-2 text-white/80">사내 디지털 도서관</p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription>
                계정 정보로 로그인하세요
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@dhflour.co.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <button 
                      type="button" 
                      className="text-xs text-primary-skyblue hover:underline"
                      onClick={() => setIsRecoveryOpen(true)}
                    >
                      비밀번호 찾기
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">⭐ <strong>테스트 계정 (사용자)</strong>: user@dhflour.co.kr / password123</p>
                  <p>⭐ <strong>테스트 계정 (관리자)</strong>: admin@dhflour.co.kr / admin123</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-primary-realblue hover:bg-primary-deepblue"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Password Recovery Dialog */}
      <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 찾기</DialogTitle>
            <DialogDescription>
              등록된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRecoverySubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">이메일</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="your.email@dhflour.co.kr"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRecoveryOpen(false)}
                className="mt-2 sm:mt-0"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-primary-realblue hover:bg-primary-deepblue"
                disabled={isRecoveryLoading}
              >
                {isRecoveryLoading ? '요청 중...' : '비밀번호 재설정 요청'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
