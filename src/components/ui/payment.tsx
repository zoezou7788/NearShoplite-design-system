import * as React from "react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/tokens";
import { PAYMENT_META } from "@/lib/tokens";

const payIconColors: Record<PaymentMethod, string> = {
  qr:   "bg-[var(--color-pay-qr)]",
  cash: "bg-[var(--color-pay-cash)]",
  link: "bg-[var(--color-pay-link)]",
  card: "bg-[var(--color-pay-card)]",
};

interface PaymentGridProps {
  selected?: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
}

const PaymentGrid: React.FC<PaymentGridProps> = ({ selected, onSelect, className }) => (
  <div className={cn("flex gap-3", className)}>
    {(Object.keys(PAYMENT_META) as PaymentMethod[]).map((method) => {
      const { icon, label } = PAYMENT_META[method];
      const isSelected = selected === method;
      return (
        <button
          key={method}
          onClick={() => onSelect(method)}
          className="flex-1 flex flex-col items-center gap-2 cursor-pointer border-none bg-transparent"
        >
          <span
            className={cn(
              "w-[60px] h-[60px] rounded-[var(--radius-xl)] flex items-center justify-center text-[26px]",
              "transition-opacity duration-[120ms] border-2",
              payIconColors[method],
              isSelected
                ? "border-[var(--color-primary)] shadow-[0_0_0_2px_var(--color-primary)]"
                : "border-transparent hover:opacity-85"
            )}
          >
            {icon}
          </span>
          <span className="text-[var(--text-xs)] font-medium text-[var(--color-foreground)]">{label}</span>
        </button>
      );
    })}
  </div>
);

export { PaymentGrid };
