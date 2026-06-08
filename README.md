# NearShop Lite UI

> React component library for the NearShop Lite merchant POS app.  
> shadcn/ui aligned · Tailwind CSS · TypeScript · CVA variants · v1.1

---

## Quick Start

### 1. Install

```bash
# In your project (npm / yarn / pnpm)
npm install @nearshop/lite-ui
```

Or copy-paste directly from `src/components/ui/` (shadcn/ui style, no runtime dependency on this package).

### 2. Import styles (once, at app root)

```tsx
// app/layout.tsx  or  main.tsx
import "@nearshop/lite-ui/styles";   // loads all CSS design tokens
```

### 3. Use components

```tsx
import {
  ProductCard, OrderCard, StatusBadge,
  Button, SearchBar, Pill, FilterRow,
  BottomNav, PaymentGrid, Toast,
} from "@nearshop/lite-ui";

// Product list item
<ProductCard
  name="Iced Matcha Latte"
  price="฿22.00"
  stock={12}
  stockLevel="normal"
  action={<AddButton active />}
/>

// Order with status badge
<OrderCard
  orderId="#ORD-4821"
  meta="3 items · 14:32"
  amount="฿67.50"
  status="completed"
/>

// Danger CTA button
<Button variant="danger">Cancel Payment</Button>

// Status badge standalone
<StatusBadge variant="pending">Pending Payment</StatusBadge>
```

---

## Dev Preview (local)

```bash
git clone https://github.com/zoezou7788/NearShoplite-design-system.git
cd NearShoplite-design-system
npm install
./node_modules/.bin/vite --port 5173
# Open http://localhost:5173
```

---

## Component API

### `<Button>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "danger"` | `"primary"` | Visual style |
| `size` | `"cta" \| "sm" \| "icon"` | `"cta"` | Size preset |
| `disabled` | `boolean` | `false` | Disabled state (0.4 opacity) |
| `...ButtonHTMLAttributes` | — | — | All native button props |

```tsx
<Button variant="primary">Confirm Order</Button>
<Button variant="secondary">View Details</Button>
<Button variant="danger">Cancel Payment</Button>
<Button variant="primary" disabled>Processing...</Button>
<Button variant="primary" size="sm">Small</Button>
```

### `<BackButton>`
Icon-only circular back button. Accepts all `button` HTML attributes. Renders a left-chevron SVG by default; pass children to override.

### `<SelectAttrButton>`
Pill-shaped primary button for "Select Size / Attribute" actions on ProductCard.

### `<AddButton>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `true` | When false: grey/disabled |

### `<Stepper>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current quantity |
| `onDecrement` | `() => void` | — | Called on − click |
| `onIncrement` | `() => void` | — | Called on + click |
| `min` | `number` | `0` | Disable − when reached |
| `max` | `number` | `undefined` | Disable + when reached |

---

### `<StatusBadge>`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"completed" \| "canceled" \| "awaiting" \| "pending" \| "refunding" \| "refunded"` | `"pending"` |

```tsx
<StatusBadge variant="completed">Completed</StatusBadge>
<StatusBadge variant="awaiting">Awaiting</StatusBadge>
```

### `<Dot>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md"` | `"md"` | 8px or 10px red dot |

### `<NavBadge>` · `<PillBadge>`
Counter badges — wrap content with a red bubble. Pass the count as children.

---

### `<Pill>` · `<FilterRow>`

```tsx
<FilterRow>
  <Pill variant="menu">☰</Pill>
  <Pill variant="active">All</Pill>
  <Pill variant="inactive">Beverages</Pill>
</FilterRow>
```

| Pill `variant` | Description |
|---|---|
| `menu` | Amber background — category menu toggle |
| `active` | Black background — selected filter |
| `inactive` | Bordered, transparent — unselected filter |

---

### `<Tag>` · `<Divider>`

```tsx
// Product attribute chips
<Tag>Medium</Tag>
<Tag>Regular Ice</Tag>

// Section separator
<Divider />
```

---

### `<SearchBar>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `"Search products"` | Input hint text |
| `showBarcodeButton` | `boolean` | `false` | Shows barcode scanner icon button |
| `onBarcodeClick` | `() => void` | — | Barcode button callback |

### `<Input>`

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Form label above input |
| `hint` | `string` | Helper text below input |
| `error` | `string` | Error message (turns border red) |
| `...InputHTMLAttributes` | — | All native input props |

### `<Textarea>`

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label above textarea |
| `optional` | `boolean` | Shows "(optional)" in label |

---

### `<ProductCard>`

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Product name (max 2 lines) |
| `price` | `string` | Price string e.g. `"฿22.00"` |
| `stock` | `number \| null` | Stock count (shows "X in stock" or "Out of stock") |
| `stockLevel` | `"normal" \| "low" \| "out"` | Controls stock text color |
| `image` | `ReactNode` | Optional image/icon on left |
| `action` | `ReactNode` | Action button on right (`AddButton` or `SelectAttrButton`) |

```tsx
// Normal stock
<ProductCard name="Iced Matcha Latte" price="฿22.00" stock={12} stockLevel="normal"
  action={<AddButton active />} />

// Low stock (amber)
<ProductCard name="Mango Sticky Rice" price="฿35.00" stock={5} stockLevel="low"
  action={<AddButton active />} />

// Select attribute variant
<ProductCard name="Signature Milk Tea" price="฿28.00" stock={8} stockLevel="normal"
  action={<SelectAttrButton>Select Size</SelectAttrButton>} />
```

### `<OrderCard>`

| Prop | Type | Description |
|------|------|-------------|
| `orderId` | `string` | Order ID string e.g. `"#ORD-4821"` |
| `meta` | `string` | Subtitle e.g. `"3 items · 14:32"` |
| `amount` | `string` | Total amount string |
| `status` | `OrderStatus` | One of the 6 order statuses |
| `hasNotification` | `boolean` | Shows red dot overlay |

### `<InfoCard>` · `<InfoCardTitle>` · `<InfoRow>`

```tsx
<InfoCard>
  <InfoCardTitle>Order Info</InfoCardTitle>
  <InfoRow label="Order ID" value="#ORD-4821" copyable onCopy={() => navigator.clipboard.writeText("#ORD-4821")} />
  <InfoRow label="Date" value="Jun 8, 2026 · 14:32" />
  <InfoRow label="Customer" value="Sarah M." isLink />
</InfoCard>
```

| InfoRow Prop | Type | Description |
|---|---|---|
| `label` | `string` | Left label |
| `value` | `ReactNode` | Right value |
| `isLink` | `boolean` | Blue color for clickable values |
| `copyable` | `boolean` | Shows copy icon |
| `onCopy` | `() => void` | Clipboard callback |

### `<SummaryCard>` · `<SummaryRow>`

```tsx
<SummaryCard>
  <SummaryRow label="Subtotal" value="฿60.00" />
  <SummaryRow label="Discount" value="-฿5.00" />
  <SummaryRow label="Total" value="฿58.85" isTotal isDivider={false} />
</SummaryCard>
```

---

### `<BottomNav>`

```tsx
<BottomNav
  activeIndex={0}
  onSelect={(i) => setActive(i)}
  items={[
    { icon: "🏠", label: "Home" },
    { icon: "📋", label: "Orders", badgeCount: 3 },
    { icon: "＋", label: "POS", isPOS: true },
    { icon: "📦", label: "Products" },
    { icon: "⚙️", label: "Settings" },
  ]}
/>
```

### `<TabNav>`

```tsx
<TabNav
  tabs={[{ label: "All", count: 24 }, { label: "Pending" }, { label: "Completed" }]}
  activeIndex={0}
  onSelect={(i) => setTab(i)}
/>
```

### `<PageHeader>`

```tsx
<PageHeader title="Order #4821" onBack={() => router.back()} />
```

---

### `<PaymentGrid>`

```tsx
const [payment, setPayment] = useState<PaymentMethod>("qr");

<PaymentGrid selected={payment} onSelect={setPayment} />
```

Renders all 4 methods: QR Code · Cash · Pay Link · Card.

### `<PriceHero>`

```tsx
<PriceHero amount="42.50" currencySymbol="฿" timestamp="Created at 14:32 · Jun 8" />
```

### `<Countdown>`

```tsx
<Countdown time="12:45" />           // normal (amber border)
<Countdown time="04:32" urgent />    // urgent (red border + pulse)
```

### `<OrderItem>`

```tsx
<OrderItem name="Iced Matcha Latte" attrs="Medium · Regular Ice" quantity={2} price="฿44.00" />
```

---

### `<Toast>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "success" \| "error"` | `"default"` | Color scheme |
| `onClose` | `() => void` | — | Shows × button |

```tsx
<Toast variant="success" onClose={() => {}}>Payment received — ฿42.50</Toast>
<Toast variant="error" onClose={() => {}}>Payment failed. Try again.</Toast>
```

### `<EmptyState>`

```tsx
<EmptyState icon="📋" title="No orders yet" description="Orders will appear here once customers start placing them." />
```

### `<Skeleton>` · `<ProductCardSkeleton>` · `<OrderCardSkeleton>`

```tsx
// Base primitive — compose any loading shape
<Skeleton style={{ width: 48, height: 48, borderRadius: "var(--radius-full)" }} />

// Preset loading placeholders
<ProductCardSkeleton />
<OrderCardSkeleton />
```

---

## Design Tokens

All tokens are CSS custom properties in `globals.css`. Override at `:root` in your app to rebrand.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1C1C1E` | Brand action color (buttons, selected state) |
| `--color-accent` | `#E8960C` | Brand highlight (low stock, menu pill, pending) |
| `--color-destructive` | `#EF4444` | Danger actions, error, out-of-stock |
| `--color-success` | `#16A34A` | Completed orders, cash payment |
| `--color-warning` | `#EA580C` | Awaiting order status |
| `--color-info` | `#2563EB` | Refund in progress, links |
| `--color-pending` | `#D97706` | Pending payment status |
| `--color-background` | `#F5F5F5` | Page background |
| `--color-surface` | `#FFFFFF` | Card / modal background |
| `--color-muted` | `#EFEFEF` | Input background, tag background |
| `--color-border` | `#E5E7EB` | Borders, dividers |
| `--color-ring` | `#1C1C1E` | Focus outline |

### Token Usage Rules

| Use `--color-accent` for | Use `--color-warning` for |
|---|---|
| Low stock text (5 in stock) | Awaiting Order status |
| Category menu button | Link payment method |
| Countdown normal border | ✗ NOT brand elements |
| Pending Payment state | ✗ NOT inventory display |

### Typography Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-4xl` | 40px | Price hero amount |
| `--text-3xl` | 32px | Doc headings |
| `--text-2xl` | 24px | Section titles |
| `--text-xl` | 20px | Sub-headers |
| `--text-lg` | 18px | Page title |
| `--text-md` | 16px | Product name, item name |
| `--text-base` | 15px | Body, order ID, tab label |
| `--text-sm` | 13px | Stock, meta, secondary |
| `--text-xs` | 11px | Badges, nav labels |

### Spacing (4px base grid)

`--space-1` (4px) → `--space-2` (8px) → `--space-3` (12px) → `--space-4` (16px) → `--space-5` (20px) → `--space-6` (24px) → `--space-8` (32px) → `--space-10` (40px) → `--space-12` (48px) → `--space-16` (64px)

---

## TypeScript Enums

```ts
import { OrderStatus, PaymentMethod, StockLevel, BadgeVariant } from "@nearshop/lite-ui";

// Compile-time safe status
const status: OrderStatus = "completed";  // ✅
const status: OrderStatus = "done";       // ❌ TS error

// Status display metadata (icon, label, badge variant)
import { ORDER_STATUS_META } from "@nearshop/lite-ui";
const { icon, label } = ORDER_STATUS_META["completed"];  // { icon: "✓", label: "Completed" }
```

---

## File Structure

```
src/
  styles/globals.css          — CSS design tokens (43 variables)
  lib/
    tokens.ts                 — TypeScript enums & status metadata
    utils.ts                  — cn() utility (clsx + tailwind-merge)
  components/ui/
    button.tsx                — Button, BackButton, SelectAttrButton
    badge.tsx                 — StatusBadge, NavBadge, PillBadge, Dot
    pill.tsx                  — Pill, FilterRow
    tag.tsx                   — Tag, Divider
    input.tsx                 — SearchBar, Input, Textarea
    stepper.tsx               — AddButton, Stepper
    card.tsx                  — ProductCard, OrderCard, InfoCard, InfoRow, SummaryCard
    navigation.tsx            — BottomNav, TabNav, PageHeader
    payment.tsx               — PaymentGrid
    price-hero.tsx            — PriceHero, Countdown, OrderItem
    skeleton.tsx              — Skeleton, ProductCardSkeleton, OrderCardSkeleton
    toast.tsx                 — Toast
    empty-state.tsx           — EmptyState
    index.ts                  — barrel export (all components + tokens)
```

---

## License

Internal use — NearGo © 2026
