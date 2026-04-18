"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WebScraper from "./WebScraper";
import PriceTrackingPanel from "../components/PriceTrackingPanel";


const ADMIN_EMAIL = "lenn.soder@protonmail.com";

type Order = { id: string; user_id: string; status: string; amount_total: number; shipping_address: string; shipping_city: string; shipping_zip: string; created_at: string; };
type Product = { id: number; Name: string; price: number; emoji: string; badge: string; category: string; description: string; };
type Tab = "oversikt" | "orders" | "products" | "messages" | "tools";

const STATUS_OPTIONS = ["Betald", "Paketeras", "Skickad", "Levererad", "Bakfull", "Inväntar Swish"];
const STATUS_COLORS: Record<string, string> = { Betald: "rgba(180,140,60,0.8)", Paketeras: "rgba(100,160,255,0.8)", Skickad: "rgba(100,220,150,0.8)", Levererad: "rgba(100,220,150,0.8)", Bakfull: "rgba(255,100,100,0.8)", "Inväntar Swish": "rgba(255,180,60,0.8)", PAID: "rgba(180,140,60,0.8)" };
const STATUS_BG: Record<string, string> = { Betald: "rgba(180,140,60,0.12)", Paketeras: "rgba(100,160,255,0.12)", Skickad: "rgba(100,220,150,0.12)", Levererad: "rgba(100,220,150,0.12)", Bakfull: "rgba(255,100,100,0.12)", "Inväntar Swish": "rgba(255,180,60,0.12)", PAID: "rgba(180,140,60,0.12)" };
const EMPTY_PRODUCT: Product = { id: -1, Name: "", price: 0, emoji: "☕", badge: "new", category: "Kaffe", description: "" };

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("oversikt");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const showToast = (text: string, type: "success" | "error") => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

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
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      const order = orders.find((o) => o.id === orderId);
      if (order) { await supabase.from("messages").insert({ user_id: order.user_id, order_id: orderId, text: `Din order #${orderId.slice(0, 8)} har uppdaterats: ${newStatus}`, read: false }); }
      showToast(`Order uppdaterad → ${newStatus}`, "success");
    } else { showToast("Kunde inte uppdatera ordern.", "error"); }
    setUpdatingOrder(null);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSavingProduct(true);
    const productData = { Name: editingProduct.Name, price: editingProduct.price, emoji: editingProduct.emoji, badge: editingProduct.badge, category: editingProduct.category, description: editingProduct.description };
    if (editingProduct.id === -1) {
      const { data, error } = await supabase.from("Products").insert(productData).select().single();
      if (!error && data) { setProducts((prev) => [...prev, data]); showToast("Produkt skapad! ☕", "success"); setEditingProduct(null); }
      else { showToast("Kunde inte skapa produkten.", "error"); }
    } else {
      const { error } = await supabase.from("Products").update(productData).eq("id", editingProduct.id);
      if (!error) { setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))); showToast("Produkt sparad! ☕", "success"); setEditingProduct(null); }
      else { showToast("Kunde inte spara produkten.", "error"); }
    }
    setSavingProduct(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Ta bort produkten?")) return;
    const { error } = await supabase.from("Products").delete().eq("id", id);
    if (!error) { setProducts((prev) => prev.filter((p) => p.id !== id)); showToast("Produkt borttagen.", "success"); }
    else { showToast("Kunde inte ta bort produkten.", "error"); }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount_total || 0), 0);
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString());
  const weekOrders = orders.filter((o) => new Date(o.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.amount_total || 0), 0);
  const unreadMessages = messages.filter((m) => !m.read).length;

  const tabs = [
    { id: "oversikt" as Tab, label: "Översikt" },
    { id: "orders" as Tab, label: `Ordrar (${orders.length})` },
    { id: "products" as Tab, label: `Produkter (${products.length})` },
    { id: "messages" as Tab, label: `Meddelanden${unreadMessages > 0 ? ` (${unreadMessages})` : ""}` },
    { id: "tools" as Tab, label: "Web Crawler" },
  ];

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "6px", fontSize: "11px", textTransform: "uppercase" }}>Laddar admin...</p>
    </main>
  );

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "rgba(255,255,255,0.8)", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "10px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 70% 20%, rgba(180,140,60,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(40,80,160,0.05) 0%, transparent 50%)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 999, padding: "12px 24px", borderRadius: "8px", background: toast.type === "success" ? "rgba(180,140,60,0.15)" : "rgba(255,80,80,0.15)", border: `1px solid ${toast.type === "success" ? "rgba(180,140,60,0.4)" : "rgba(255,80,80,0.4)"}`, color: toast.type === "success" ? "rgba(180,140,60,0.9)" : "rgba(255,100,100,0.9)", fontSize: "13px", letterSpacing: "1px" }}>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "10px" }}>SWEGBG TRADING</p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "8px" }}>Admin</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>{user?.email}</p>
          <div style={{ marginTop: "20px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.4), transparent)" }} />
        </motion.div>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ width: "100%", maxWidth: "220px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {tabs.map((tab, i) => (
              <motion.button key={tab.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                onClick={() => setActiveTab(tab.id)}
                style={{ textAlign: "left", padding: "12px 16px", background: activeTab === tab.id ? "rgba(180,140,60,0.12)" : "transparent", color: activeTab === tab.id ? "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.4)", border: "none", borderLeft: activeTab === tab.id ? "2px solid rgba(180,140,60,0.6)" : "2px solid transparent", borderRadius: "0 6px 6px 0", cursor: "pointer", fontSize: "13px", letterSpacing: "1px", transition: "all 0.2s" }}>
                {tab.label}
              </motion.button>
            ))}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => router.push("/")}
              style={{ textAlign: "left", padding: "12px 16px", background: "transparent", color: "rgba(255,255,255,0.2)", border: "none", borderLeft: "2px solid transparent", borderRadius: "0 6px 6px 0", cursor: "pointer", fontSize: "13px", letterSpacing: "1px", marginTop: "20px" }}>
              ← Tillbaka till siten
            </motion.button>
          </motion.aside>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ flex: 1, minWidth: "280px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "40px" }}>
            <AnimatePresence mode="wait">

              {activeTab === "oversikt" && (
                <motion.div key="oversikt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Dashboard</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "32px" }}>Översikt</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "40px" }}>
                    {[{ label: "Total omsättning", value: `${totalRevenue} kr` }, { label: "Veckans försäljning", value: `${weekRevenue} kr` }, { label: "Veckans ordrar", value: `${weekOrders.length} st` }, { label: "Dagens ordrar", value: `${todayOrders.length} st` }, { label: "Totalt ordrar", value: `${orders.length} st` }, { label: "Produkter", value: `${products.length} st` }].map((card) => (
                      <div key={card.label} style={{ padding: "20px", background: "rgba(180,140,60,0.05)", border: "1px solid rgba(180,140,60,0.15)", borderRadius: "10px" }}>
                        <p style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "10px" }}>{card.label}</p>
                        <p style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)" }}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Senaste ordrar</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>#{order.id.slice(0, 8)}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{order.shipping_city}</span>
                        <span style={{ background: STATUS_BG[order.status] || "rgba(180,140,60,0.12)", color: STATUS_COLORS[order.status] || "rgba(180,140,60,0.8)", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{order.status || "Betald"}</span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "rgba(255,255,255,0.8)" }}>{order.amount_total} kr</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Hantera</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Alla Ordrar</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {orders.map((order, i) => (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", letterSpacing: "1px" }}>Order #{order.id.slice(0, 8)}</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{order.shipping_address}, {order.shipping_zip} {order.shipping_city}</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }}>{new Date(order.created_at).toLocaleString("sv-SE")}</p>
                          </div>
                          <p style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)" }}>{order.amount_total} kr</p>
                        </div>
                        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Status:</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {STATUS_OPTIONS.map((status) => (
                              <button key={status} onClick={() => updateOrderStatus(order.id, status)} disabled={updatingOrder === order.id}
                                style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${(order.status || "Betald") === status ? STATUS_COLORS[status] || "rgba(180,140,60,0.6)" : "rgba(255,255,255,0.08)"}`, background: (order.status || "Betald") === status ? STATUS_BG[status] || "rgba(180,140,60,0.12)" : "transparent", color: (order.status || "Betald") === status ? STATUS_COLORS[status] || "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s" }}>
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "products" && (
                <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                    <div>
                      <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "6px" }}>Hantera</p>
                      <h2 style={{ fontSize: "24px", fontWeight: "700", color: "rgba(255,255,255,0.85)" }}>Produkter</h2>
                    </div>
                    {!editingProduct && (
                      <button onClick={() => setEditingProduct({ ...EMPTY_PRODUCT })} style={{ padding: "10px 20px", background: "rgba(180,140,60,0.9)", border: "none", borderRadius: "8px", color: "#000", fontSize: "11px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>+ Ny produkt</button>
                    )}
                  </div>
                  {editingProduct ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <button onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "13px", marginBottom: "24px", letterSpacing: "1px" }}>← Tillbaka</button>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "rgba(180,140,60,0.8)", marginBottom: "20px" }}>{editingProduct.id === -1 ? "✦ Ny produkt" : `Redigerar: ${editingProduct.Name}`}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div><label style={labelStyle}>Produktnamn</label><input type="text" value={editingProduct.Name} placeholder="GBG Brew" onChange={(e) => setEditingProduct({ ...editingProduct, Name: e.target.value })} style={inputStyle} /></div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: 1 }}><label style={labelStyle}>Pris (kr)</label><input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} style={inputStyle} /></div>
                          <div style={{ flex: 1 }}><label style={labelStyle}>Emoji</label><input type="text" value={editingProduct.emoji} placeholder="☕" onChange={(e) => setEditingProduct({ ...editingProduct, emoji: e.target.value })} style={inputStyle} /></div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: 1 }}><label style={labelStyle}>Badge</label><input type="text" value={editingProduct.badge} placeholder="new" onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })} style={inputStyle} /></div>
                          <div style={{ flex: 1 }}><label style={labelStyle}>Kategori</label><input type="text" value={editingProduct.category} placeholder="Kaffe" onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} style={inputStyle} /></div>
                        </div>
                        <div><label style={labelStyle}>Beskrivning</label><textarea value={editingProduct.description} placeholder="Beskriv produkten..." onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "none" }} /></div>
                        <button onClick={saveProduct} disabled={savingProduct} style={{ padding: "14px", background: "linear-gradient(135deg, rgba(180,140,60,0.8), rgba(232,192,106,0.8))", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer" }}>{savingProduct ? "Sparar..." : editingProduct.id === -1 ? "Skapa produkt" : "Spara ändringar"}</button>
                      </div>
                    </motion.div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {products.length === 0 && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", letterSpacing: "2px" }}>Inga produkter — klicka &quot;+ Ny produkt&quot; för att lägga till.</p>}
                      {products.map((product, i) => (
                        <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", gap: "12px", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "24px" }}>{product.emoji}</span>
                            <div>
                              <p style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.85)", marginBottom: "2px" }}>{product.Name}</p>
                              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>{product.category} · {product.badge} · {product.price} kr</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button onClick={() => setEditingProduct(product)} style={{ padding: "7px 14px", background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "6px", color: "rgba(180,140,60,0.8)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Redigera</button>
                            <button onClick={() => deleteProduct(product.id)} style={{ padding: "7px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "6px", color: "rgba(255,80,80,0.6)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Ta bort</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Historik</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Meddelanden</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {messages.length > 0 ? messages.map((msg, i) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: "16px 20px", background: msg.read ? "rgba(255,255,255,0.02)" : "rgba(180,140,60,0.06)", border: `1px solid ${msg.read ? "rgba(255,255,255,0.05)" : "rgba(180,140,60,0.2)"}`, borderRadius: "8px" }}>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>{msg.text}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>{new Date(msg.created_at).toLocaleString("sv-SE")}</p>
                      </motion.div>
                    )) : <p style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px", fontSize: "13px" }}>Inga meddelanden.</p>}
                  </div>
                </motion.div>
              )}

              {activeTab === "tools" && (
                <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Research & Intelligence</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "12px" }}>Web Crawler</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "28px", letterSpacing: "0.5px" }}>
                    Klicka på 🔥 ikonen nere till höger för att öppna verktyget.
                  </p>
                  <WebScraper />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.section>
        </div>
      </motion.div>

      <PriceTrackingPanel />

    </main>
  );
}