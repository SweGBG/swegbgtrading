"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function KontaktPage() {
  const [form, setForm] = useState({ namn: "", email: "", meddelande: "" });
  const [status, setStatus] = useState<Status>("idle");

  const uppdatera = (falt: string, varde: string) =>
    setForm((prev) => ({ ...prev, [falt]: varde }));

  const skicka = async () => {
    if (!form.namn || !form.email || !form.meddelande) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ namn: "", email: "", meddelande: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0a0a0a 60%)" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "800px", height: "300px", background: "radial-gradient(ellipse, rgba(180,140,60,0.12) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, left: "30%", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,160,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
            <polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke="rgba(180,140,60,0.1)" strokeWidth="0.5" />
            <circle cx="40" cy="46" r="1.5" fill="rgba(180,140,60,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "16px" }}
        >
          SweGBG Trading
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          style={{ fontSize: "clamp(48px, 10vw, 88px)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", lineHeight: 1, marginBottom: "0" }}
        >
          Kontakt
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
          style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)", margin: "28px 0" }}
        />

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ fontSize: "13px", color: "rgba(221, 211, 211, 0.25)", textAlign: "center", maxWidth: "420px", lineHeight: 1.8, marginBottom: "48px" }}
        >
          Behöver du en egen webshop? Du har produkterna men ingen e-butik? Hör av dig så bygger vi den åt dig i din egen design from scratch.
        </motion.p>

        {/* FORMULÄR */}
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(180,140,60,0.06)", border: "1px solid rgba(180,140,60,0.25)",
              borderRadius: "16px", padding: "48px 40px", textAlign: "center", maxWidth: "500px", width: "100%",
            }}
          >
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(180,140,60,0.15)", border: "1px solid rgba(180,140,60,0.4)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>✓</div>
            </motion.div>
            <p style={{ color: "rgba(180,140,60,0.8)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" }}>Meddelande skickat</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Tack! Jag återkommer inom 24 timmar.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,140,60,0.15)",
              borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "520px",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)" }} />

            {/* Namn */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "rgba(180,140,60,0.6)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Namn</label>
              <input
                type="text" placeholder="Ditt namn"
                value={form.namn}
                onChange={e => uppdatera("namn", e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(180,140,60,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "rgba(180,140,60,0.6)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Email</label>
              <input
                type="email" placeholder="din@email.se"
                value={form.email}
                onChange={e => uppdatera("email", e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(180,140,60,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Meddelande */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", color: "rgba(180,140,60,0.6)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Meddelande</label>
              <textarea
                placeholder="Berätta om ditt projekt..."
                value={form.meddelande}
                onChange={e => uppdatera("meddelande", e.target.value)}
                rows={5}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none", resize: "none", transition: "border-color 0.2s", boxSizing: "border-box", fontFamily: "inherit" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(180,140,60,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(180,140,60,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={skicka}
              disabled={status === "loading"}
              style={{
                width: "100%", padding: "15px",
                background: status === "loading" ? "rgba(180,140,60,0.4)" : "rgba(180,140,60,0.9)",
                border: "none", borderRadius: "8px", color: "#0a0a0a",
                fontSize: "11px", fontWeight: 800, letterSpacing: "0.15em",
                textTransform: "uppercase", cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "Skickar..." : "Skicka meddelande →"}
            </motion.button>

            {status === "error" && (
              <p style={{ color: "rgba(220,80,60,0.8)", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                Något gick fel. Försök igen eller maila direkt.
              </p>
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ fontSize: "11px", letterSpacing: "8px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase", marginTop: "48px" }}
        >
          GÖTEBORG — EST. 2026
        </motion.p>
      </motion.section>
    </main>
  );
}