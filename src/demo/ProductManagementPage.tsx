import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import { SearchBar } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";
import { ProductCardSkeleton } from "../components/ui/skeleton";
import { Toast } from "../components/ui/toast";
import "../styles/globals.css";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
  image: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1",  name: "Iced Matcha Latte",    category: "Beverages", price: 22, cost: 8,  stock: 47, active: true,  image: "🍵" },
  { id: "2",  name: "Mango Sticky Rice",    category: "Desserts",  price: 35, cost: 12, stock: 5,  active: true,  image: "🥭" },
  { id: "3",  name: "Thai Milk Tea",        category: "Beverages", price: 18, cost: 6,  stock: 0,  active: false, image: "🧋" },
  { id: "4",  name: "Signature Coffee",     category: "Beverages", price: 28, cost: 9,  stock: 23, active: true,  image: "☕" },
  { id: "5",  name: "Coconut Jelly",        category: "Desserts",  price: 15, cost: 4,  stock: 3,  active: true,  image: "🥥" },
  { id: "6",  name: "Spring Roll",          category: "Food",      price: 25, cost: 10, stock: 12, active: true,  image: "🥚" },
  { id: "7",  name: "Red Bean Shaved Ice",  category: "Desserts",  price: 20, cost: 7,  stock: 0,  active: false, image: "🧊" },
  { id: "8",  name: "Lemon Soda",           category: "Beverages", price: 16, cost: 5,  stock: 4,  active: true,  image: "🍋" },
  { id: "9",  name: "BBQ Pork Bun",         category: "Food",      price: 12, cost: 4,  stock: 31, active: true,  image: "🫔" },
  { id: "10", name: "Pineapple Cake",       category: "Snacks",    price: 30, cost: 11, stock: 2,  active: true,  image: "🍍" },
];

type TabKey  = "all" | "active" | "low" | "out";
type SortKey = "name" | "price" | "stock";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",    label: "All"       },
  { key: "active", label: "Active"    },
  { key: "low",    label: "Low Stock" },
  { key: "out",    label: "Out"       },
];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function StockBadge({ stock }: { stock: number }) {
  const base = "text-[var(--text-xs)] font-semibold px-2 py-0.5 rounded-[var(--radius-full)] whitespace-nowrap";
  if (stock === 0)
    return <span className={`${base} text-[var(--color-destructive)] bg-[var(--color-destructive-light)]`}>Out of stock</span>;
  if (stock <= 5)
    return <span className={`${base} text-[var(--color-accent)] bg-[var(--color-accent-light)]`}>{stock} left</span>;
  return <span className={`${base} text-[var(--color-success)] bg-[var(--color-success-light)]`}>{stock} in stock</span>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative w-11 h-6 rounded-[var(--radius-full)] border-none cursor-pointer transition-colors duration-200 flex-shrink-0",
        checked ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"
      )}
    >
      <span className={cn(
        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0.5"
      )} />
    </button>
  );
}

interface ProductRowProps {
  product: Product;
  onToggle: () => void;
  onEdit:   () => void;
  onDelete: () => void;
}

function ProductRow({ product, onToggle, onEdit, onDelete }: ProductRowProps) {
  const [swiped, setSwiped] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Delete reveal */}
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[var(--color-destructive)]">
        <button
          onClick={() => { setSwiped(false); onDelete(); }}
          className="flex flex-col items-center gap-1 text-white border-none bg-transparent cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
          <span className="text-[10px] font-semibold">Delete</span>
        </button>
      </div>

      {/* Main row */}
      <div className={cn(
        "relative bg-[var(--color-surface)] transition-transform duration-200 ease-out",
        swiped ? "-translate-x-20" : "translate-x-0"
      )}>
        <div className={cn("flex items-center gap-3 px-4 py-3", !product.active && "opacity-50")}>

          {/* Thumbnail */}
          <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-muted)] flex items-center justify-center text-xl flex-shrink-0">
            {product.image}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-base)] font-semibold text-[var(--color-foreground)] truncate leading-snug">
              {product.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[var(--text-sm)] font-bold text-[var(--color-foreground)] whitespace-nowrap">
                ฿{product.price.toFixed(2)}
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] whitespace-nowrap">
                · Cost ฿{product.cost}
              </span>
              <StockBadge stock={product.stock} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Edit */}
            <button onClick={onEdit}
              className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none hover:bg-[var(--color-border)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            {/* Delete trigger */}
            <button onClick={() => setSwiped(s => !s)}
              className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none hover:bg-[var(--color-destructive-light)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-destructive)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
            {/* Toggle */}
            <Toggle checked={product.active} onChange={onToggle} />
          </div>
        </div>
        <div className="h-px bg-[var(--color-background)] mx-4" />
      </div>
    </div>
  );
}

/* ── Edit Bottom Sheet ── */
interface EditSheetProps {
  product: Product | null;
  onClose: () => void;
  onSave:  (p: Product) => void;
}

function EditSheet({ product, onClose, onSave }: EditSheetProps) {
  const [form, setForm] = useState<Product | null>(product);
  if (!form) return null;

  const field = (label: string, key: keyof Product, type = "text") => (
    <div>
      <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={e => setForm(f => f ? { ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value } : f)}
        className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3.5 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
      />
    </div>
  );

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)", borderRadius: 44 }}
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] px-5 pt-4 pb-8 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: "88%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[var(--text-lg)] font-semibold">Edit Product</h2>
          <button onClick={onClose} className="text-[var(--color-muted-foreground)] text-xl border-none bg-transparent cursor-pointer leading-none">×</button>
        </div>

        {/* Icon picker */}
        <div>
          <p className="text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-2">Icon</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["🍵","🧋","☕","🍋","🥭","🥥","🫔","🍍","🥚","🧊"].map(e => (
              <button key={e}
                onClick={() => setForm(f => f ? { ...f, image: e } : f)}
                className={cn(
                  "w-12 h-12 rounded-[var(--radius-md)] text-2xl border-2 flex-shrink-0 cursor-pointer transition-all",
                  form.image === e
                    ? "border-[var(--color-primary)] bg-[var(--color-muted)]"
                    : "border-transparent bg-[var(--color-muted)]"
                )}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        {field("Product Name", "name")}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[var(--text-sm)] font-semibold mb-1">Price ฿</label>
            <input type="number" value={form.price}
              onChange={e => setForm(f => f ? { ...f, price: Number(e.target.value) } : f)}
              className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
            />
          </div>
          <div>
            <label className="block text-[var(--text-sm)] font-semibold mb-1">Cost ฿</label>
            <input type="number" value={form.cost}
              onChange={e => setForm(f => f ? { ...f, cost: Number(e.target.value) } : f)}
              className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
            />
          </div>
          <div>
            <label className="block text-[var(--text-sm)] font-semibold mb-1">Stock</label>
            <input type="number" value={form.stock}
              onChange={e => setForm(f => f ? { ...f, stock: Number(e.target.value) } : f)}
              className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
            />
          </div>
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
  const [products, setProducts]         = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab]       = useState<TabKey>("all");
  const [search, setSearch]             = useState("");
  const [sortKey, setSortKey]           = useState<SortKey>("name");
  const [sortDesc, setSortDesc]         = useState(false);
  const [editingProduct, setEditing]    = useState<Product | null>(null);
  const [toast, setToast]               = useState<{ msg: string; type: "default" | "success" | "error" } | null>(null);

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
    if (activeTab === "active") list = list.filter(p => p.active);
    if (activeTab === "low")    list = list.filter(p => p.stock > 0 && p.stock <= 5);
    if (activeTab === "out")    list = list.filter(p => p.stock === 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const diff =
        sortKey === "name"  ? a.name.localeCompare(b.name) :
        sortKey === "price" ? a.price - b.price :
                              a.stock - b.stock;
      return sortDesc ? -diff : diff;
    });
    return list;
  }, [products, activeTab, search, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(false); }
  };

  const handleToggle = (id: string) => {
    const p = products.find(p => p.id === id)!;
    setProducts(ps => ps.map(x => x.id === id ? { ...x, active: !x.active } : x));
    showToast(`"${p.name}" ${p.active ? "unlisted" : "listed"}`, "default");
  };

  const handleDelete = (id: string) => {
    const p = products.find(p => p.id === id)!;
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
        "flex items-center gap-0.5 text-[var(--text-xs)] font-semibold px-2 py-1 rounded-[var(--radius-sm)] border-none cursor-pointer transition-colors",
        sortKey === k
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
      )}
    >
      {label}{sortKey === k && <span className="ml-0.5">{sortDesc ? "↓" : "↑"}</span>}
    </button>
  );

  const tabCount = (key: TabKey) =>
    key === "active" ? stats.active : key === "low" ? stats.low : stats.out;

  const tabCountColor = (key: TabKey) =>
    key === "active" ? "text-[var(--color-success)]" :
    key === "low"    ? "text-[var(--color-accent)]"   :
                       "text-[var(--color-destructive)]";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1C1C1E]">

      {/* ── iPhone 14 shell ── */}
      <div
        className="relative bg-[var(--color-background)] flex flex-col overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 44, boxShadow: "0 32px 80px rgba(0,0,0,0.55)" }}
      >

        {/* Status Bar */}
        <div className="flex justify-between items-center px-8 bg-[var(--color-surface)] flex-shrink-0" style={{ paddingTop: 16, paddingBottom: 4 }}>
          <span className="text-[13px] font-semibold tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0"   y="4"   width="3" height="8"   rx="1"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/>
              <rect x="9"   y="0.5" width="3" height="11.5" rx="1"/>
              <rect x="13.5" y="0" width="3" height="12"   rx="1" opacity="0.3"/>
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12.55a11 11 0 0114.08 0" strokeLinecap="round"/>
              <path d="M1.42 9a16 16 0 0121.16 0" strokeLinecap="round"/>
              <path d="M8.53 16.11a6 6 0 016.95 0" strokeLinecap="round"/>
              <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            {/* Battery */}
            <svg width="26" height="12" viewBox="0 0 26 12" fill="currentColor">
              <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <rect x="1.5" y="2.5" width="17" height="7" rx="1.5"/>
              <path d="M23.5 4.5v3a1.5 1.5 0 000-3z"/>
            </svg>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-[var(--color-surface)] px-4 pt-2 pb-3 border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[var(--text-2xl)] font-bold tracking-tight">Products</h1>
              <p className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] mt-0.5">{stats.total} items total</p>
            </div>
            <Button
              variant="primary" size="sm"
              onClick={() => showToast("Add product — coming soon", "default")}
              className="flex items-center gap-1.5 !px-3 !py-2"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
            </Button>
          </div>

          {/* Stats strip */}
          <div className="flex gap-2 mb-3">
            {[
              { label: "Active",     value: stats.active, color: "var(--color-success)",     bg: "var(--color-success-light)"     },
              { label: "Low Stock",  value: stats.low,    color: "var(--color-accent)",      bg: "var(--color-accent-light)"      },
              { label: "Out of Stock", value: stats.out,  color: "var(--color-destructive)", bg: "var(--color-destructive-light)" },
            ].map(s => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-[var(--radius-md)] flex-1 justify-center"
                style={{ background: s.bg }}
              >
                <span className="text-[var(--text-xl)] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[9px] font-semibold leading-tight" style={{ color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <SearchBar
            placeholder="Search products..."
            onChange={e => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* Tab Bar */}
        <div className="flex bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-3 text-[var(--text-sm)] border-none cursor-pointer transition-all relative top-px bg-transparent border-b-2",
                activeTab === tab.key
                  ? "text-[var(--color-foreground)] font-semibold border-b-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] font-medium border-b-transparent"
              )}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className={cn("ml-1 text-[10px] font-bold", tabCountColor(tab.key))}>
                  {tabCount(tab.key)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-background)] flex-shrink-0">
          <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)]">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
          <div className="flex gap-1.5">
            <SortBtn k="name"  label="Name"  />
            <SortBtn k="price" label="Price" />
            <SortBtn k="stock" label="Stock" />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-surface)]">
          {filtered.length === 0 ? (
            <EmptyState
              icon={search ? "🔍" : "📦"}
              title={search ? "No products found" : "No products yet"}
              description={search ? `No results for "${search}"` : 'Tap "+ Add" to create your first product'}
            />
          ) : (
            <div>
              {filtered.map(p => (
                <ProductRow
                  key={p.id}
                  product={p}
                  onToggle={() => handleToggle(p.id)}
                  onEdit={() => setEditing(p)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
              {/* Preload skeleton placeholder (invisible, shows build works) */}
              <div className="hidden"><ProductCardSkeleton /></div>
              <div style={{ height: 24 }} />
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] flex-shrink-0">
          <div className="flex pt-2 pb-6">
            {([
              { icon: "🏠",  label: "Home"     },
              { icon: "📋",  label: "Orders"   },
              { icon: "＋",  label: "POS",  pos: true    },
              { icon: "📦",  label: "Products", active: true },
              { icon: "⚙️",  label: "Settings" },
            ] as const).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 py-1">
                {"pos" in item && item.pos ? (
                  <span className="w-14 h-14 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-2xl text-white -mt-5 shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                    {item.icon}
                  </span>
                ) : (
                  <span className="text-xl">{item.icon}</span>
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

        {/* Edit Sheet */}
        {editingProduct && (
          <EditSheet
            product={editingProduct}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-28 left-4 right-4 z-50 animate-[fadeIn_0.15s_ease]">
            <Toast variant={toast.type} onClose={() => setToast(null)}>
              {toast.msg}
            </Toast>
          </div>
        )}

      </div>
    </div>
  );
}
