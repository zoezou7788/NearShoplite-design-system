import * as React from "react";
import { cn } from "@/lib/utils";

/** Base shimmer skeleton block — compose to build custom loading states */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-sm)]",
        "bg-gradient-to-r from-[var(--color-muted)] via-[#E0E0E0] to-[var(--color-muted)]",
        "bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]",
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export interface ProductCardSkeletonProps { className?: string }
export interface OrderCardSkeletonProps { className?: string }

/* ── Product Card skeleton ── */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className }) => (
  <div className={cn("bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 flex items-center gap-3 shadow-[var(--shadow-card)]", className)}>
    <Skeleton className="w-12 h-12 rounded-[var(--radius-md)] flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </div>
);

/* ── Order Card skeleton ── */
const OrderCardSkeleton: React.FC<OrderCardSkeletonProps> = ({ className }) => (
  <div className={cn("bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 flex items-center gap-3.5 shadow-[var(--shadow-card)]", className)}>
    <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export { Skeleton, ProductCardSkeleton, OrderCardSkeleton };
