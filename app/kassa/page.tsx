"use client";

import { useCart } from "../context/cartcontext";
import { createClient } from "@/utils/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function KassaPage() {
  const { cart, clearCart } = useCart();
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", postalCode: "", city: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setForm(prev => ({ ...prev, email: user.email ?? "" }));
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
          const nameParts = (profile.full_name ?? "").split(" ");
          setForm(prev => ({
            ...prev,
            firstName: nameParts[0] ?? "",
            lastName: nameParts.slice(1).join(" ") ?? "",
            address: profile.address ?? "",
            postalCode: profile.zip_code ?? "",
            city: profile.city ?? "",
            phone: profile.phone ?? "",
          }));
        }
      }
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const required = ["firstName", "lastName", "email", "address", "postalCode", "city"];
    const missing = required.filter(k => !form[k as keyof typeof form]);
    if (missing.length > 0) { alert("Fyll i alla obligatoriska fält."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, userId: user?.id || null, customerDetails: form }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Betalningsfel:", err);
      alert("Något gick fel med betalningen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      {/* BAKGRUND */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 70% 20%, rgba(180,140,60,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(40,80,160,0.04) 0%, transparent 50%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", padding: "120px 24px 80px" }}
      >
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "10px" }}>
            SWEGBG TRADING
          </p>
          <h1 style={{ fontSize: "clamp(36px, 7vw, 64px)", fontWeight: "900", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
            Kassa
          </h1>
          <div style={{ marginTop: "20px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.4), transparent)" }} />
        </motion.div>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* FORMULÄR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              flex: "1 1 500px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "2rem",
            }}
          >
            {!user && (
              <div style={{
                background: "rgba(180,140,60,0.08)",
                border: "1px solid rgba(180,140,60,0.2)",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "13px",
                marginBottom: "24px",
                color: "rgba(255,255,255,0.5)",
              }}>
                Har du ett konto?{" "}
                <Link href="/medlem" style={{ color: "rgba(180,140,60,0.8)", fontWeight: 600, textDecoration: "none" }}>
                  Logga in
                </Link>
                {" "}för snabbare utcheckning.
              </div>
            )}

            {/* KONTAKT */}
            <section style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={sectionLabel}>Kontaktuppgifter</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Field label="Förnamn *" name="firstName" value={form.firstName} onChange={handleChange} />
                <Field label="Efternamn *" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <Field label="E-post *" name="email" value={form.email} onChange={handleChange} type="email" />
              <Field label="Telefon" name="phone" value={form.phone} onChange={handleChange} type="tel" />
            </section>

            {/* ADRESS */}
            <section style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={sectionLabel}>Leveransadress</p>
              <Field label="Gatuadress *" name="address" value={form.address} onChange={handleChange} />
              <div style={{ display: "flex", gap: "1rem" }}>
                <Field label="Postnummer *" name="postalCode" value={form.postalCode} onChange={handleChange} />
                <Field label="Stad *" name="city" value={form.city} onChange={handleChange} />
              </div>
            </section>

            {/* BETALNING */}
            <section style={{ marginBottom: "2rem" }}>
              <p style={sectionLabel}>Betalning</p>
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(180,140,60,0.2)",
                borderRadius: "8px",
                padding: "1.2rem",
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: "13px",
                letterSpacing: "1px",
              }}>
                🔒 Säker kortbetalning via Stripe
              </div>
            </section>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(180,140,60,0.85), rgba(232,192,106,0.85))",
                color: loading ? "rgba(255,255,255,0.2)" : "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {loading ? "Skickar till betalning..." : `Lägg beställning — ${total} kr`}
            </button>
          </motion.div>

          {/* ORDERSAMMANFATTNING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: "1 1 260px",
              background: "rgba(180,140,60,0.04)",
              border: "1px solid rgba(180,140,60,0.15)",
              borderRadius: "16px",
              padding: "2rem",
              position: "sticky",
              top: "90px",
            }}
          >
            <p style={sectionLabel}>Din order</p>
            {cart.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>Varukorgen är tom.</p>
            ) : (
              cart.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: "0.75rem", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                }}>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ opacity: 0.4 }}>×{item.quantity}</span>
                  <span style={{ color: "rgba(180,140,60,0.8)", fontWeight: "700" }}>
                    {item.price * (item.quantity ?? 1)} kr
                  </span>
                </div>
              ))
            )}

            <div style={{ borderTop: "1px solid rgba(180,140,60,0.2)", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Totalt</span>
              <span style={{ fontSize: "24px", fontWeight: "900", color: "rgba(180,140,60,0.9)" }}>{total} <span style={{ fontSize: "13px", opacity: 0.5 }}>kr</span></span>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "8px", letterSpacing: "1px" }}>
              Inkl. moms. Frakt beräknas vid leverans.
            </p>
            <Link href="/varukorg" style={{ display: "block", marginTop: "24px", color: "rgba(255,255,255,0.2)", fontSize: "12px", letterSpacing: "2px", textDecoration: "none" }}>
              ← Ändra varukorg
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text" }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "10px", letterSpacing: "3px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={name}
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
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: "10px", letterSpacing: "4px",
  color: "rgba(180,140,60,0.5)",
  textTransform: "uppercase",
  marginBottom: "16px",
};