"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WebScraper from "./WebScraper";
import PriceTrackingPanel from "../components/PriceTrackingPanel";

const ADMIN_EMAIL = "lenn.soder@protonmail.com";

type Order = {
  id: string;
  user_id: string;
  status: string;
  amount_total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  created_at: string;
};
type Product = {
  id: number;
  Name: string;
  price: number;
  emoji: string;
  badge: string;
  category: string;
  description: string;
};
type Tab = "oversikt" | "orders" | "products" | "messages" | "tools" | "pricetracking";

const STATUS_OPTIONS = ["Betald", "Paketeras", "Skickad", "Levererad", "Bakfull", "Inväntar Swish"];
const STATUS_COLORS: Record<string, string> = {
  Betald: "rgba(180,140,60,0.9)",
  Paketeras: "rgba(100,160,255,0.9)",
  Skickad: "rgba(100,220,150,0.9)",
  Levererad: "rgba(100,220,150,0.9)",
  Bakfull: "rgba(255,100,100,0.9)",
  "Inväntar Swish": "rgba(255,180,60,0.9)",
  PAID: "rgba(180,140,60,0.9)",
};
const STATUS_BG: Record<string, string> = {
  Betald: "rgba(180,140,60,0.12)",
  Paketeras: "rgba(100,160,255,0.12)",
  Skickad: "rgba(100,220,150,0.12)",
  Levererad: "rgba(100,220,150,0.12)",
  Bakfull: "rgba(255,100,100,0.12)",
  "Inväntar Swish": "rgba(255,180,60,0.12)",
  PAID: "rgba(180,140,60,0.12)",
};
const EMPTY_PRODUCT: Product = {
  id: -1, Name: "", price: 0, emoji: "☕", badge: "new", category: "Kaffe", description: "",
};

const TAB_META: { id: Tab; label: string; short: string; emoji: string }[] = [
  { id: "oversikt", label: "Översikt", short: "HEM", emoji: "🏠" },
  { id: "orders", label: "Ordrar", short: "ORDER", emoji: "📋" },
  { id: "products", label: "Produkter", short: "PROD", emoji: "📦" },
  { id: "messages", label: "Meddelanden", short: "MSG", emoji: "💬" },
  { id: "tools", label: "Web Crawler", short: "WEBB", emoji: "🌐" },
  { id: "pricetracking", label: "Pris Bevakning", short: "PRIS", emoji: "📊" },
];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("oversikt");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [scraperOpen, setScraperOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const showToast = (text: string, type: "success" | "error") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) { router.push("/"); return; }
      setUser(user);
      const [ordersRes, productsRes, messagesRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("Products").select("*").order("id"),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        await supabase.from("messages").insert({
          user_id: order.user_id, order_id: orderId,
          text: `Din order #${orderId.slice(0, 8)} har uppdaterats: ${newStatus}`, read: false,
        });
      }
      showToast(`Order uppdaterad → ${newStatus}`, "success");
    } else {
      showToast("Kunde inte uppdatera ordern.", "error");
    }
    setUpdatingOrder(null);
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm(`Ta bort order #${orderId.slice(0, 8)}?\n\nDenna åtgärd kan inte ångras.`)) return;
    setDeletingOrder(orderId);
    await supabase.from("messages").delete().eq("order_id", orderId);
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast("Order raderad ✓", "success");
    } else {
      showToast("Kunde inte radera ordern.", "error");
    }
    setDeletingOrder(null);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSavingProduct(true);
    const productData = {
      Name: editingProduct.Name, price: editingProduct.price, emoji: editingProduct.emoji,
      badge: editingProduct.badge, category: editingProduct.category, description: editingProduct.description,
    };
    if (editingProduct.id === -1) {
      const { data, error } = await supabase.from("Products").insert(productData).select().single();
      if (!error && data) { setProducts((prev) => [...prev, data]); showToast("Produkt skapad! ☕", "success"); setEditingProduct(null); }
      else showToast("Kunde inte skapa produkten.", "error");
    } else {
      const { error } = await supabase.from("Products").update(productData).eq("id", editingProduct.id);
      if (!error) { setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? editingProduct : p)); showToast("Produkt sparad! ☕", "success"); setEditingProduct(null); }
      else showToast("Kunde inte spara produkten.", "error");
    }
    setSavingProduct(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Ta bort produkten?")) return;
    const { error } = await supabase.from("Products").delete().eq("id", id);
    if (!error) { setProducts((prev) => prev.filter((p) => p.id !== id)); showToast("Produkt borttagen.", "success"); }
    else showToast("Kunde inte ta bort produkten.", "error");
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount_total || 0), 0);
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString());
  const weekOrders = orders.filter((o) => new Date(o.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.amount_total || 0), 0);
  const unreadMessages = messages.filter((m) => !m.read).length;

  const tabsWithCount = TAB_META.map((t) => ({
    ...t,
    count:
      t.id === "orders" ? orders.length
        : t.id === "products" ? products.length
          : t.id === "messages" ? unreadMessages
            : undefined,
  }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
    color: "rgba(255,255,255,0.8)", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "10px", letterSpacing: "3px",
    color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px",
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "6px", fontSize: "11px", textTransform: "uppercase" }}>Laddar admin...</p>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>
      <style>{`
        @media (max-width: 767px) {
          .admin-layout { flex-direction: column !important; }
          .admin-sidebar { display: none !important; }
          .admin-content { padding: 16px !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; }
          .admin-header { padding: 16px !important; margin-bottom: 16px !important; }
          .admin-header h1 { font-size: 26px !important; }
          .admin-bottom-nav { display: flex !important; }
          .admin-wrapper { padding: 0 0 80px !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .order-row { flex-direction: column !important; gap: 12px !important; }
          .order-actions { flex-direction: row !important; justify-content: space-between !important; width: 100% !important; }
          .status-pills { gap: 6px !important; }
          .status-pill { font-size: 10px !important; padding: 4px 8px !important; }
          .product-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .product-btns { width: 100% !important; display: flex !important; gap: 8px !important; }
          .product-btns button { flex: 1 !important; }
          .field-row { flex-direction: column !important; }
        }
        @media (min-width: 768px) {
          .admin-bottom-nav { display: none !important; }
        }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 70% 20%, rgba(180,140,60,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(40,80,160,0.05) 0%, transparent 50%)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 999,
              padding: "12px 24px", borderRadius: "8px", maxWidth: "90vw", whiteSpace: "nowrap",
              background: toast.type === "success" ? "rgba(180,140,60,0.15)" : "rgba(255,80,80,0.15)",
              border: `1px solid ${toast.type === "success" ? "rgba(180,140,60,0.4)" : "rgba(255,80,80,0.4)"}`,
              color: toast.type === "success" ? "rgba(180,140,60,0.9)" : "rgba(255,100,100,0.9)",
              fontSize: "13px", letterSpacing: "1px",
            }}
          >{toast.text}</motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav – mobile only */}
      <nav className="admin-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,10,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "none", alignItems: "stretch",
      }}>
        {tabsWithCount.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, background: "none", border: "none", padding: "10px 2px 8px",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            borderTop: activeTab === t.id ? "2px solid rgba(180,140,60,0.8)" : "2px solid transparent",
            position: "relative",
          }}>
            <span style={{ fontSize: 16 }}>{t.emoji}</span>
            <span style={{ fontSize: 8, color: activeTab === t.id ? "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.3)", letterSpacing: "0.05em", fontWeight: activeTab === t.id ? 700 : 400 }}>{t.short}</span>
            {t.count !== undefined && t.count > 0 && activeTab !== t.id && (
              <span style={{ position: "absolute", top: 6, right: "18%", width: 14, height: 14, borderRadius: "50%", background: "rgba(180,140,60,0.9)", color: "#000", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.count}</span>
            )}
          </button>
        ))}
      </nav>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className="admin-wrapper"
        style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", padding: "60px 24px 80px", width: "100%", boxSizing: "border-box" }}
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="admin-header"
          style={{ marginBottom: "32px", padding: "0" }}
        >
          <p style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "8px" }}>SWEGBG TRADING</p>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 52px)", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "6px" }}>Admin</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", wordBreak: "break-all" }}>{user?.email}</p>
          <div style={{ marginTop: "20px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.4), transparent)" }} />
        </motion.div>

        {/* Layout */}
        <div className="admin-layout" style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

          {/* Sidebar – desktop only */}
          <motion.aside className="admin-sidebar" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "3px" }}
          >
            {tabsWithCount.map((tab, i) => (
              <motion.button key={tab.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: "left", padding: "11px 16px", cursor: "pointer", fontSize: "13px", letterSpacing: "1px",
                  background: activeTab === tab.id ? "rgba(180,140,60,0.1)" : "transparent",
                  color: activeTab === tab.id ? "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.4)",
                  border: "none", borderLeft: activeTab === tab.id ? "2px solid rgba(180,140,60,0.6)" : "2px solid transparent",
                  borderRadius: "0 6px 6px 0", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{tab.emoji} {tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{ background: "rgba(180,140,60,0.2)", color: "rgba(180,140,60,0.8)", borderRadius: "99px", padding: "1px 7px", fontSize: "10px", fontWeight: 700 }}>{tab.count}</span>
                )}
              </motion.button>
            ))}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              onClick={() => router.push("/")}
              style={{ textAlign: "left", padding: "11px 16px", background: "transparent", color: "rgba(255,255,255,0.2)", border: "none", borderLeft: "2px solid transparent", borderRadius: "0 6px 6px 0", cursor: "pointer", fontSize: "12px", letterSpacing: "1px", marginTop: "20px" }}
            >← Tillbaka till siten</motion.button>
          </motion.aside>

          {/* Main content */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="admin-content"
            style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "clamp(20px, 4vw, 36px)" }}
          >
            <AnimatePresence mode="wait">

              {/* ── ÖVERSIKT ── */}
              {activeTab === "oversikt" && (
                <motion.div key="oversikt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SectionLabel>Dashboard</SectionLabel>
                  <SectionTitle>Översikt</SectionTitle>
                  <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "36px" }}>
                    {[
                      { label: "Total omsättning", value: `${totalRevenue} kr` },
                      { label: "Veckans försäljning", value: `${weekRevenue} kr` },
                      { label: "Veckans ordrar", value: `${weekOrders.length} st` },
                      { label: "Dagens ordrar", value: `${todayOrders.length} st` },
                      { label: "Totalt ordrar", value: `${orders.length} st` },
                      { label: "Produkter", value: `${products.length} st` },
                    ].map((card) => (
                      <div key={card.label} style={{ padding: "16px", background: "rgba(180,140,60,0.05)", border: "1px solid rgba(180,140,60,0.14)", borderRadius: "10px" }}>
                        <p style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>{card.label}</p>
                        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                  <SectionLabel>Senaste ordrar</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>#{order.id.slice(0, 8)}</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{order.shipping_city}</span>
                        <StatusBadge status={order.status} />
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{order.amount_total} kr</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── ORDRAR ── */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SectionLabel>Hantera</SectionLabel>
                  <SectionTitle>Alla Ordrar</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {orders.map((order, i) => (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}
                      >
                        <div className="order-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "5px", letterSpacing: "1px", fontFamily: "monospace" }}>#{order.id.slice(0, 8)}</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", wordBreak: "break-word" }}>{order.shipping_address}, {order.shipping_zip} {order.shipping_city}</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", marginTop: "4px" }}>{new Date(order.created_at).toLocaleString("sv-SE")}</p>
                          </div>
                          <div className="order-actions" style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                            <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", fontWeight: 700, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>{order.amount_total} kr</p>
                            <button onClick={() => deleteOrder(order.id)} disabled={deletingOrder === order.id}
                              style={{ padding: "6px 12px", background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "6px", color: "rgba(255,80,80,0.65)", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", opacity: deletingOrder === order.id ? 0.4 : 1, fontWeight: 600, whiteSpace: "nowrap" }}
                            >{deletingOrder === order.id ? "..." : "× Ta bort"}</button>
                          </div>
                        </div>
                        <div style={{ marginTop: "16px" }}>
                          <span style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Status</span>
                          <div className="status-pills" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {STATUS_OPTIONS.map((status) => (
                              <button key={status} className="status-pill" onClick={() => updateOrderStatus(order.id, status)} disabled={updatingOrder === order.id}
                                style={{
                                  padding: "5px 12px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.5px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                                  border: `1px solid ${(order.status || "Betald") === status ? STATUS_COLORS[status] || "rgba(180,140,60,0.6)" : "rgba(255,255,255,0.08)"}`,
                                  background: (order.status || "Betald") === status ? STATUS_BG[status] || "rgba(180,140,60,0.12)" : "transparent",
                                  color: (order.status || "Betald") === status ? STATUS_COLORS[status] || "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.3)",
                                }}
                              >{status}</button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── PRODUKTER ── */}
              {activeTab === "products" && (
                <motion.div key="products" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
                    <div>
                      <SectionLabel>Hantera</SectionLabel>
                      <SectionTitle style={{ marginBottom: 0 }}>Produkter</SectionTitle>
                    </div>
                    {!editingProduct && (
                      <button onClick={() => setEditingProduct({ ...EMPTY_PRODUCT })}
                        style={{ padding: "10px 18px", background: "rgba(180,140,60,0.9)", border: "none", borderRadius: "8px", color: "#000", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
                      >+ Ny produkt</button>
                    )}
                  </div>
                  {editingProduct ? (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <button onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "13px", marginBottom: "20px", letterSpacing: "1px" }}>← Tillbaka</button>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(180,140,60,0.8)", marginBottom: "20px" }}>
                        {editingProduct.id === -1 ? "✦ Ny produkt" : `Redigerar: ${editingProduct.Name}`}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                          <label style={labelStyle}>Produktnamn</label>
                          <input type="text" value={editingProduct.Name} placeholder="GBG Brew" onChange={(e) => setEditingProduct({ ...editingProduct, Name: e.target.value })} style={inputStyle} />
                        </div>
                        <div className="field-row" style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: "1 1 120px" }}>
                            <label style={labelStyle}>Pris (kr)</label>
                            <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} style={inputStyle} />
                          </div>
                          <div style={{ flex: "1 1 120px" }}>
                            <label style={labelStyle}>Emoji</label>
                            <input type="text" value={editingProduct.emoji} placeholder="☕" onChange={(e) => setEditingProduct({ ...editingProduct, emoji: e.target.value })} style={inputStyle} />
                          </div>
                        </div>
                        <div className="field-row" style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: "1 1 120px" }}>
                            <label style={labelStyle}>Badge</label>
                            <input type="text" value={editingProduct.badge} placeholder="new" onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })} style={inputStyle} />
                          </div>
                          <div style={{ flex: "1 1 120px" }}>
                            <label style={labelStyle}>Kategori</label>
                            <input type="text" value={editingProduct.category} placeholder="Kaffe" onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Beskrivning</label>
                          <textarea value={editingProduct.description} placeholder="Beskriv produkten..." onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "none" }} />
                        </div>
                        <button onClick={saveProduct} disabled={savingProduct}
                          style={{ padding: "14px", background: "linear-gradient(135deg, rgba(180,140,60,0.8), rgba(232,192,106,0.8))", color: "#000", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer" }}
                        >{savingProduct ? "Sparar..." : editingProduct.id === -1 ? "Skapa produkt" : "Spara ändringar"}</button>
                      </div>
                    </motion.div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {products.length === 0 && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", letterSpacing: "2px" }}>Inga produkter ännu.</p>}
                      {products.map((product, i) => (
                        <motion.div key={product.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                          className="product-row"
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", gap: "12px" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                            <span style={{ fontSize: "22px", flexShrink: 0 }}>{product.emoji}</span>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.Name}</p>
                              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>{product.category} · {product.badge} · {product.price} kr</p>
                            </div>
                          </div>
                          <div className="product-btns" style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            <button onClick={() => setEditingProduct(product)} style={{ padding: "7px 14px", background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "6px", color: "rgba(180,140,60,0.8)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>Redigera</button>
                            <button onClick={() => deleteProduct(product.id)} style={{ padding: "7px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "6px", color: "rgba(255,80,80,0.6)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>Ta bort</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── MEDDELANDEN ── */}
              {activeTab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SectionLabel>Historik</SectionLabel>
                  <SectionTitle>Meddelanden</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {messages.length > 0 ? messages.map((msg, i) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ padding: "16px 18px", background: msg.read ? "rgba(255,255,255,0.02)" : "rgba(180,140,60,0.06)", border: `1px solid ${msg.read ? "rgba(255,255,255,0.05)" : "rgba(180,140,60,0.2)"}`, borderRadius: "8px" }}
                      >
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "6px", wordBreak: "break-word" }}>{msg.text}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>{new Date(msg.created_at).toLocaleString("sv-SE")}</p>
                      </motion.div>
                    )) : (
                      <p style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px", fontSize: "13px" }}>Inga meddelanden.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── WEB CRAWLER ── */}
              {activeTab === "tools" && (
                <motion.div key="tools" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SectionLabel>Research & Intelligence</SectionLabel>
                  <SectionTitle>Web Crawler</SectionTitle>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "24px", letterSpacing: "0.5px" }}>Klicka på 🔥 ikonen nere till höger för att öppna verktyget.</p>
                  <WebScraper open={scraperOpen} setOpen={(v) => { setScraperOpen(v); if (v) setPriceOpen(false); }} activeTab={activeTab} />
                </motion.div>
              )}

              {/* ── PRIS BEVAKNING ── */}
              {activeTab === "pricetracking" && (
                <motion.div key="pricetracking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SectionLabel>Research & Intelligence</SectionLabel>
                  <SectionTitle>Pris Bevakning</SectionTitle>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "24px", letterSpacing: "0.5px" }}>Klicka på 📊 ikonen nere till höger för att öppna verktyget.</p>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.section>
        </div>
      </motion.div>

      <PriceTrackingPanel open={priceOpen} setOpen={(v) => { setPriceOpen(v); if (v) setScraperOpen(false); }} activeTab={activeTab} />
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "10px" }}>{children}</p>;
}
function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h2 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "24px", ...style }}>{children}</h2>;
}
function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{ background: STATUS_BG[status] || "rgba(180,140,60,0.12)", color: STATUS_COLORS[status] || "rgba(180,140,60,0.8)", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
      {status || "Betald"}
    </span>
  );
}