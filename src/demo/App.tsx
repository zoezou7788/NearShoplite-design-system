import React, { useState } from "react";
import "../styles/globals.css";

import { Button, BackButton, SelectAttrButton } from "../components/ui/button";
import { StatusBadge, NavBadge, PillBadge, Dot } from "../components/ui/badge";
import { Pill, FilterRow } from "../components/ui/pill";
import { Tag, Divider } from "../components/ui/tag";
import { SearchBar, Input, Textarea } from "../components/ui/input";
import { AddButton, Stepper } from "../components/ui/stepper";
import { ProductCard, OrderCard, InfoCard, InfoCardTitle, InfoRow, SummaryCard, SummaryRow } from "../components/ui/card";
import { BottomNav, TabNav, PageHeader } from "../components/ui/navigation";
import { PaymentGrid } from "../components/ui/payment";
import { PriceHero, Countdown, OrderItem } from "../components/ui/price-hero";
import { Skeleton, ProductCardSkeleton, OrderCardSkeleton } from "../components/ui/skeleton";
import { Toast } from "../components/ui/toast";
import { EmptyState } from "../components/ui/empty-state";
import type { PaymentMethod } from "../lib/tokens";

const Section: React.FC<{ id: string; title: string; desc?: string; children: React.ReactNode }> = ({ id, title, desc, children }) => (
  <section id={id} style={{ marginBottom: 64, scrollMarginTop: 60 }}>
    <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 4 }}>{title}</h2>
    {desc && <p style={{ fontSize: 14, color: "var(--color-muted-foreground)", marginBottom: 24 }}>{desc}</p>}
    <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  </section>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "var(--space-2)" }}>
    {children}
  </div>
);

const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 16 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "flex-start", marginBottom: 24 }}>{children}</div>
);

export default function App() {
  const [qty, setQty] = useState(1);
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("qr");

  return (
    <div>
      {/* Header */}
      <header style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)", padding: "48px 40px 40px" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, letterSpacing: "-0.5px" }}>NearShop Lite</h1>
        <p style={{ fontSize: "var(--text-base)", color: "rgba(255,255,255,0.6)", marginTop: 6 }}>Design System & Component Library</p>
        <span style={{ display: "inline-block", background: "var(--color-accent)", color: "var(--color-accent-foreground)", fontSize: "var(--text-xs)", fontWeight: 600, padding: "3px 10px", borderRadius: "var(--radius-full)", marginTop: 16, letterSpacing: "0.5px", textTransform: "uppercase" }}>
          v1.1 · shadcn/ui aligned · React Component Library
        </span>
      </header>

      {/* Nav */}
      <nav style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "0 40px", position: "sticky", top: 0, zIndex: 100, display: "flex", overflowX: "auto" }}>
        {["Buttons","Badges","Pills","Inputs","Cards","Navigation","Payment","Feedback"].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{ textDecoration: "none", color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", fontWeight: 500, padding: "14px 16px", whiteSpace: "nowrap", borderBottom: "2px solid transparent" }}>
            {n}
          </a>
        ))}
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>

        {/* BUTTONS */}
        <Section id="buttons" title="Buttons" desc="CTA, Secondary, Danger variants + icon sizes">
          <Label>CTA Variants</Label>
          <Row>
            <div style={{ flex: 1, minWidth: 200 }}><Button variant="primary">Confirm Order</Button></div>
            <div style={{ flex: 1, minWidth: 200 }}><Button variant="secondary">View Details</Button></div>
            <div style={{ flex: 1, minWidth: 200 }}><Button variant="danger">Cancel Payment</Button></div>
          </Row>
          <Label>Disabled</Label>
          <Row>
            <div style={{ flex: 1, minWidth: 200 }}><Button variant="primary" disabled>Disabled</Button></div>
          </Row>
          <Label>Icon Sizes</Label>
          <Row gap={12}>
            <AddButton active />
            <AddButton active={false} />
            <BackButton />
            <SelectAttrButton>Select Size</SelectAttrButton>
          </Row>
        </Section>

        {/* BADGES */}
        <Section id="badges" title="Badges & Indicators" desc="Status badges, nav badges, dots">
          <Label>Status Badges</Label>
          <Row gap={8}>
            {(["completed","canceled","awaiting","pending","refunding","refunded"] as const).map(v => (
              <StatusBadge key={v} variant={v}>{v}</StatusBadge>
            ))}
          </Row>
          <Label>Dots & Counter Badges</Label>
          <Row gap={12}>
            <Dot />
            <Dot size="sm" />
            <div style={{ position: "relative", display: "inline-block", padding: "4px 8px" }}>
              <span>Orders</span>
              <NavBadge>3</NavBadge>
            </div>
            <Pill variant="active" style={{ position: "relative" }}>
              All <PillBadge>5</PillBadge>
            </Pill>
          </Row>
          <Label>Tags</Label>
          <Row gap={8}>
            <Tag>Medium</Tag>
            <Tag>Regular Ice</Tag>
            <Tag>No Sugar</Tag>
          </Row>
        </Section>

        {/* PILLS */}
        <Section id="pills" title="Filter Pills" desc="Scrollable category filter row">
          <FilterRow>
            <Pill variant="menu">☰</Pill>
            <Pill variant="active">All</Pill>
            <Pill variant="inactive">Beverages</Pill>
            <Pill variant="inactive">Food</Pill>
            <Pill variant="inactive">Snacks</Pill>
            <Pill variant="inactive">Desserts</Pill>
          </FilterRow>
        </Section>

        {/* INPUTS */}
        <Section id="inputs" title="Inputs" desc="Search bar, form input, textarea">
          <Label>Search Bar (Home)</Label>
          <div style={{ marginBottom: 16 }}>
            <SearchBar placeholder="Search products" showBarcodeButton />
          </div>
          <Label>Search Bar (Orders)</Label>
          <div style={{ marginBottom: 16 }}>
            <SearchBar placeholder="Search Orders..." />
          </div>
          <Label>Form Input</Label>
          <Row>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input label="Customer Name" placeholder="Enter name" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input label="Email" placeholder="email@example.com" hint="We'll send the receipt here" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input label="Promo Code" placeholder="Enter code" error="Invalid promo code" />
            </div>
          </Row>
          <Label>Textarea</Label>
          <Textarea label="Order Note" optional placeholder="Add special instructions..." />
          <div style={{ marginTop: 16 }}>
            <Label>Stepper</Label>
            <Stepper value={qty} onDecrement={() => setQty(q => Math.max(1, q - 1))} onIncrement={() => setQty(q => q + 1)} min={1} />
          </div>
        </Section>

        {/* CARDS */}
        <Section id="cards" title="Cards" desc="Product card, order card, info card, summary card">
          <Label>Product Cards</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <ProductCard name="Iced Matcha Latte" price="฿22.00" stock={12} stockLevel="normal" action={<AddButton active />} />
            <ProductCard name="Mango Sticky Rice" price="฿35.00" stock={5} stockLevel="low" action={<AddButton active />} />
            <ProductCard name="Thai Milk Tea" price="฿18.00" stock={0} stockLevel="out" action={<AddButton active={false} />} />
          </div>

          <Label>Order Cards</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <OrderCard orderId="#ORD-4821" meta="3 items · 14:32" amount="฿67.50" status="completed" />
            <OrderCard orderId="#ORD-4820" meta="1 item · 14:18" amount="฿22.00" status="awaiting" hasNotification />
            <OrderCard orderId="#ORD-4819" meta="2 items · 13:55" amount="฿44.00" status="pending" />
            <OrderCard orderId="#ORD-4818" meta="5 items · 12:30" amount="฿120.00" status="refunding" />
            <OrderCard orderId="#ORD-4817" meta="2 items · 11:00" amount="฿44.00" status="refunded" />
            <OrderCard orderId="#ORD-4816" meta="1 item · 10:45" amount="฿18.00" status="canceled" />
          </div>

          <Label>Info Card</Label>
          <div style={{ marginBottom: 24 }}>
            <InfoCard>
              <InfoCardTitle>Order Info</InfoCardTitle>
              <InfoRow label="Order ID" value="#ORD-4821" copyable />
              <InfoRow label="Date" value="Jun 8, 2026 · 14:32" />
              <InfoRow label="Payment" value="QR Code" />
              <InfoRow label="Customer" value="Sarah M." isLink />
            </InfoCard>
          </div>

          <Label>Summary Card</Label>
          <SummaryCard>
            <SummaryRow label="Subtotal" value="฿60.00" />
            <SummaryRow label="Discount" value="-฿5.00" />
            <SummaryRow label="Tax (7%)" value="฿3.85" />
            <Divider style={{ margin: "8px 0" }} />
            <SummaryRow label="Total" value="฿58.85" isTotal isDivider={false} />
          </SummaryCard>
        </Section>

        {/* NAVIGATION */}
        <Section id="navigation" title="Navigation" desc="Bottom nav, tab nav, page header">
          <Label>Page Header</Label>
          <div style={{ marginBottom: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden", padding: "0 16px" }}>
            <PageHeader title="Order #4821" onBack={() => {}} />
          </div>

          <Label>Tab Navigation</Label>
          <div style={{ marginBottom: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <TabNav tabs={[{ label: "All", count: 24 }, { label: "Pending" }, { label: "Completed" }]} activeIndex={activeTab} onSelect={setActiveTab} />
          </div>

          <Label>Bottom Navigation</Label>
          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <BottomNav
              activeIndex={activeNav}
              onSelect={setActiveNav}
              items={[
                { icon: "🏠", label: "Home" },
                { icon: "📋", label: "Orders", badgeCount: 3 },
                { icon: "＋", label: "POS", isPOS: true },
                { icon: "📦", label: "Products" },
                { icon: "⚙️", label: "Settings" },
              ]}
            />
          </div>
        </Section>

        {/* PAYMENT */}
        <Section id="payment" title="Payment & Checkout" desc="Payment method selector, price hero, countdown, order items">
          <Label>Price Hero</Label>
          <PriceHero amount="42.50" timestamp="Created at 14:32 · Jun 8" />
          <Divider style={{ margin: "16px 0" }} />

          <Label>Countdown</Label>
          <Row gap={12}>
            <Countdown time="12:45" />
            <Countdown time="04:32" urgent />
          </Row>

          <Label>Payment Methods</Label>
          <div style={{ marginBottom: 24 }}>
            <PaymentGrid selected={payment} onSelect={setPayment} />
          </div>

          <Label>Order Items</Label>
          <InfoCard>
            <InfoCardTitle>Items (3)</InfoCardTitle>
            <div style={{ padding: "0 16px" }}>
              <OrderItem name="Iced Matcha Latte" attrs="Medium · Regular Ice" quantity={2} price="฿44.00" />
              <OrderItem name="Thai Milk Tea" attrs="Large · Less Sugar" quantity={1} price="฿23.50" />
            </div>
          </InfoCard>
        </Section>

        {/* FEEDBACK */}
        <Section id="feedback" title="Feedback Components" desc="Toast, empty state, skeleton loading">
          <Label>Toast / Snackbar</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <Toast variant="default" onClose={() => {}}>Order #4821 confirmed successfully</Toast>
            <Toast variant="success" onClose={() => {}}>Payment received — ฿42.50</Toast>
            <Toast variant="error" onClose={() => {}}>Payment failed. Please try again.</Toast>
          </div>

          <Label>Empty State</Label>
          <div style={{ marginBottom: 24, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
            <EmptyState icon="📋" title="No orders yet" description="Orders will appear here once customers start placing them." />
          </div>

          <Label>Skeleton Loading</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ProductCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </Section>

      </div>
    </div>
  );
}
