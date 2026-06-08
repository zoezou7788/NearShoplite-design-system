import * as React from "react";
import { cn } from "@/lib/utils";

/** Read-only chip — product attributes (Medium, Regular Ice, No Sugar) */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

/** Horizontal rule using the border token */
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
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

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
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
