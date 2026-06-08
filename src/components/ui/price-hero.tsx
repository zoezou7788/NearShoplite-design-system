import * as React from "react";
import { cn } from "@/lib/utils";

interface PriceHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string;
  currencySymbol?: string;
  timestamp?: string;
}

const PriceHero = React.forwardRef<HTMLDivElement, PriceHeroProps>(
  ({ className, amount, currencySymbol = "฿", timestamp, ...props }, ref) => (
    <div ref={ref} className={cn("text-center py-6 pb-4", className)} {...props}>
      <div className="text-[var(--text-4xl)] font-bold tracking-[-1px] flex items-start justify-center gap-1.5">
        <span className="text-[var(--text-2xl)] mt-1.5 font-medium font-[var(--font-currency)]">
          {currencySymbol}
        </span>
        <span>{amount}</span>
      </div>
      {timestamp && (
        <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] mt-2">{timestamp}</p>
      )}
    </div>
  )
);
PriceHero.displayName = "PriceHero";

/* ── Countdown Timer ── */
interface CountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  time: string;
  urgent?: boolean;
}

const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(
  ({ className, time, urgent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3.5 py-[5px]",
        "text-[var(--text-sm)] font-semibold border border-[1.5px]",
        urgent
          ? "border-[var(--color-destructive)] text-[var(--color-destructive)] animate-[pulse_1s_infinite]"
          : "border-[var(--color-accent)] text-[var(--color-accent)]",
        className
      )}
      {...props}
    >
      ⏱ {time}
    </div>
  )
);
Countdown.displayName = "Countdown";

/* ── Order Item Row ── */
interface OrderItemProps {
  name: string;
  attrs?: string;
  quantity: number;
  price: string;
  className?: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ name, attrs, quantity, price, className }) => (
  <div className={cn("py-3 border-b border-[var(--color-background)] last:border-b-0", className)}>
    <div className="flex justify-between gap-3">
      <span className="text-[var(--text-base)] font-semibold flex-1">{name}</span>
      <span className="text-[var(--text-base)] font-semibold">{price}</span>
    </div>
    {attrs && <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] mt-0.5">{attrs}</p>}
    <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] mt-0.5 text-right">× {quantity}</p>
  </div>
);

export { PriceHero, Countdown, OrderItem };
