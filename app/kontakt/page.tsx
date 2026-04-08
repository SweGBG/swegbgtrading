"use client";

import { motion } from "framer-motion";

export default function KontaktPage() {
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
        transition={{ duration: 1 }}
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}
      >
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.6)", textTransform: "uppercase", marginBottom: "24px" }}>
          SWEGBG TRADING
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ fontSize: "clamp(48px, 10vw, 96px)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
          Kontakt
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8 }} style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.6), transparent)", margin: "32px 0" }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontSize: "13px", letterSpacing: "6px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "60px" }}>
          Kommer snart
        </motion.p>

        <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "60px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1 }} style={{ position: "absolute", inset: `${i * -20}px`, borderRadius: "50%", border: "1px solid rgba(180,140,60,0.3)" }} />
          ))}
          <div style={{ position: "absolute", inset: "40px", borderRadius: "50%", background: "rgba(180,140,60,0.15)", border: "1px solid rgba(180,140,60,0.4)" }} />
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ fontSize: "11px", letterSpacing: "8px", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
          @ S W E G B G T R A D I N G
        </motion.p>
      </motion.section>
    </main>
  );
}