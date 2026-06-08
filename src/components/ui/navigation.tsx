import * as React from "react";
import { cn } from "@/lib/utils";
import { BackButton } from "./button";

/* =============================================================
   BOTTOM NAVIGATION
============================================================= */
interface NavItem {
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
  isPOS?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeIndex, onSelect, className }) => (
  <nav className={cn("flex bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-2 pb-5", className)}>
    {items.map((item, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className={cn(
          "flex-1 flex flex-col items-center gap-1 py-1 cursor-pointer relative border-none bg-transparent",
          activeIndex === i ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
        )}
      >
        {item.isPOS ? (
          <span className="w-14 h-14 bg-[var(--color-primary)] rounded-[var(--radius-full)] flex items-center justify-center text-[24px] text-[var(--color-primary-foreground)] -mt-4 shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
            {item.icon}
          </span>
        ) : (
          <span className="w-6 h-6 flex items-center justify-center text-[20px] relative">
            {item.icon}
            {item.badgeCount != null && item.badgeCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] text-[9px] font-bold min-w-4 h-4 px-1 rounded-[var(--radius-full)] flex items-center justify-center">
                {item.badgeCount}
              </span>
            )}
          </span>
        )}
        <span className={cn("text-[10px] font-medium", activeIndex === i && "font-semibold")}>
          {item.label}
        </span>
      </button>
    ))}
  </nav>
);

/* =============================================================
   TAB NAVIGATION
============================================================= */
interface TabItem {
  label: string;
  count?: number;
}

interface TabNavProps {
  tabs: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, activeIndex, onSelect, className }) => (
  <div className={cn("flex border-b border-[var(--color-border)] bg-[var(--color-surface)]", className)}>
    {tabs.map((tab, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className={cn(
          "flex-1 text-center py-3.5 text-[var(--text-base)] font-medium border-b-2 cursor-pointer relative top-px",
          "transition-all duration-[120ms] border-none bg-transparent",
          i === activeIndex
            ? "text-[var(--color-foreground)] font-semibold border-b-2 border-[var(--color-foreground)]"
            : "text-[var(--color-muted-foreground)] border-b-2 border-transparent hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        )}
      >
        {tab.label}
        {tab.count != null && (
          <span className="ml-1.5 text-[var(--text-xs)]">({tab.count})</span>
        )}
      </button>
    ))}
  </div>
);

/* =============================================================
   PAGE HEADER
============================================================= */
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, onBack, rightAction, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-0 py-4",
        "bg-[var(--color-surface)] border-b border-[var(--color-border)]",
        className
      )}
      {...props}
    >
      {onBack && <BackButton onClick={onBack} />}
      <h1 className="text-[var(--text-lg)] font-semibold flex-1">{title}</h1>
      {rightAction}
    </header>
  )
);
PageHeader.displayName = "PageHeader";

export { BottomNav, TabNav, PageHeader };
