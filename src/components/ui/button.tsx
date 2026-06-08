import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center font-semibold cursor-pointer",
    "transition-opacity duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        primary:   "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-85",
        secondary: "bg-transparent border border-[1.5px] border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
        danger:    "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-85",
      },
      size: {
        cta:  "w-full rounded-[var(--radius-lg)] py-[18px] px-4 text-[var(--text-md)] tracking-[0.2px]",
        sm:   "rounded-[var(--radius-full)] px-4 py-2 text-[var(--text-sm)]",
        icon: "rounded-[var(--radius-full)] w-10 h-10 text-[22px] font-light leading-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "cta",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

/* ── Select Attribute Button (pill-shaped primary) ── */
const SelectAttrButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
      "border-none rounded-[var(--radius-full)]",
      "px-4 py-2 text-[var(--text-sm)] font-medium cursor-pointer whitespace-nowrap",
      "hover:opacity-85 transition-opacity duration-[120ms]",
      className
    )}
    {...props}
  />
));
SelectAttrButton.displayName = "SelectAttrButton";

/* ── Back Button ── */
const BackButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-9 h-9 flex items-center justify-center cursor-pointer",
      "rounded-[var(--radius-full)] text-[var(--color-foreground)]",
      "hover:bg-[var(--color-muted)] transition-colors duration-[120ms]",
      "border-none bg-transparent",
      className
    )}
    {...props}
  >
    {children ?? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
    )}
  </button>
));
BackButton.displayName = "BackButton";

export { Button, buttonVariants, SelectAttrButton, BackButton };
