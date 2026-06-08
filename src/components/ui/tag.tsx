import * as React from "react";
import { cn } from "@/lib/utils";

const Tag = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
        "rounded-[var(--radius-full)] px-2.5 py-[3px] text-[var(--text-xs)] font-medium",
        className
      )}
      {...props}
    />
  )
);
Tag.displayName = "Tag";

const Divider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn("border-none border-t border-[var(--color-border)] m-0", className)}
      {...props}
    />
  )
);
Divider.displayName = "Divider";

export { Tag, Divider };
