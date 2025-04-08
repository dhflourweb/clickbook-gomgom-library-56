
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
}

export const ScrollToTopButton = ({ 
  threshold = 300, 
  className 
}: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const checkScrollPosition = () => {
    if (window.scrollY > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [threshold]);
  
  if (!isVisible) return null;
  
  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 z-50 rounded-full p-3 shadow-lg bg-[#1F4788] hover:bg-[#1F4788]/90",
        "bottom-20 md:bottom-24",
        className
      )}
      size="icon"
      aria-label="맨 위로"
    >
      <ArrowUp size={20} className="text-white" />
    </Button>
  );
};
