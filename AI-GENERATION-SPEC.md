# AI Generation Spec — NearShop Lite UI

> This file tells AI assistants (Claude, Copilot, Cursor, etc.) exactly how to generate
> high-fidelity UI using the `@nearshop/lite-ui` component library.  
> **Follow every rule below. Do not use inline styles, hardcoded hex colors, or raw CSS classes.**

---

## Core Rules

1. **Import only from `@nearshop/lite-ui`** — never write raw HTML/CSS for components that exist in this library.
2. **Import styles once at app root** — `import "@nearshop/lite-ui/styles"`.
3. **No hardcoded colors** — use CSS variable tokens (`var(--color-primary)`) or Tailwind token classes (`bg-primary`, `text-destructive`).
4. **No inline `style={{ color: "#..." }}`** — all colors live in the token system.
5. **Use TypeScript enums** — `OrderStatus`, `PaymentMethod`, `StockLevel` from `@nearshop/lite-ui`.
6. **Use `cn()` for conditional classes** — never string-concatenate class names.

---

## Page Templates

### Home — Product List Page

```tsx
import { SearchBar, FilterRow, Pill, ProductCard, AddButton, SelectAttrButton, BottomNav } from "@nearshop/lite-ui";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Search */}
      <div className="px-4 pt-4 pb-2 bg-[var(--color-surface)]">
        <SearchBar placeholder="Search products" showBarcodeButton onBarcodeClick={() => {}} />
      </div>

      {/* Category filter */}
      <div className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <FilterRow>
          <Pill variant="menu">☰</Pill>
          <Pill variant="active">All</Pill>
          <Pill variant="inactive">Beverages</Pill>
          <Pill variant="inactive">Food</Pill>
          <Pill variant="inactive">Snacks</Pill>
        </FilterRow>
      </div>

      {/* Product list */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <ProductCard name="Iced Matcha Latte" price="฿22.00" stock={12} stockLevel="normal"
          action={<AddButton active />} />
        <ProductCard name="Mango Sticky Rice" price="฿35.00" stock={5} stockLevel="low"
          action={<AddButton active />} />
        <ProductCard name="Thai Milk Tea" price="฿18.00" stock={0} stockLevel="out"
          action={<AddButton active={false} />} />
        <ProductCard name="Signature Blend" price="฿28.00" stock={8} stockLevel="normal"
          action={<SelectAttrButton>Select Size</SelectAttrButton>} />
      </div>

      {/* Bottom navigation */}
      <BottomNav
        activeIndex={0}
        onSelect={() => {}}
        items={[
          { icon: "🏠", label: "Home" },
          { icon: "📋", label: "Orders", badgeCount: 3 },
          { icon: "＋", label: "POS", isPOS: true },
          { icon: "📦", label: "Products" },
          { icon: "⚙️", label: "Settings" },
        ]}
      />
    </div>
  );
}
```

---

### Orders Page

```tsx
import { SearchBar, TabNav, OrderCard, EmptyState, OrderCardSkeleton, BottomNav } from "@nearshop/lite-ui";

export function OrdersPage() {
  const loading = false;
  const orders = [/* ... */];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="px-4 pt-4 pb-3 bg-[var(--color-surface)]">
        <SearchBar placeholder="Search Orders..." />
      </div>

      <TabNav
        tabs={[{ label: "All", count: 24 }, { label: "Pending" }, { label: "Completed" }]}
        activeIndex={0}
        onSelect={() => {}}
      />

      <div className="px-4 py-3 flex flex-col gap-2">
        {loading ? (
          <>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </>
        ) : orders.length === 0 ? (
          <EmptyState icon="📋" title="No orders yet" description="Orders will appear here once customers start placing them." />
        ) : (
          orders.map(o => (
            <OrderCard key={o.id} orderId={o.id} meta={o.meta} amount={o.amount} status={o.status} />
          ))
        )}
      </div>

      <BottomNav activeIndex={1} onSelect={() => {}} items={[
        { icon: "🏠", label: "Home" },
        { icon: "📋", label: "Orders", badgeCount: 3 },
        { icon: "＋", label: "POS", isPOS: true },
        { icon: "📦", label: "Products" },
        { icon: "⚙️", label: "Settings" },
      ]} />
    </div>
  );
}
```

---

### Order Detail Page

```tsx
import {
  PageHeader, StatusBadge, PriceHero, Countdown,
  InfoCard, InfoCardTitle, InfoRow, OrderItem,
  SummaryCard, SummaryRow, Divider, Button
} from "@nearshop/lite-ui";

export function OrderDetailPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="px-4 bg-[var(--color-surface)]">
        <PageHeader title="Order #4821" onBack={() => {}} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Status + timer */}
        <div className="flex items-center justify-between">
          <StatusBadge variant="pending">Pending Payment</StatusBadge>
          <Countdown time="12:45" />
        </div>

        {/* Price hero */}
        <PriceHero amount="42.50" timestamp="Created at 14:32 · Jun 8, 2026" />

        {/* Order info */}
        <InfoCard>
          <InfoCardTitle>Order Info</InfoCardTitle>
          <InfoRow label="Order ID" value="#ORD-4821" copyable
            onCopy={() => navigator.clipboard.writeText("#ORD-4821")} />
          <InfoRow label="Date" value="Jun 8, 2026 · 14:32" />
          <InfoRow label="Payment Method" value="QR Code" />
          <InfoRow label="Customer" value="Sarah M." isLink />
        </InfoCard>

        {/* Items */}
        <InfoCard>
          <InfoCardTitle>Items (2)</InfoCardTitle>
          <div className="px-4">
            <OrderItem name="Iced Matcha Latte" attrs="Medium · Regular Ice" quantity={2} price="฿44.00" />
            <OrderItem name="Thai Milk Tea" attrs="Large · Less Sugar" quantity={1} price="฿23.50" />
          </div>
        </InfoCard>

        {/* Summary */}
        <SummaryCard>
          <SummaryRow label="Subtotal" value="฿67.50" />
          <SummaryRow label="Discount" value="-฿5.00" />
          <SummaryRow label="Tax (7%)" value="฿4.38" />
          <Divider className="my-2" />
          <SummaryRow label="Total" value="฿66.88" isTotal isDivider={false} />
        </SummaryCard>

        {/* Actions */}
        <Button variant="primary">Confirm Payment</Button>
        <Button variant="danger">Cancel Order</Button>
      </div>
    </div>
  );
}
```

---

### Checkout / POS Page

```tsx
import {
  PageHeader, PriceHero, PaymentGrid,
  Textarea, Button, InfoCard, InfoCardTitle, OrderItem, SummaryCard, SummaryRow, Divider
} from "@nearshop/lite-ui";
import { useState } from "react";
import type { PaymentMethod } from "@nearshop/lite-ui";

export function CheckoutPage() {
  const [payment, setPayment] = useState<PaymentMethod>("qr");

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="px-4 bg-[var(--color-surface)]">
        <PageHeader title="Checkout" onBack={() => {}} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <PriceHero amount="42.50" />

        <PaymentGrid selected={payment} onSelect={setPayment} />

        <InfoCard>
          <InfoCardTitle>Order Items</InfoCardTitle>
          <div className="px-4">
            <OrderItem name="Iced Matcha Latte" attrs="Medium · Regular Ice" quantity={2} price="฿44.00" />
          </div>
        </InfoCard>

        <SummaryCard>
          <SummaryRow label="Subtotal" value="฿44.00" />
          <SummaryRow label="Tax" value="฿3.08" />
          <Divider className="my-2" />
          <SummaryRow label="Total" value="฿47.08" isTotal isDivider={false} />
        </SummaryCard>

        <Textarea label="Order Note" optional placeholder="Add special instructions..." />

        <Button variant="primary">Confirm Order — ฿47.08</Button>
        <Button variant="secondary">Save as Draft</Button>
      </div>
    </div>
  );
}
```

---

## Component Selection Guide

| UI Need | Use This |
|---------|----------|
| Product list item | `<ProductCard>` |
| Product with size variants | `<ProductCard action={<SelectAttrButton>Select Size</SelectAttrButton>}>` |
| Quantity control | `<Stepper>` or `<AddButton>` |
| Order list item | `<OrderCard>` |
| Order status pill | `<StatusBadge variant="completed">` |
| Category filter bar | `<FilterRow>` + `<Pill>` |
| Search input | `<SearchBar>` |
| Form field | `<Input label="..." hint="..." error="...">` |
| Multi-line note | `<Textarea label="..." optional>` |
| Key-value info row | `<InfoCard>` + `<InfoRow>` |
| Price breakdown | `<SummaryCard>` + `<SummaryRow>` |
| Large price display | `<PriceHero>` |
| Order countdown | `<Countdown time="12:45" urgent>` |
| Payment selector | `<PaymentGrid>` |
| Back + title bar | `<PageHeader title="..." onBack={...}>` |
| Tab switcher | `<TabNav>` |
| App bottom nav | `<BottomNav>` |
| Success/error feedback | `<Toast variant="success">` |
| Empty list | `<EmptyState>` |
| Loading state | `<ProductCardSkeleton>` or `<OrderCardSkeleton>` or `<Skeleton>` |
| Read-only attribute chip | `<Tag>` |
| Notification dot | `<Dot>` or `<NavBadge>` |

---

## Status Reference

| Status | Icon | Badge Color | When to use |
|--------|------|-------------|-------------|
| `completed` | ✓ | Green | Order fully paid & delivered |
| `canceled` | ✕ | Grey | Order voided |
| `awaiting` | ⏱ | Orange | Waiting for merchant action |
| `pending` | ● | Amber | Payment not yet received |
| `refunding` | ↺ | Blue | Refund in progress |
| `refunded` | ↩ | Grey (70%) | Refund completed |

---

## Token Quick Reference

```css
/* Use these in custom styles only — prefer components instead */

/* Brand */
var(--color-primary)          /* #1C1C1E — buttons, selected */
var(--color-accent)           /* #E8960C — low stock, pending, menu */
var(--color-destructive)      /* #EF4444 — danger, errors, out of stock */
var(--color-success)          /* #16A34A — completed, cash */
var(--color-warning)          /* #EA580C — awaiting */
var(--color-info)             /* #2563EB — refunding, links */
var(--color-pending)          /* #D97706 — pending payment */

/* Surface */
var(--color-background)       /* #F5F5F5 — page bg */
var(--color-surface)          /* #FFFFFF — cards, modals */
var(--color-muted)            /* #EFEFEF — input bg, tag bg */
var(--color-border)           /* #E5E7EB — borders */

/* Text */
var(--color-foreground)       /* #1C1C1E — primary text */
var(--color-muted-foreground) /* #8E8E93 — secondary text */
var(--color-foreground-disabled) /* #C7C7CC — disabled text */

/* Radius */
var(--radius-sm)    /* 8px  — tags, skeleton */
var(--radius-md)    /* 12px — inputs, state cards */
var(--radius-lg)    /* 16px — cards, buttons */
var(--radius-xl)    /* 20px — payment icons */
var(--radius-full)  /* 9999px — pills, badges, dots */

/* Spacing */
var(--space-4)  /* 16px — standard padding */
var(--space-6)  /* 24px — section gaps */
var(--space-12) /* 48px — page top padding */
```

---

## Anti-Patterns ❌

```tsx
// ❌ Hardcoded color
<div style={{ color: "#16A34A" }}>Completed</div>

// ✅ Use component
<StatusBadge variant="completed">Completed</StatusBadge>

// ❌ Raw hex in className
<span className="text-[#E8960C]">Low stock</span>

// ✅ Use token
<span className="text-[var(--color-accent)]">Low stock</span>

// ❌ Reimplement a card
<div style={{ background: "white", borderRadius: 16, padding: 16 }}>
  <p>Product name</p>
  <button>+</button>
</div>

// ✅ Use ProductCard
<ProductCard name="Product" price="฿22.00" stock={5} stockLevel="low"
  action={<AddButton active />} />

// ❌ Wrong stock color
<span style={{ color: "orange" }}>5 in stock</span>

// ✅ Let ProductCard handle it
<ProductCard stockLevel="low" stock={5} ... />

// ❌ Custom status badge
<span style={{ background: "green", color: "white" }}>COMPLETED</span>

// ✅ Use StatusBadge
<StatusBadge variant="completed">Completed</StatusBadge>
```

---

## Checklist Before Generating UI

- [ ] Every color reference uses a CSS variable or Tailwind token class
- [ ] Every status display uses `<StatusBadge variant="...">` or `<OrderCard status="...">`
- [ ] Product items use `<ProductCard>` — not raw `<div>`
- [ ] Loading states use `<ProductCardSkeleton>` or `<OrderCardSkeleton>`
- [ ] Empty lists show `<EmptyState>`
- [ ] Feedback messages use `<Toast>`
- [ ] Navigation uses `<BottomNav>` and `<TabNav>`
- [ ] All TypeScript types use enums from `@nearshop/lite-ui`
