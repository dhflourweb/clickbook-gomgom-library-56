
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
}

export const StarRating = ({
  value,
  onChange,
  max = 5,
  size = 20
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  return (
    <div 
      className="flex" 
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <span 
          key={rating} 
          onMouseOver={() => handleMouseOver(rating)}
          onClick={() => handleClick(rating)}
          className="cursor-pointer"
        >
          <Star
            size={size}
            fill={(hoverRating || value) >= rating ? "#F79C33" : "none"}
            color={(hoverRating || value) >= rating ? "#F79C33" : "#d1d5db"}
          />
        </span>
      ))}
    </div>
  );
};
