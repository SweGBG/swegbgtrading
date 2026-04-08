"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function KontoDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"oversikt" | "orders" | "messages" | "settings">("oversikt");
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [profile, setProfile] = useState({ full_name: "", address: "", zip_code: "", city: "" });
  const [initialProfile, setInitialProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/medlem"); return; }
      setUser(user);

      const [ordersRes, profileRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (profileRes.data) {
        const p = {
          full_name: profileRes.data.full_name || "",
          address: profileRes.data.address || "",
          zip_code: profileRes.data.zip_code || "",
          city: profileRes.data.city || ""
        };
        setProfile(p);
        setInitialProfile(p);
      }
      setLoadingOrders(false);
    };
    getData();
  }, []);

  const updateProfile = async () => {
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    if (!hasChanges) {
      setStatusMessage({ text: "Inga ändringar att spara.", type: 'error' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...profile, updated_at: new Date() });
    if (error) {
      setStatusMessage({ text: "Gick inte att spara: " + error.message, type: 'error' });
    } else {
      setStatusMessage({ text: "Profilen har uppdaterats! ☕", type: 'success' });
      setInitialProfile({ ...profile });
      setTimeout(() => setStatusMessage(null), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "6px", fontSize: "11px", textTransform: "uppercase" }}>Laddar...</p>
    </main>
  );

  const noChanges = JSON.stringify(profile) === JSON.stringify(initialProfile);

  const tabs = [
    { id: "oversikt", label: "Översikt" },
    { id: "orders", label: `Beställningar (${orders.length})` },
    { id: "messages", label: "Meddelanden" },
    { id: "settings", label: "Inställningar" },
  ] as const;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      {/* BAKGRUND */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 70% 20%, rgba(180,140,60,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(40,80,160,0.05) 0%, transparent 50%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "120px 24px 80px" }}
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "48px" }}
        >
          <p style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "10px" }}>
            SWEGBG TRADING
          </p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "8px" }}>
            Mitt Konto
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>
            {user?.email}
          </p>
          <div style={{ marginTop: "20px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.4), transparent)" }} />
        </motion.div>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ width: "100%", maxWidth: "220px", display: "flex", flexDirection: "column", gap: "4px" }}
          >
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  background: activeTab === tab.id ? "rgba(180,140,60,0.12)" : "transparent",
                  color: activeTab === tab.id ? "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.4)",
                  border: "none",
                  borderLeft: activeTab === tab.id ? "2px solid rgba(180,140,60,0.6)" : "2px solid transparent",
                  borderRadius: "0 6px 6px 0",
                  cursor: "pointer",
                  fontSize: "13px",
                  letterSpacing: "1px",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleLogout}
              style={{
                textAlign: "left",
                padding: "12px 16px",
                background: "transparent",
                color: "rgba(255,80,80,0.5)",
                border: "none",
                borderLeft: "2px solid transparent",
                borderRadius: "0 6px 6px 0",
                cursor: "pointer",
                fontSize: "13px",
                letterSpacing: "1px",
                marginTop: "20px",
              }}
            >
              Logga ut
            </motion.button>
          </motion.aside>

          {/* INNEHÅLL */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: 1,
              minWidth: "280px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "40px",
            }}
          >
            <AnimatePresence mode="wait">

              {activeTab === "oversikt" && (
                <motion.div key="oversikt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Välkommen tillbaka</p>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "32px" }}>
                    {profile.full_name || user?.email?.split("@")[0]} ☕
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                      { label: "Medlem sedan", value: new Date(user.created_at).toLocaleDateString('sv-SE') },
                      { label: "Antal beställningar", value: `${orders.length} st` },
                    ].map((card) => (
                      <div key={card.label} style={{
                        padding: "20px",
                        background: "rgba(180,140,60,0.05)",
                        border: "1px solid rgba(180,140,60,0.15)",
                        borderRadius: "10px",
                      }}>
                        <p style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "10px" }}>{card.label}</p>
                        <p style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)" }}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Historik</p>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Dina Beställningar</h2>
                  {loadingOrders ? (
                    <p style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "4px", fontSize: "11px" }}>HÄMTAR...</p>
                  ) : orders.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {orders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          style={{
                            padding: "20px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "10px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", letterSpacing: "1px" }}>
                              Order #{order.id.slice(0, 8)}
                            </span>
                            <span style={{
                              background: "rgba(180,140,60,0.12)",
                              color: "rgba(180,140,60,0.8)",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "10px",
                              letterSpacing: "2px",
                              textTransform: "uppercase",
                            }}>
                              {order.status || "Betald"}
                            </span>
                          </div>
                          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "10px" }}>{order.shipping_address}, {order.shipping_city}</p>
                          <p style={{ fontSize: "20px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginTop: "12px" }}>{order.amount_total} kr</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px", fontSize: "13px" }}>Inga ordrar än.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Inkorg</p>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Meddelanden</h2>
                  <p style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px", fontSize: "13px" }}>Inga meddelanden än.</p>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "16px" }}>Profil</p>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Leveransuppgifter</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { label: "Fullständigt namn", key: "full_name", placeholder: "Namn Namnsson" },
                      { label: "Gatuadress", key: "address", placeholder: "Gatan 12" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label style={{ display: "block", fontSize: "10px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={(profile as any)[field.key]}
                          onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "14px",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    ))}

                    <div style={{ display: "flex", gap: "12px" }}>
                      {[
                        { label: "Postnummer", key: "zip_code", placeholder: "123 45", flex: 1 },
                        { label: "Postort", key: "city", placeholder: "Göteborg", flex: 2 },
                      ].map((field) => (
                        <div key={field.key} style={{ flex: field.flex }}>
                          <label style={{ display: "block", fontSize: "10px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={(profile as any)[field.key]}
                            onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "8px",
                              color: "rgba(255,255,255,0.8)",
                              fontSize: "14px",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {statusMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          background: statusMessage.type === "success" ? "rgba(180,140,60,0.1)" : "rgba(255,80,80,0.1)",
                          border: `1px solid ${statusMessage.type === "success" ? "rgba(180,140,60,0.3)" : "rgba(255,80,80,0.3)"}`,
                          color: statusMessage.type === "success" ? "rgba(180,140,60,0.9)" : "rgba(255,80,80,0.9)",
                          fontSize: "13px",
                          letterSpacing: "1px",
                          textAlign: "center",
                        }}
                      >
                        {statusMessage.text}
                      </motion.div>
                    )}

                    <button
                      onClick={updateProfile}
                      disabled={saving || noChanges}
                      style={{
                        marginTop: "8px",
                        padding: "14px",
                        background: noChanges || saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(180,140,60,0.8), rgba(232,192,106,0.8))",
                        color: noChanges || saving ? "rgba(255,255,255,0.2)" : "#000",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "12px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        cursor: noChanges || saving ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                      }}
                    >
                      {saving ? "Sparar..." : noChanges ? "Inga ändringar" : "Spara profil"}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}