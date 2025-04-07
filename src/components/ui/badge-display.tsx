
import { cn } from "@/lib/utils";
import { BookBadge } from "@/types";

interface BadgeDisplayProps {
  badges: BookBadge[];
  size?: "sm" | "md" | "lg";
}

const badgeLabels: Record<NonNullable<BookBadge>, string> = {
  'new': '신규',
  'recommended': '추천',
  'popular': '인기',
  'best': '베스트'
};

export const BadgeDisplay = ({ badges, size = "md" }: BadgeDisplayProps) => {
  if (!badges || badges.length === 0 || badges.every(badge => !badge)) {
    return null;
  }

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1.5"
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges
        .filter((badge): badge is NonNullable<BookBadge> => badge !== null)
        .map(badge => (
          <span
            key={badge}
            className={cn(
              "font-medium rounded-md",
              sizeClasses[size],
              {
                'badge-new': badge === 'new',
                'badge-recommended': badge === 'recommended',
                'badge-popular': badge === 'popular',
                'badge-best': badge === 'best'
              }
            )}
          >
            {badgeLabels[badge]}
          </span>
        ))}
    </div>
  );
};
