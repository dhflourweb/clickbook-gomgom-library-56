
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number; // Changed from required to optional
  value?: number; // Added value prop as alternative to rating
  setRating?: (rating: number) => void; // Changed from required to optional
  onChange?: (rating: number) => void; // Added onChange prop as alternative to setRating
  max?: number;
  size?: number;
  interactive?: boolean;
}

export const StarRating = ({
  rating,
  value,
  setRating,
  onChange,
  max = 5,
  size = 20,
  interactive = true
}: StarRatingProps) => {
  // Use either value or rating (with value taking precedence)
  const currentRating = value !== undefined ? value : (rating || 0);
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
    // Call either onChange or setRating depending on which was provided
    if (onChange) onChange(rating);
    if (setRating) setRating(rating);
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
            fill={(hoverRating || currentRating) >= starRating ? "#F79C33" : "none"}
            color={(hoverRating || currentRating) >= starRating ? "#F79C33" : "#d1d5db"}
          />
        </span>
      ))}
    </div>
  );
};
