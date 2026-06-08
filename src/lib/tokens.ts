/* Design token enums — compile-time variant validation */

export const OrderStatus = {
  COMPLETED: "completed",
  CANCELED:  "canceled",
  AWAITING:  "awaiting",
  REFUNDED:  "refunded",
  REFUNDING: "refunding",
  PENDING:   "pending",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const StockLevel = {
  NORMAL: "normal",
  LOW:    "low",
  OUT:    "out",
} as const;
export type StockLevel = (typeof StockLevel)[keyof typeof StockLevel];

export const PaymentMethod = {
  QR:   "qr",
  CASH: "cash",
  LINK: "link",
  CARD: "card",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const ButtonVariant = {
  PRIMARY:   "primary",
  SECONDARY: "secondary",
  DANGER:    "danger",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ToastVariant = {
  DEFAULT: "default",
  SUCCESS: "success",
  ERROR:   "error",
} as const;
export type ToastVariant = (typeof ToastVariant)[keyof typeof ToastVariant];

export const BadgeVariant = {
  COMPLETED: "completed",
  CANCELED:  "canceled",
  AWAITING:  "awaiting",
  PENDING:   "pending",
  REFUNDING: "refunding",
  REFUNDED:  "refunded",
} as const;
export type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant];

/* Status display metadata — icon + label for each order status */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { icon: string; label: string; badge: BadgeVariant }
> = {
  completed: { icon: "✓",  label: "Completed",          badge: "completed" },
  canceled:  { icon: "✕",  label: "Canceled",           badge: "canceled"  },
  awaiting:  { icon: "⏱",  label: "Awaiting",           badge: "awaiting"  },
  refunded:  { icon: "↩",  label: "Refunded",           badge: "refunded"  },
  refunding: { icon: "↺",  label: "Refund in Progress", badge: "refunding" },
  pending:   { icon: "●",  label: "Pending Payment",    badge: "pending"   },
};

/* Payment method display metadata */
export const PAYMENT_META: Record<PaymentMethod, { icon: string; label: string }> = {
  qr:   { icon: "📱", label: "QR Code"   },
  cash: { icon: "💵", label: "Cash"      },
  link: { icon: "🔗", label: "Pay Link"  },
  card: { icon: "💳", label: "Card"      },
};
