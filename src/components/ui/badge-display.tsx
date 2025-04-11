
import { cn } from "@/lib/utils";
import { BookBadge } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface BadgeDisplayProps {
  badges: BookBadge[];
  size?: "xs" | "sm" | "md" | "lg";
}

const badgeLabels: Record<Exclude<NonNullable<BookBadge>, null>, string> = {
  'recommended': '추천',
  'best': '베스트',
  'popular': '인기',
  'new': '신규'
};

export const BadgeDisplay = ({ badges, size = "md" }: BadgeDisplayProps) => {
  const isMobile = useIsMobile();
  
  if (!badges || badges.length === 0 || badges.every(badge => !badge)) {
    return null;
  }

  const sizeClasses = {
    xs: "text-[9px] px-1 py-0.5",
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1.5"
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges
        .filter((badge): badge is NonNullable<BookBadge> => badge !== null)
        .map(badge => {
          let badgeClassName = "font-medium rounded-md inline-block";
          
          // Apply specific styles based on badge type
          if (badge === 'recommended') {
            badgeClassName += " bg-secondary-orange text-white"; // 추천
          } else if (badge === 'best') {
            badgeClassName += " bg-point-red text-white"; // 베스트
          } else if (badge === 'popular') {
            badgeClassName += " bg-primary-skyblue text-white"; // 인기
          } else if (badge === 'new') {
            badgeClassName += " bg-secondary-green text-white"; // 신규
          } else {
            badgeClassName += " badge-" + badge;
          }
          
          return (
            <span
              key={badge}
              className={cn(badgeClassName, sizeClasses[size], isMobile ? "mb-1" : "")}
            >
              {badgeLabels[badge]}
            </span>
          );
        })}
    </div>
  );
};
