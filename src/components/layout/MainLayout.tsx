
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/sonner';
import { BottomNav } from '@/components/mobile/BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pb-24">
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
      {isMobile && <BottomNav />}
      <Toaster />
    </div>
  );
};
