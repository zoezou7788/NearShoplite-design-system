import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, StockLevel } from "@/lib/tokens";
import { ORDER_STATUS_META } from "@/lib/tokens";
import { StatusBadge } from "./badge";

/* =============================================================
   PRODUCT CARD
============================================================= */
interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  price: string;
  stock?: number | null;
  stockLevel?: StockLevel;
  image?: React.ReactNode;
  action?: React.ReactNode;
}

const stockColors: Record<string, string> = {
  normal: "text-[var(--color-muted-foreground)]",
  low:    "text-[var(--color-accent)]",
  out:    "text-[var(--color-destructive)]",
};

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, name, price, stock, stockLevel = "normal", image, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4",
        "flex items-center justify-between gap-3",
        "shadow-[var(--shadow-card)] transition-shadow duration-[120ms]",
        "active:shadow-none active:bg-[var(--color-muted)]",
        className
      )}
      {...props}
    >
      {image && <div className="flex-shrink-0">{image}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-md)] font-semibold text-[var(--color-foreground)] line-clamp-2">
          {name}
        </p>
        {stock != null && (
          <p className={cn("text-[var(--text-sm)] mt-1", stockColors[stockLevel])}>
            {stock === 0 ? "Out of stock" : `${stock} in stock`}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
        <span className="text-[var(--text-md)] font-bold text-[var(--color-foreground)] whitespace-nowrap">
          {price}
        </span>
        {action}
      </div>
    </div>
  )
);
ProductCard.displayName = "ProductCard";

/* =============================================================
   ORDER CARD
============================================================= */
interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  orderId: string;
  meta: string;
  amount: string;
  status: OrderStatus;
  hasNotification?: boolean;
}

const orderIconColors: Record<OrderStatus, string> = {
  completed: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  canceled:  "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
  awaiting:  "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  refunded:  "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] opacity-70",
  refunding: "bg-[var(--color-info-light)] text-[var(--color-info)]",
  pending:   "bg-[var(--color-pending-light)] text-[var(--color-pending)]",
};

const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  ({ className, orderId, meta, amount, status, hasNotification, ...props }, ref) => {
    const statusMeta = ORDER_STATUS_META[status];
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4",
          "flex items-center gap-3.5 relative",
          "shadow-[var(--shadow-card)] transition-shadow duration-[120ms]",
          "active:shadow-none active:bg-[var(--color-muted)]",
          className
        )}
        {...props}
      >
        <div className={cn("w-11 h-11 rounded-[var(--radius-full)] flex items-center justify-center text-[20px] flex-shrink-0", orderIconColors[status])}>
          {statusMeta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[var(--text-base)] font-semibold">{orderId}</p>
          <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] mt-0.5">{meta}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[var(--text-base)] font-bold">{amount}</p>
          <StatusBadge variant={statusMeta.badge} className="mt-0.5">
            {statusMeta.label}
          </StatusBadge>
        </div>
        {hasNotification && (
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-[var(--radius-full)] bg-[var(--color-destructive)] border-2 border-[var(--color-surface)]" />
        )}
      </div>
    );
  }
);
OrderCard.displayName = "OrderCard";

/* =============================================================
   INFO CARD (order detail rows)
============================================================= */
const InfoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]", className)}
      {...props}
    />
  )
);
InfoCard.displayName = "InfoCard";

const InfoCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-[var(--text-base)] font-semibold px-4 pt-4 pb-3", className)}
      {...props}
    />
  )
);
InfoCardTitle.displayName = "InfoCardTitle";

export interface InfoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row label (left side) */
  label: string;
  /** Row value — any React node (right side) */
  value?: React.ReactNode;
  /** Renders value in info blue (e.g. clickable links) */
  isLink?: boolean;
  /** Shows a copy icon button; wire up `onCopy` for clipboard action */
  copyable?: boolean;
  /** Callback when the copy button is clicked */
  onCopy?: () => void;
}

const InfoRow = React.forwardRef<HTMLDivElement, InfoRowProps>(
  ({ className, label, value, isLink, copyable, onCopy, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex justify-between items-center px-4 py-[11px] border-t border-[var(--color-background)]", className)}
      {...props}
    >
      <span className="text-[var(--text-sm)] text-[var(--color-muted-foreground)]">{label}</span>
      <span className={cn("text-[var(--text-sm)] font-medium flex items-center gap-1", isLink ? "text-[var(--color-info)]" : "text-[var(--color-foreground)]")}>
        {value}
        {copyable && (
          <button onClick={onCopy} className="border-none bg-transparent text-[var(--color-muted-foreground)] cursor-pointer pl-1 text-[14px] leading-none">⎘</button>
        )}
      </span>
    </div>
  )
);
InfoRow.displayName = "InfoRow";

/* =============================================================
   SUMMARY CARD (price breakdown)
============================================================= */
const SummaryCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)]", className)}
      {...props}
    />
  )
);
SummaryCard.displayName = "SummaryCard";

interface SummaryRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  isTotal?: boolean;
  isDivider?: boolean;
}

const SummaryRow = React.forwardRef<HTMLDivElement, SummaryRowProps>(
  ({ className, label, value, isTotal, isDivider, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex justify-between items-center py-[7px]",
        isDivider && "border-t border-[var(--color-border)] mt-2 pt-3",
        className
      )}
      {...props}
    >
      <span className={cn("text-[var(--text-sm)] text-[var(--color-muted-foreground)]", isTotal && "text-[var(--text-base)] font-bold text-[var(--color-foreground)]")}>
        {label}
      </span>
      <span className={cn("text-[var(--text-sm)] text-[var(--color-muted-foreground)]", isTotal && "text-[var(--text-base)] font-bold text-[var(--color-foreground)]")}>
        {value}
      </span>
    </div>
  )
);
SummaryRow.displayName = "SummaryRow";

export {
  ProductCard,
  OrderCard,
  InfoCard,
  InfoCardTitle,
  InfoRow,
  SummaryCard,
  SummaryRow,
};
