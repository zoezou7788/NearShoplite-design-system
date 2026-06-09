import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";
import { Toast } from "../components/ui/toast";
import "../styles/globals.css";

/* ─────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1",  name: "Iced Matcha Latte",    category: "Beverages", price: 22,  cost: 8,  stock: 47, active: true  },
  { id: "2",  name: "Mango Sticky Rice",    category: "Desserts",  price: 35,  cost: 12, stock: 5,  active: true  },
  { id: "3",  name: "Thai Milk Tea",        category: "Beverages", price: 18,  cost: 6,  stock: 0,  active: false },
  { id: "4",  name: "Signature Coffee",     category: "Beverages", price: 28,  cost: 9,  stock: 23, active: true  },
  { id: "5",  name: "Coconut Jelly",        category: "Desserts",  price: 15,  cost: 4,  stock: 3,  active: true  },
  { id: "6",  name: "Spring Roll",          category: "Food",      price: 25,  cost: 10, stock: 12, active: true  },
  { id: "7",  name: "Red Bean Shaved Ice",  category: "Desserts",  price: 20,  cost: 7,  stock: 0,  active: false },
  { id: "8",  name: "Lemon Soda",           category: "Beverages", price: 16,  cost: 5,  stock: 4,  active: true  },
  { id: "9",  name: "BBQ Pork Bun",         category: "Food",      price: 12,  cost: 4,  stock: 31, active: true  },
  { id: "10", name: "Pineapple Cake",       category: "Snacks",    price: 30,  cost: 11, stock: 2,  active: true  },
];

const CATEGORIES = ["All", "Beverages", "Desserts", "Food", "Snacks"];

type SortKey = "name" | "price" | "stock";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const IconOrders = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <path d="M8 7h8M8 11h8M8 15h5"/>
  </svg>
);
const IconRegister = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <path d="M12 12v3M10.5 13.5h3"/>
  </svg>
);
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
  </svg>
);
const IconSettings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconBarcode = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="4" height="18" rx="1"/><rect x="9" y="3" width="2" height="18" rx="0.5"/>
    <rect x="13" y="3" width="4" height="18" rx="1"/><rect x="19" y="3" width="2" height="18" rx="0.5"/>
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);
const IconMenu = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="0" y1="2"  x2="16" y2="2"/>
    <line x1="0" y1="7"  x2="16" y2="7"/>
    <line x1="0" y1="12" x2="16" y2="12"/>
  </svg>
);

/* ─────────────────────────────────────────
   PRICE DISPLAY  ฿ 120.⁰⁰
───────────────────────────────────────── */
function PriceDisplay({ price }: { price: number }) {
  const [intPart, decPart] = price.toFixed(2).split(".");
  return (
    <span className="flex items-start gap-0.5 leading-none">
      <span className="text-[var(--text-sm)] font-medium mt-[3px] font-[var(--font-currency)]">฿</span>
      <span className="text-[var(--text-xl)] font-bold tracking-tight">{intPart}</span>
      <span className="text-[var(--text-xs)] font-semibold mt-[3px] text-[var(--color-muted-foreground)]">.{decPart}</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   STOCK LABEL
───────────────────────────────────────── */
function StockLabel({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="text-[var(--text-sm)] text-[var(--color-destructive)] font-medium">0 in stock</span>;
  if (stock <= 5)
    return <span className="text-[var(--text-sm)] text-[var(--color-accent)] font-medium">{stock} in stock</span>;
  return <span className="text-[var(--text-sm)] text-[var(--color-muted-foreground)]">{stock} in stock</span>;
}

/* ─────────────────────────────────────────
   TOGGLE
───────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative w-11 h-6 rounded-[var(--radius-full)] border-none cursor-pointer",
        "transition-colors duration-200 flex-shrink-0",
        checked ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"
      )}
    >
      <span className={cn(
        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm",
        "transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0.5"
      )} />
    </button>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD  (reference-aligned)
───────────────────────────────────────── */
interface ProductCardProps {
  product: Product;
  onToggle: () => void;
  onEdit:   () => void;
  onDelete: () => void;
}

function ProductCard({ product, onToggle, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className={cn(
      "bg-[var(--color-surface)] rounded-[var(--radius-lg)] mx-4 mb-2",
      "shadow-[var(--shadow-card)] overflow-hidden",
      !product.active && "opacity-55"
    )}>
      {/* Top section: name + price */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        {/* Name + stock */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-[var(--text-md)] font-semibold leading-snug",
            "text-[var(--color-foreground)]"
          )} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </p>
          <div className="mt-1">
            <StockLabel stock={product.stock} />
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 pt-0.5">
          <PriceDisplay price={product.price} />
        </div>
      </div>

      {/* Bottom section: cost tag + actions */}
      <div className="flex items-center justify-between px-4 pb-3">
        {/* Cost chip */}
        <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] bg-[var(--color-muted)] rounded-[var(--radius-full)] px-2 py-0.5">
          Cost ฿{product.cost}
        </span>

        {/* Action row */}
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors"
          >
            <IconEdit />
          </button>
          {/* Delete */}
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none text-[var(--color-destructive)] hover:bg-[var(--color-destructive-light)] transition-colors"
          >
            <IconTrash />
          </button>
          {/* Toggle */}
          <Toggle checked={product.active} onChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EDIT SHEET
───────────────────────────────────────── */
interface EditSheetProps {
  product: Product;
  onClose: () => void;
  onSave:  (p: Product) => void;
}

function EditSheet({ product, onClose, onSave }: EditSheetProps) {
  const [form, setForm] = useState<Product>(product);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)", borderRadius: 44 }}
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] px-5 pt-3 pb-8 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: "88%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[var(--text-lg)] font-semibold">Edit Product</h2>
          <button onClick={onClose} className="text-[var(--color-muted-foreground)] text-xl border-none bg-transparent cursor-pointer leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-muted)]">×</button>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-1.5">Product Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3.5 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-1.5">Category</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.filter(c => c !== "All").map(cat => (
              <button
                key={cat}
                onClick={() => setForm(f => ({ ...f, category: cat }))}
                className={cn(
                  "px-3 py-1.5 rounded-[var(--radius-full)] text-[var(--text-sm)] font-medium border-none cursor-pointer transition-all",
                  form.category === cat
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price / Cost / Stock */}
        <div className="grid grid-cols-3 gap-3">
          {([["Price ฿", "price"], ["Cost ฿", "cost"], ["Stock", "stock"]] as const).map(([label, key]) => (
            <div key={key}>
              <label className="block text-[var(--text-sm)] font-semibold mb-1.5">{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))}
                className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
              />
            </div>
          ))}
        </div>

        {/* Listed toggle */}
        <div className="flex items-center justify-between bg-[var(--color-muted)] rounded-[var(--radius-md)] px-4 py-3">
          <div>
            <p className="text-[var(--text-base)] font-semibold">Listed</p>
            <p className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] mt-0.5">Visible to customers</p>
          </div>
          <Toggle checked={form.active} onChange={() => setForm(f => ({ ...f, active: !f.active }))} />
        </div>

        <Button variant="primary" onClick={() => onSave(form)}>Save Changes</Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ProductManagementPage() {
  const [products, setProducts]   = useState<Product[]>(INITIAL_PRODUCTS);
  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<SortKey>("name");
  const [sortDesc, setSortDesc]   = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "default" | "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "default" | "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  };

  const stats = useMemo(() => ({
    total:  products.length,
    active: products.filter(p => p.active).length,
    low:    products.filter(p => p.stock > 0 && p.stock <= 5).length,
    out:    products.filter(p => p.stock === 0).length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const diff =
        sortKey === "name"  ? a.name.localeCompare(b.name) :
        sortKey === "price" ? a.price - b.price :
                              a.stock - b.stock;
      return sortDesc ? -diff : diff;
    });
    return list;
  }, [products, category, search, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(false); }
  };

  const handleToggle = (id: string) => {
    const p = products.find(x => x.id === id)!;
    setProducts(ps => ps.map(x => x.id === id ? { ...x, active: !x.active } : x));
    showToast(`"${p.name}" ${p.active ? "unlisted" : "listed"}`, "default");
  };

  const handleDelete = (id: string) => {
    const p = products.find(x => x.id === id)!;
    setProducts(ps => ps.filter(x => x.id !== id));
    showToast(`"${p.name}" deleted`, "error");
  };

  const handleSave = (updated: Product) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
    showToast("Product saved", "success");
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={cn(
        "flex items-center gap-0.5 text-[var(--text-xs)] font-semibold",
        "px-2.5 py-1 rounded-[var(--radius-full)] border-none cursor-pointer transition-colors",
        sortKey === k
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
      )}
    >
      {label}{sortKey === k && <span className="ml-0.5">{sortDesc ? "↓" : "↑"}</span>}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1C1C1E]">

      {/* ── iPhone 14 shell ── */}
      <div
        className="relative bg-[var(--color-background)] flex flex-col overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 44, boxShadow: "0 32px 80px rgba(0,0,0,0.55)" }}
      >

        {/* ── Status Bar ── */}
        <div
          className="flex justify-between items-center px-8 bg-[var(--color-surface)] flex-shrink-0"
          style={{ paddingTop: 16, paddingBottom: 4 }}
        >
          <span className="text-[13px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0"    y="4"   width="3" height="8"    rx="1"/>
              <rect x="4.5"  y="2.5" width="3" height="9.5"  rx="1"/>
              <rect x="9"    y="0.5" width="3" height="11.5" rx="1"/>
              <rect x="13.5" y="0"   width="3" height="12"   rx="1" opacity="0.3"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12.55a11 11 0 0114.08 0" strokeLinecap="round"/>
              <path d="M1.42 9a16 16 0 0121.16 0" strokeLinecap="round"/>
              <path d="M8.53 16.11a6 6 0 016.95 0" strokeLinecap="round"/>
              <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            <svg width="26" height="12" viewBox="0 0 26 12" fill="currentColor">
              <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <rect x="1.5" y="2.5" width="17" height="7" rx="1.5"/>
              <path d="M23.5 4.5v3a1.5 1.5 0 000-3z"/>
            </svg>
          </div>
        </div>

        {/* ── Top Header ── */}
        <div className="bg-[var(--color-surface)] px-4 pt-3 pb-3 flex-shrink-0">

          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[var(--text-2xl)] font-bold tracking-tight leading-tight">Products</h1>
              <p className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] mt-0.5">
                {stats.total} items · {stats.active} active
              </p>
            </div>
            <Button
              variant="primary" size="sm"
              onClick={() => showToast("Add product — coming soon", "default")}
              className="flex items-center gap-1 !px-3 !py-2 !text-[var(--text-sm)] !rounded-[var(--radius-lg)]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Active",        value: stats.active, color: "var(--color-success)",     bg: "var(--color-success-light)"     },
              { label: "Low Stock",     value: stats.low,    color: "var(--color-accent)",      bg: "var(--color-accent-light)"      },
              { label: "Out of Stock",  value: stats.out,    color: "var(--color-destructive)", bg: "var(--color-destructive-light)" },
            ].map(s => (
              <div
                key={s.label}
                className="flex flex-col items-center py-2 px-1 rounded-[var(--radius-md)]"
                style={{ background: s.bg }}
              >
                <span className="text-[22px] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[9px] font-semibold mt-1 leading-none text-center" style={{ color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[var(--color-input)] rounded-[var(--radius-full)] px-4 py-2.5">
              <span className="text-[var(--color-muted-foreground)]"><IconSearch /></span>
              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--text-base)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
              />
            </div>
            <button className="w-11 h-11 bg-[var(--color-input)] rounded-[var(--radius-full)] flex items-center justify-center flex-shrink-0 border-none cursor-pointer text-[var(--color-foreground)]">
              <IconBarcode />
            </button>
          </div>
        </div>

        {/* ── Category Pills ── */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex gap-2 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {/* Menu button */}
            <button className="flex items-center justify-center w-10 h-9 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-white flex-shrink-0 border-none cursor-pointer">
              <IconMenu />
            </button>
            {/* Category pills */}
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-4 h-9 rounded-[var(--radius-full)]",
                  "text-[var(--text-sm)] font-medium whitespace-nowrap flex-shrink-0 border-none cursor-pointer transition-all",
                  category === cat
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "border border-[1.5px] border-[var(--color-border)] bg-transparent text-[var(--color-foreground)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sort Bar ── */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-background)] flex-shrink-0">
          <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)]">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
          <div className="flex gap-1.5">
            <SortBtn k="name"  label="Name"  />
            <SortBtn k="price" label="Price" />
            <SortBtn k="stock" label="Stock" />
          </div>
        </div>

        {/* ── Product List ── */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={search ? "🔍" : "📦"}
              title={search ? "No products found" : "No products yet"}
              description={search ? `No results for "${search}"` : 'Tap "+ Add" to create your first product'}
            />
          ) : (
            <div className="pt-2 pb-6">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onToggle={() => handleToggle(p.id)}
                  onEdit={() => setEditing(p)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom Navigation ── */}
        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] flex-shrink-0">
          <div className="flex pt-2 pb-6">
            {([
              { icon: <IconHome />,     label: "Home",     active: false },
              { icon: <IconOrders />,   label: "Orders",   badge: 6 },
              { icon: null,             label: "POS",      pos: true },
              { icon: <IconBox />,      label: "Products", active: true },
              { icon: <IconSettings />, label: "Settings", active: false },
            ] as const).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 py-1">
                {"pos" in item && item.pos ? (
                  <span className="w-14 h-14 bg-[var(--color-primary)] rounded-full flex items-center justify-center -mt-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                    <IconRegister />
                  </span>
                ) : (
                  <span className={cn(
                    "relative",
                    "active" in item && item.active
                      ? "text-[var(--color-foreground)]"
                      : "text-[var(--color-muted-foreground)]"
                  )}>
                    {item.icon}
                    {"badge" in item && item.badge ? (
                      <span className="absolute -top-1 -right-1.5 bg-[var(--color-destructive)] text-white text-[9px] font-bold min-w-[15px] h-[15px] px-[3px] rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                )}
                <span className={cn(
                  "text-[10px]",
                  "active" in item && item.active
                    ? "font-semibold text-[var(--color-foreground)]"
                    : "font-medium text-[var(--color-muted-foreground)]"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Edit Sheet ── */}
        {editing && (
          <EditSheet
            product={editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}

        {/* ── Toast ── */}
        {toast && (
          <div className="absolute bottom-28 left-4 right-4 z-50">
            <Toast variant={toast.type} onClose={() => setToast(null)}>
              {toast.msg}
            </Toast>
          </div>
        )}

      </div>
    </div>
  );
}
