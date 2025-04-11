
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: "u1",
    name: "홍길동",
    email: "user@dhflour.co.kr",
    password: "password123",
    phone: "010-1234-5678",
    department: "IT 개발팀",
    role: "EMP" as UserRole,
    borrowedBooks: 1,
    reservedBooks: 0,
    status: "active" as const
  },
  {
    id: "a1",
    name: "관리자",
    email: "admin@dhflour.co.kr",
    password: "admin123",
    phone: "010-9876-5432",
    department: "인사부",
    role: "ADM" as UserRole,
    borrowedBooks: 0,
    reservedBooks: 0,
    status: "active" as const
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('gomclick_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('gomclick_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password before storing
      const { password: _, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem('gomclick_user', JSON.stringify(safeUser));
      
      toast({
        title: "로그인 성공",
        description: `${safeUser.name}님 환영합니다.`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 확인해 주세요.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gomclick_user');
    // Clear auto login when logging out
    localStorage.removeItem('gomclick_auto_login');
    localStorage.removeItem('gomclick_saved_password');
    
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다.",
    });
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
