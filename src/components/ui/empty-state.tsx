import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon = "📭", title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center py-12 px-6 text-center gap-3", className)}
      {...props}
    >
      <span className="text-[48px] opacity-30">{icon}</span>
      <p className="text-[var(--text-md)] font-semibold text-[var(--color-foreground)]">{title}</p>
      {description && (
        <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] max-w-[240px]">{description}</p>
      )}
      {action}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
