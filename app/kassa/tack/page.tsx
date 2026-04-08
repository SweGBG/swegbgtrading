"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TackPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, rgba(60,160,100,0.07) 0%, transparent 60%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: "relative", zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        {/* CHECKMARK MED RINGAR */}
        <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "48px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
              style={{
                position: "absolute",
                inset: `${i * -20}px`,
                borderRadius: "50%",
                border: "1px solid rgba(60,160,100,0.3)",
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            style={{
              position: "absolute", inset: "20px",
              borderRadius: "50%",
              background: "rgba(60,160,100,0.1)",
              border: "1px solid rgba(60,160,100,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ✓
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(60,160,100,0.6)", textTransform: "uppercase", marginBottom: "16px" }}
        >
          SWEGBG TRADING
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ fontSize: "clamp(36px, 8vw, 72px)", fontWeight: "900", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", lineHeight: 1, marginBottom: "0" }}
        >
          Tack!
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,160,100,0.6), transparent)", margin: "28px 0" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ fontSize: "14px", letterSpacing: "2px", color: "rgba(255,255,255,0.35)", marginBottom: "48px", maxWidth: "400px", lineHeight: 1.8 }}
        >
          Din beställning är bekräftad.<br />Du får en bekräftelse via e-post från Stripe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "14px 40px",
              background: "linear-gradient(135deg, rgba(180,140,60,0.85), rgba(232,192,106,0.85))",
              color: "#000", border: "none", borderRadius: "6px",
              fontWeight: "700", fontSize: "12px", letterSpacing: "3px",
              textTransform: "uppercase", cursor: "pointer",
            }}>
              Fortsätt handla
            </button>
          </Link>
          <Link href="/konto" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "14px 40px",
              background: "transparent",
              color: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              fontWeight: "700", fontSize: "12px", letterSpacing: "3px",
              textTransform: "uppercase", cursor: "pointer",
            }}>
              Mina ordrar
            </button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ marginTop: "80px", fontSize: "11px", letterSpacing: "8px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}
        >
          SWEGBG TRADING — EST. 2026
        </motion.p>

      </motion.section>
    </main>
  );
}