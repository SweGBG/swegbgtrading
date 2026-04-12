"use client";

import { motion } from "framer-motion";

export default function TeClient() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 30%, rgba(40,100,80,0.08) 0%, transparent 60%)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}
      >
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(60,160,100,0.6)", textTransform: "uppercase", marginBottom: "24px" }}>
          SWEGBG TRADING
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ fontSize: "clamp(48px, 10vw, 96px)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
          Te
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8 }} style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,160,100,0.6), transparent)", margin: "32px 0" }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontSize: "13px", letterSpacing: "6px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "60px" }}>
          Kommer snart
        </motion.p>

        <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "60px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeInOut" }} style={{ position: "absolute", inset: `${i * -20}px`, borderRadius: "50%", border: "1px solid rgba(60,160,100,0.3)" }} />
          ))}
          <div style={{ position: "absolute", inset: "40px", borderRadius: "50%", background: "rgba(60,160,100,0.1)", border: "1px solid rgba(60,160,100,0.4)" }} />
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ fontSize: "11px", letterSpacing: "8px", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
          @ S W E G B G T R A D I N G
        </motion.p>
      </motion.section>
    </main>
  );
}