
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface BannerItem {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface BannerProps {
  items: BannerItem[];
}

export const Banner = ({ items }: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  if (!items.length) return null;
  
  return (
    <div className={cn("relative overflow-hidden", isMobile ? "h-[220px]" : "h-[300px] rounded-lg")}>
      <div 
        className="h-full flex transition-transform duration-500 ease-in-out" 
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {items.map(item => (
          <div key={item.id} className="min-w-full h-full relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className={cn(
              "absolute inset-0 flex items-center",
              isMobile 
                ? "bg-gradient-to-r from-black/60 to-transparent" 
                : "bg-gradient-to-r from-black/70 via-black/30 to-transparent"
            )}>
              <div className={cn(
                "text-white max-w-md",
                isMobile ? "p-4" : "p-6 mx-[70px]"
              )}>
                <h2 className={cn(
                  "font-bold mb-2 text-white",
                  isMobile ? "text-xl" : "text-2xl"
                )}>
                  {item.title}
                </h2>
                <p className={cn(
                  "mb-4 opacity-90 text-white",
                  isMobile ? "text-sm line-clamp-2" : ""
                )}>
                  {item.description}
                </p>
                <Link to={item.buttonLink}>
                  <Button 
                    variant="secondary" 
                    className="hover:bg-white/90"
                    size={isMobile ? "sm" : "default"}
                  >
                    {item.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide} 
        className={cn(
          "absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors",
          isMobile ? "p-1" : "p-2"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobile ? 20 : 24} />
      </button>
      
      <button 
        onClick={nextSlide} 
        className={cn(
          "absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors",
          isMobile ? "p-1" : "p-2"
        )}
        aria-label="Next slide"
      >
        <ChevronRight size={isMobile ? 20 : 24} />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={cn(
              "rounded-full transition-all", 
              currentIndex === idx 
                ? "bg-white w-4 h-2" 
                : "bg-white/50 hover:bg-white/80 w-2 h-2"
            )} 
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
