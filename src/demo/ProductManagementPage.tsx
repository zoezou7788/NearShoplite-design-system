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
  nameEn: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
  image: string; // emoji placeholder
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "冰抹茶拿铁", nameEn: "Iced Matcha Latte", category: "beverages", price: 22, cost: 8, stock: 47, active: true, image: "🍵" },
  { id: "2", name: "芒果糯米饭", nameEn: "Mango Sticky Rice", category: "desserts", price: 35, cost: 12, stock: 5, active: true, image: "🥭" },
  { id: "3", name: "泰式奶茶", nameEn: "Thai Milk Tea", category: "beverages", price: 18, cost: 6, stock: 0, active: false, image: "🧋" },
  { id: "4", name: "招牌咖啡", nameEn: "Signature Coffee", category: "beverages", price: 28, cost: 9, stock: 23, active: true, image: "☕" },
  { id: "5", name: "椰子冻", nameEn: "Coconut Jelly", category: "desserts", price: 15, cost: 4, stock: 3, active: true, image: "🥥" },
  { id: "6", name: "炸春卷", nameEn: "Spring Roll", category: "food", price: 25, cost: 10, stock: 12, active: true, image: "🥚" },
  { id: "7", name: "红豆刨冰", nameEn: "Red Bean Shaved Ice", category: "desserts", price: 20, cost: 7, stock: 0, active: false, image: "🧊" },
  { id: "8", name: "柠檬苏打", nameEn: "Lemon Soda", category: "beverages", price: 16, cost: 5, stock: 4, active: true, image: "🍋" },
  { id: "9", name: "叉烧包", nameEn: "BBQ Pork Bun", category: "food", price: 12, cost: 4, stock: 31, active: true, image: "🫔" },
  { id: "10", name: "凤梨酥", nameEn: "Pineapple Cake", category: "snacks", price: 30, cost: 11, stock: 2, active: true, image: "🍍" },
];

type TabKey = "all" | "active" | "low" | "out";
type SortKey = "name" | "price" | "stock";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",    label: "全部"   },
  { key: "active", label: "在售"   },
  { key: "low",    label: "低库存" },
  { key: "out",    label: "缺货"   },
];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function StockBadge({ stock }: { stock: number }) {
  const base = "text-[var(--text-xs)] font-semibold px-2 py-0.5 rounded-[var(--radius-full)] whitespace-nowrap";
  if (stock === 0)
    return <span className={`${base} text-[var(--color-destructive)] bg-[var(--color-destructive-light)]`}>缺货</span>;
  if (stock <= 5)
    return <span className={`${base} text-[var(--color-accent)] bg-[var(--color-accent-light)]`}>{stock} 件</span>;
  return <span className={`${base} text-[var(--color-success)] bg-[var(--color-success-light)]`}>{stock} 件</span>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-[var(--radius-full)] border-none cursor-pointer transition-colors duration-200 flex-shrink-0",
        checked ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"
      )}
      aria-checked={checked}
      role="switch"
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
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product, onToggle, onEdit, onDelete }: ProductRowProps) {
  const [swiped, setSwiped] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Delete reveal (behind) */}
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[var(--color-destructive)]">
        <button
          onClick={() => { setSwiped(false); onDelete(); }}
          className="flex flex-col items-center gap-1 text-white border-none bg-transparent cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          <span className="text-[10px] font-semibold">删除</span>
        </button>
      </div>

      {/* Main row */}
      <div
        className={cn(
          "relative bg-[var(--color-surface)] transition-transform duration-200 ease-out",
          swiped ? "-translate-x-20" : "translate-x-0"
        )}
        onTouchStart={() => {}}
      >
        <div className={cn(
          "flex items-center gap-3 px-4 py-3",
          !product.active && "opacity-50"
        )}>
          {/* Image */}
          <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-muted)] flex items-center justify-center text-xl flex-shrink-0">
            {product.image}
          </div>

          {/* Info — one-line name, one-line meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <p className="text-[var(--text-base)] font-semibold text-[var(--color-foreground)] truncate" style={{ maxWidth: 100 }}>
                {product.name}
              </p>
              <span className="text-[9px] text-[var(--color-muted-foreground)] truncate" style={{ maxWidth: 64 }}>{product.nameEn}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-sm)] font-bold text-[var(--color-foreground)] whitespace-nowrap">
                ฿{product.price.toFixed(2)}
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] whitespace-nowrap">
                · 成本฿{product.cost}
              </span>
              <StockBadge stock={product.stock} />
            </div>
          </div>

          {/* Actions: edit · delete · toggle (compact) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={onEdit}
              className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none hover:bg-[var(--color-border)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button onClick={() => setSwiped(s => !s)}
              className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-muted)] flex items-center justify-center cursor-pointer border-none hover:bg-[var(--color-destructive-light)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-destructive)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
            <Toggle checked={product.active} onChange={onToggle} />
          </div>
        </div>
        <div className="h-px bg-[var(--color-background)] mx-4" />
      </div>
    </div>
  );
}

interface EditSheetProps {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}

function EditSheet({ product, onClose, onSave }: EditSheetProps) {
  const [form, setForm] = useState<Product | null>(product);
  if (!form) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.4)", borderRadius: 44 }} onClick={onClose}>
      <div
        className="bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] px-5 pt-4 pb-8 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: "88%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto -mt-1 mb-1" />

        <div className="flex items-center justify-between">
          <h2 className="text-[var(--text-lg)] font-semibold">编辑商品</h2>
          <button onClick={onClose} className="text-[var(--color-muted-foreground)] text-xl border-none bg-transparent cursor-pointer">×</button>
        </div>

        {/* Image picker (static) */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {["🍵","🧋","☕","🍋","🥭","🥥","🫔","🍍","🥚","🧊"].map(e => (
            <button key={e} onClick={() => setForm(f => f ? { ...f, image: e } : f)}
              className={cn("w-12 h-12 rounded-[var(--radius-md)] text-2xl border-2 flex-shrink-0 cursor-pointer transition-all",
                form.image === e ? "border-[var(--color-primary)] bg-[var(--color-muted)]" : "border-transparent bg-[var(--color-muted)]"
              )}>
              {e}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-1">商品名称</label>
            <input value={form.name}
              onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)}
              className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3.5 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--text-sm)] font-semibold mb-1">售价 ฿</label>
              <input type="number" value={form.price}
                onChange={e => setForm(f => f ? { ...f, price: Number(e.target.value) } : f)}
                className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-sm)] font-semibold mb-1">成本 ฿</label>
              <input type="number" value={form.cost}
                onChange={e => setForm(f => f ? { ...f, cost: Number(e.target.value) } : f)}
                className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-sm)] font-semibold mb-1">库存</label>
              <input type="number" value={form.stock}
                onChange={e => setForm(f => f ? { ...f, stock: Number(e.target.value) } : f)}
                className="w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--color-ring)]"
              />
            </div>
          </div>
        </div>

        <Button variant="primary" onClick={() => onSave(form)}>保存更改</Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDesc, setSortDesc] = useState(false);
  const [loading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "default" | "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "default" | "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  };

  // Stats
  const stats = useMemo(() => ({
    total:  products.length,
    active: products.filter(p => p.active).length,
    low:    products.filter(p => p.stock > 0 && p.stock <= 5).length,
    out:    products.filter(p => p.stock === 0).length,
  }), [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...products];
    // Tab
    if (activeTab === "active") list = list.filter(p => p.active);
    if (activeTab === "low")    list = list.filter(p => p.stock > 0 && p.stock <= 5);
    if (activeTab === "out")    list = list.filter(p => p.stock === 0);
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.includes(q) || p.nameEn.toLowerCase().includes(q)
      );
    }
    // Sort
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === "name")  diff = a.name.localeCompare(b.name);
      if (sortKey === "price") diff = a.price - b.price;
      if (sortKey === "stock") diff = a.stock - b.stock;
      return sortDesc ? -diff : diff;
    });
    return list;
  }, [products, activeTab, search, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(false); }
  };

  const handleToggle = (id: string) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const p = products.find(p => p.id === id)!;
    showToast(`${p.name} 已${p.active ? "下架" : "上架"}`, "default");
  };

  const handleDelete = (id: string) => {
    const p = products.find(p => p.id === id)!;
    setProducts(ps => ps.filter(p => p.id !== id));
    showToast(`${p.name} 已删除`, "error");
  };

  const handleSave = (updated: Product) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
    showToast("商品信息已保存", "success");
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
      {label}
      {sortKey === k && <span className="text-[10px]">{sortDesc ? " ↓" : " ↑"}</span>}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1C1C1E]">
      {/* iPhone 14 shell */}
      <div
        className="relative bg-[var(--color-background)] flex flex-col overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 44, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 pt-3 pb-1 bg-[var(--color-surface)] flex-shrink-0" style={{ paddingTop: 16 }}>
          <span className="text-[13px] font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="0.5" width="3" height="11.5" rx="1"/><rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.3"/></svg>
            <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor"><rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="16" height="7" rx="1.5"/><path d="M22.5 4.5v3a1.5 1.5 0 000-3z"/></svg>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-[var(--color-surface)] px-4 pt-1 pb-3 border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[var(--text-2xl)] font-bold tracking-tight text-[var(--color-foreground)]">商品管理</h1>
              <p className="text-[var(--text-xs)] text-[var(--color-muted-foreground)] mt-0.5">共 {stats.total} 件商品</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => showToast("新增商品功能开发中", "default")}
              className="flex items-center gap-1.5 !px-3 !py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新增
            </Button>
          </div>

          {/* Stats pills */}
          <div className="flex gap-2 mb-3">
            {[
              { label: "在售", value: stats.active,  color: "var(--color-success)",     bg: "var(--color-success-light)"     },
              { label: "低库存", value: stats.low,   color: "var(--color-accent)",      bg: "var(--color-accent-light)"      },
              { label: "缺货", value: stats.out,     color: "var(--color-destructive)", bg: "var(--color-destructive-light)" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] flex-1 justify-center"
                style={{ background: s.bg }}>
                <span className="text-[var(--text-xl)] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[var(--text-xs)] font-medium" style={{ color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <SearchBar
            placeholder="搜索商品名称..."
            onChange={e => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-3 text-[var(--text-sm)] font-medium border-none cursor-pointer transition-all relative top-px",
                "bg-transparent border-b-2",
                activeTab === tab.key
                  ? "text-[var(--color-foreground)] font-semibold border-b-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] border-b-transparent hover:text-[var(--color-foreground)]"
              )}>
              {tab.label}
              {tab.key !== "all" && (
                <span className={cn(
                  "ml-1 text-[10px] font-bold",
                  tab.key === "active" ? "text-[var(--color-success)]" :
                  tab.key === "low"    ? "text-[var(--color-accent)]" :
                                        "text-[var(--color-destructive)]"
                )}>
                  {tab.key === "active" ? stats.active : tab.key === "low" ? stats.low : stats.out}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-background)] flex-shrink-0">
          <span className="text-[var(--text-xs)] text-[var(--color-muted-foreground)]">
            {filtered.length} 件商品
          </span>
          <div className="flex gap-1.5">
            <SortBtn k="name" label="名称" />
            <SortBtn k="price" label="价格" />
            <SortBtn k="stock" label="库存" />
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-surface)]">
          {loading ? (
            <div className="flex flex-col">
              {[1,2,3,4,5].map(i => <ProductCardSkeleton key={i} className="mx-4 my-2" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={search ? "🔍" : "📦"}
              title={search ? "没有找到商品" : "暂无商品"}
              description={search ? `"${search}" 没有匹配的结果` : "点击右上角 + 添加第一件商品"}
            />
          ) : (
            <div>
              {filtered.map(p => (
                <ProductRow
                  key={p.id}
                  product={p}
                  onToggle={() => handleToggle(p.id)}
                  onEdit={() => setEditingProduct(p)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
              <div style={{ height: 24 }} />
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] flex-shrink-0">
          <div className="flex pt-2 pb-6">
            {[
              { icon: "🏠", label: "首页" },
              { icon: "📋", label: "订单" },
              { icon: "＋", label: "收银", pos: true },
              { icon: "📦", label: "商品", active: true },
              { icon: "⚙️", label: "设置" },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 py-1">
                {item.pos ? (
                  <span className="w-14 h-14 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-2xl text-white -mt-5 shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                    {item.icon}
                  </span>
                ) : (
                  <span className="text-xl">{item.icon}</span>
                )}
                <span className={cn(
                  "text-[10px]",
                  item.active ? "font-semibold text-[var(--color-foreground)]" : "font-medium text-[var(--color-muted-foreground)]"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit sheet */}
        {editingProduct && (
          <EditSheet
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSave}
          />
        )}

        {/* Toast */}
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
