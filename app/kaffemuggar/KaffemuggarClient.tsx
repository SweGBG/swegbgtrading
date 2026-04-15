"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const NUMBERS = ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9"];

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + i * 8}%`,
  bottom: `${10 + (i % 3) * 15}%`,
  size: i % 3 === 0 ? "3px" : "2px",
  color: i % 2 === 0 ? "rgba(180,140,60,0.6)" : "rgba(255,255,255,0.2)",
  duration: 4 + (i % 4),
  delay: i * 0.7,
}));

export default function KaffemuggarClient() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflowX: "hidden" }}>

      {/* Bakgrund */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0a0a0a 60%)" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(180,140,60,0.1) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* Hex grid */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
            <polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke="rgba(180,140,60,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -80, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          style={{
            position: "fixed", left: p.left, bottom: p.bottom,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.color, pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}

      {/* Demo banner */}


      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px" }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{ position: "relative", marginBottom: "48px" }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "220px", height: "220px", top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.15)", borderTop: "1px solid rgba(180,140,60,0.5)" }}
          />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "180px", height: "180px", top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: "50%", border: "1px dashed rgba(180,140,60,0.1)" }}
          />
          <Image
            src="/images/logo333a.png"
            alt="SweGBG Muggar"
            width={160} height={160}
            style={{
              borderRadius: "50%", display: "block",
              filter: "drop-shadow(0 0 40px rgba(180,140,60,0.4))",
              position: "relative", zIndex: 1,
            }}
          />
        </motion.div>

        {/* Rubrik */}
        <motion.p
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "16px" }}
        >
          SweGBG Trading
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          style={{ fontSize: "clamp(56px, 10vw, 96px)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.93)", lineHeight: 1, textAlign: "center", marginBottom: "0" }}
        >
          Muggar
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
          style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)", margin: "28px 0" }}
        />

        {/* Limited edition text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <p style={{ fontSize: "13px", letterSpacing: "4px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "12px" }}>
            Limited Edition
          </p>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.25)", lineHeight: 1.8, maxWidth: "420px", margin: "0 auto" }}>
            Locally printed. Numbered #1 to #9.<br />
            Göteborg made. Never restocked.
          </p>
        </motion.div>

        {/* #1 - #9 numren */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "56px", maxWidth: "400px" }}
        >
          {NUMBERS.map((num, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: "48px", height: "48px", borderRadius: "50%",
                border: "1px solid rgba(180,140,60,0.3)",
                background: "rgba(180,140,60,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
                color: "rgba(180,140,60,0.6)",
              }}
            >
              {num}
            </motion.div>
          ))}
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, type: "spring" }}
          style={{
            background: "rgba(180,140,60,0.08)",
            border: "1px solid rgba(180,140,60,0.25)",
            borderRadius: "40px", padding: "14px 36px",
            marginBottom: "48px",
            display: "flex", alignItems: "center", gap: "10px",
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(180,140,60,0.8)" }}
          />
          <span style={{ fontSize: "11px", letterSpacing: "4px", color: "rgba(180,140,60,0.7)", textTransform: "uppercase" }}>
            Coming soon
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          style={{ fontSize: "10px", letterSpacing: "8px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}
        >
          GÖTEBORG — EST. 2026
        </motion.p>
      </motion.section>
    </main>
  );
}