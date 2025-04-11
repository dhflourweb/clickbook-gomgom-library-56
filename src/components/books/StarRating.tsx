
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  max?: number;
  size?: number;
  interactive?: boolean;
}

export const StarRating = ({
  rating,
  setRating,
  max = 5,
  size = 20,
  interactive = true
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (rating: number) => {
    if (!interactive) return;
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    if (!interactive) return;
    setRating(rating);
  };

  return (
    <div 
      className="flex" 
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((starRating) => (
        <span 
          key={starRating} 
          onMouseOver={() => handleMouseOver(starRating)}
          onClick={() => handleClick(starRating)}
          className={interactive ? "cursor-pointer" : ""}
        >
          <Star
            size={size}
            fill={(hoverRating || rating) >= starRating ? "#F79C33" : "none"}
            color={(hoverRating || rating) >= starRating ? "#F79C33" : "#d1d5db"}
          />
        </span>
      ))}
    </div>
  );
};
