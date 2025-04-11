
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    disableHover?: boolean;
  }

function Badge({ className, variant, disableHover = true, ...props }: BadgeProps) {
  const baseVariant = badgeVariants({ variant });
  // Always disable hover effects by default
  const finalClass = disableHover 
    ? cn(baseVariant, className, "pointer-events-none max-w-full overflow-hidden text-ellipsis whitespace-nowrap")
    : cn(baseVariant, className, "hover:bg-primary/80 max-w-full overflow-hidden text-ellipsis whitespace-nowrap");
    
  return (
    <div className={finalClass} {...props} />
  )
}

export { Badge, badgeVariants }
