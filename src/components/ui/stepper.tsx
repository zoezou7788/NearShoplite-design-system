import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Add Button (+ circle on product card) ── */
interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  ({ className, active = true, ...props }, ref) => (
    <button
      ref={ref}
      disabled={!active}
      className={cn(
        "w-10 h-10 rounded-[var(--radius-full)] border-none cursor-pointer",
        "flex items-center justify-center text-[22px] font-light leading-none",
        "transition-opacity duration-[120ms]",
        active
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-85"
          : "bg-[var(--color-muted)] text-[var(--color-foreground-disabled)] cursor-not-allowed",
        className
      )}
      {...props}
    >
      +
    </button>
  )
);
AddButton.displayName = "AddButton";

/* ── Stepper (quantity control) ── */
interface StepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onDecrement,
  onIncrement,
  min = 0,
  max,
  className,
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    <button
      onClick={onDecrement}
      disabled={value <= min}
      className={cn(
        "w-8 h-8 rounded-[var(--radius-full)]",
        "border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)]",
        "text-[20px] leading-none flex items-center justify-center cursor-pointer",
        "transition-[background,color] duration-[120ms]",
        "hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      −
    </button>
    <span className="text-[var(--text-md)] font-semibold min-w-6 text-center">{value}</span>
    <button
      onClick={onIncrement}
      disabled={max !== undefined && value >= max}
      className={cn(
        "w-8 h-8 rounded-[var(--radius-full)]",
        "border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)]",
        "text-[20px] leading-none flex items-center justify-center cursor-pointer",
        "transition-[background,color] duration-[120ms]",
        "hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      +
    </button>
  </div>
);

export { AddButton, Stepper };
