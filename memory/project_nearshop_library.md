---
name: nearshop-lite-component-library
description: NearShop Lite design system converted to React component library — structure, tech stack, and component inventory
metadata:
  type: project
---

NearShop Lite 从单一 HTML 文件封装为 React/TS 组件库（`@nearshop/lite-ui`）。

**Why:** UI/前端/产品需要直接调用组件库而非手动查阅 HTML 文档，参考 neargo-oms-design-system 的结构。

**How to apply:** 新增组件遵循现有结构，所有颜色用 CSS 变量，variant 用 CVA 定义。

## 文件结构
```
src/
  styles/globals.css        — 设计 token（CSS 变量）+ Tailwind base
  lib/
    tokens.ts               — TypeScript 枚举（OrderStatus, PaymentMethod 等）
    utils.ts                — cn() 工具函数
  components/ui/
    button.tsx              — Button, SelectAttrButton, BackButton
    badge.tsx               — StatusBadge, NavBadge, PillBadge, Dot
    pill.tsx                — Pill, FilterRow
    tag.tsx                 — Tag, Divider
    input.tsx               — SearchBar, Input, Textarea
    stepper.tsx             — AddButton, Stepper
    card.tsx                — ProductCard, OrderCard, InfoCard, SummaryCard
    navigation.tsx          — BottomNav, TabNav, PageHeader
    payment.tsx             — PaymentGrid
    price-hero.tsx          — PriceHero, Countdown, OrderItem
    skeleton.tsx            — Skeleton, ProductCardSkeleton, OrderCardSkeleton
    toast.tsx               — Toast
    empty-state.tsx         — EmptyState
    index.ts                — barrel export
  demo/
    App.tsx                 — 组件库预览 app
    main.tsx
```

## Tech Stack
- React 18 + TypeScript + Tailwind CSS v3
- CVA (class-variance-authority) for variant props
- shadcn/ui 架构（CSS 变量 token，copy-paste pattern）
- Vite + vite-plugin-dts 构建库

## Dev Server
运行：`./node_modules/.bin/vite --port 5173`（npm/npx 在此环境有 EPERM 问题）
预览地址：http://localhost:5173
