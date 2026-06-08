import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-[var(--radius-full)]",
    "text-[var(--text-sm)] font-medium cursor-pointer whitespace-nowrap flex-shrink-0",
    "border-none transition-all duration-[120ms]",
  ],
  {
    variants: {
      variant: {
        menu:     "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-3.5 py-2",
        active:   "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2",
        inactive: "bg-transparent border border-[1.5px] border-[var(--color-border)] text-[var(--color-foreground)] px-4 py-2 hover:bg-[var(--color-muted)]",
      },
    },
    defaultVariants: { variant: "inactive" },
  }
);

export interface PillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillVariants> {}

const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, variant, ...props }, ref) => (
    <button ref={ref} className={cn(pillVariants({ variant }), className)} {...props} />
  )
);
Pill.displayName = "Pill";

/* ── Filter Row wrapper ── */
const FilterRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden", className)}
      {...props}
    />
  )
);
FilterRow.displayName = "FilterRow";

export { Pill, pillVariants, FilterRow };
