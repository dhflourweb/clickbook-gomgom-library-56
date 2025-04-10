
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import logo from '@/assets/images/icon_logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberID, setRememberID] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved email and auto login
    const savedEmail = localStorage.getItem('gomclick_saved_email');
    const savedAutoLogin = localStorage.getItem('gomclick_auto_login');

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberID(true);
    }

    if (savedAutoLogin && savedEmail) {
      setAutoLogin(true);
      const savedPassword = localStorage.getItem('gomclick_saved_password');
      
      if (savedPassword) {
        setPassword(savedPassword);
        handleAutoLogin(savedEmail, savedPassword);
      }
    }
  }, []);

  const handleAutoLogin = async (savedEmail: string, savedPassword: string) => {
    try {
      setIsLoading(true);
      await login(savedEmail, savedPassword);
      navigate('/');
    } catch (error) {
      console.error('Auto login failed:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Save email if remember ID is checked
      if (rememberID) {
        localStorage.setItem('gomclick_saved_email', email);
      } else {
        localStorage.removeItem('gomclick_saved_email');
      }
      
      // Save auto login preference
      if (autoLogin) {
        localStorage.setItem('gomclick_auto_login', 'true');
        localStorage.setItem('gomclick_saved_password', password);
      } else {
        localStorage.removeItem('gomclick_auto_login');
        localStorage.removeItem('gomclick_saved_password');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-deepblue to-primary-realblue py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center">
              <div className="bg-white p-2 rounded-md inline-block">
                <img src={logo} alt="로고" className="h-15 w-auto object-contain"/>
              </div>
              {/*<span className="text-secondary-orange">곰클릭</span>*/}
              {/*<span className="text-white">+</span>*/}
              {/*<span className="text-primary-skyblue">책방</span>*/}
            </h1>
            {/*<p className="mt-2 text-white/80">사내 디지털 도서관</p>*/}
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription>
                사내문고 시스템에 로그인하세요
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">아이디</Label>
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
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>
                <div className="flex items-center justify-between px-10">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="rememberID"
                        checked={rememberID}
                        onCheckedChange={(checked) => setRememberID(checked === true)}
                    />
                    <label htmlFor="rememberID" className="text-sm font-medium leading-none">
                      아이디 저장
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="autoLogin"
                        checked={autoLogin}
                        onCheckedChange={(checked) => setAutoLogin(checked === true)}
                    />
                    <label htmlFor="autoLogin" className="text-sm font-medium leading-none">
                      자동 로그인
                    </label>
                  </div>
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
    </div>
  );
};

export default Login;
