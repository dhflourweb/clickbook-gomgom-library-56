
import { cn } from "@/lib/utils";
import { BookBadge } from "@/types";

interface BadgeDisplayProps {
  badges: BookBadge[];
  size?: "xs" | "sm" | "md" | "lg";
}

const badgeLabels: Record<Exclude<NonNullable<BookBadge>, 'popular'>, string> = {
  'new': '신규',
  'recommended': '추천',
  'best': '베스트'
};

export const BadgeDisplay = ({ badges, size = "md" }: BadgeDisplayProps) => {
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
        .filter((badge): badge is NonNullable<BookBadge> => badge !== null && badge !== 'popular')
        .map(badge => {
          let badgeClassName = "font-medium rounded-md";
          
          // Apply specific styles based on badge type
          if (badge === 'new') {
            badgeClassName += " bg-secondary-orange text-white";
          } else if (badge === 'recommended') {
            badgeClassName += " bg-secondary-green text-white";
          } else if (badge === 'best') {
            badgeClassName += " bg-point-red text-white";
          } else {
            badgeClassName += " badge-" + badge;
          }
          
          return (
            <span
              key={badge}
              className={cn(badgeClassName, sizeClasses[size])}
            >
              {badgeLabels[badge as keyof typeof badgeLabels]}
            </span>
          );
        })}
    </div>
  );
};
