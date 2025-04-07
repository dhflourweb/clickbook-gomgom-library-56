import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
export const Banner = ({
  items
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
  return <div className="relative h-[300px] overflow-hidden rounded-lg">
      <div className="h-full flex transition-transform duration-500 ease-in-out" style={{
      transform: `translateX(-${currentIndex * 100}%)`
    }}>
        {items.map(item => <div key={item.id} className="min-w-full h-full relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
              <div className="p-6 text-white max-w-md px-0 mx-[70px]">
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="mb-4 opacity-90">{item.description}</p>
                <Link to={item.buttonLink}>
                  <Button variant="secondary" className="hover:bg-white/90">
                    {item.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>)}
      </div>
      
      {/* Navigation arrows */}
      <button onClick={prevSlide} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors" aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      
      <button onClick={nextSlide} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors" aria-label="Next slide">
        <ChevronRight size={24} />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, idx) => <button key={idx} onClick={() => setCurrentIndex(idx)} className={cn("w-2 h-2 rounded-full transition-all", currentIndex === idx ? "bg-white w-4" : "bg-white/50 hover:bg-white/80")} aria-label={`Go to slide ${idx + 1}`} />)}
      </div>
    </div>;
};