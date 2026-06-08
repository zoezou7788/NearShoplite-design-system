import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3.5 shadow-[var(--shadow-float)] text-[var(--text-sm)] font-medium",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
        success: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
        error:   "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, onClose, children, ...props }, ref) => (
    <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      <span className="flex-1">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto bg-transparent border-none text-inherit text-[18px] cursor-pointer opacity-70 p-0 leading-none"
        >
          ×
        </button>
      )}
    </div>
  )
);
Toast.displayName = "Toast";

export { Toast, toastVariants };
