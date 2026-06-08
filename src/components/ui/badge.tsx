import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/lib/tokens";

/* ── Status Badge (inline pill) ── */
const statusBadgeVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-[var(--radius-full)] text-[var(--text-xs)] font-bold tracking-[0.5px] uppercase",
  {
    variants: {
      variant: {
        completed: "bg-[var(--color-success-light)] text-[var(--color-success)]",
        canceled:  "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
        awaiting:  "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
        pending:   "bg-[var(--color-pending-light)] text-[var(--color-pending)]",
        refunding: "bg-[var(--color-info-light)] text-[var(--color-info)]",
        refunded:  "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
      } satisfies Record<BadgeVariant, string>,
    },
    defaultVariants: { variant: "pending" },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  )
);
StatusBadge.displayName = "StatusBadge";

/* ── Nav Counter Badge ── */
const NavBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute -top-1 -right-2",
        "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]",
        "text-[9px] font-bold min-w-4 h-4 px-1",
        "rounded-[var(--radius-full)] flex items-center justify-center",
        className
      )}
      {...props}
    />
  )
);
NavBadge.displayName = "NavBadge";

/* ── Pill Badge (on filter pills) ── */
const PillBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]",
        "text-[10px] font-bold min-w-[18px] h-[18px] px-[5px]",
        "rounded-[var(--radius-full)] flex items-center justify-center",
        className
      )}
      {...props}
    />
  )
);
PillBadge.displayName = "PillBadge";

/* ── Notification Dot ── */
interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md";
}
const Dot = React.forwardRef<HTMLSpanElement, DotProps>(
  ({ className, size = "md", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "rounded-[var(--radius-full)] bg-[var(--color-destructive)] border-2 border-[var(--color-surface)]",
        size === "md" ? "w-[10px] h-[10px]" : "w-2 h-2",
        className
      )}
      {...props}
    />
  )
);
Dot.displayName = "Dot";

export { StatusBadge, statusBadgeVariants, NavBadge, PillBadge, Dot };
