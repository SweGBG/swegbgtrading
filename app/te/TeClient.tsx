"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${6 + i * 8}%`,
  bottom: `${8 + (i % 3) * 18}%`,
  size: i % 3 === 0 ? "3px" : "2px",
  color: i % 2 === 0 ? "rgba(60,160,100,0.5)" : "rgba(255,255,255,0.15)",
  duration: 4 + (i % 4),
  delay: i * 0.5,
}));

const HEXAGONS = Array.from({ length: 18 }, (_, i) => ({
  x: `${5 + (i % 6) * 17}%`,
  y: `${10 + Math.floor(i / 6) * 30}%`,
  size: 40 + (i % 3) * 20,
  delay: i * 0.15,
  opacity: 0.04 + (i % 4) * 0.02,
}));

function Hexagon({ x, y, size, delay, opacity }: {
  x: string; y: string; size: number; delay: number; opacity: number;
}) {
  const s = size;
  const h = s * 0.866;
  const points = [
    `${s / 2},0`, `${s},${h / 2}`, `${s},${h * 1.5}`,
    `${s / 2},${h * 2}`, `0,${h * 1.5}`, `0,${h / 2}`,
  ].join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: opacity, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
    >
      <motion.svg
        width={s} height={h * 2}
        animate={{ rotate: [0, 3, -3, 0], opacity: [opacity, opacity * 2.5, opacity] }}
        transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <polygon points={points} fill="none" stroke="rgba(60,160,100,0.6)" strokeWidth="0.8" />
        <polygon points={points} fill="rgba(60,160,100,0.03)" />
      </motion.svg>
    </motion.div>
  );
}

export default function TeClient() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(40,120,80,0.08) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 80%, rgba(20,80,60,0.06) 0%, transparent 50%)
        `,
      }} />

      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tegrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="80" x2="80" y2="0" stroke="rgba(255,255,255,0.01)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="80" y2="80" stroke="rgba(60,160,100,0.02)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tegrid)" />
      </svg>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {HEXAGONS.map((h, i) => (
          <Hexagon key={i} {...h} />
        ))}
      </div>

      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          style={{
            position: "fixed", left: p.left, bottom: p.bottom,
            width: p.size, height: p.size,
            borderRadius: "50%", background: p.color,
            pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative", zIndex: 1,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 20px",
        }}
      >
        {/* Pulsande orb */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "rgba(60,160,100,0.8)", marginBottom: "20px",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "10px", letterSpacing: "7px",
            color: "rgba(60,160,100,0.5)",
            textTransform: "uppercase", marginBottom: "16px",
          }}
        >
          SweGBG Trading — Est. 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(80px, 18vw, 160px)",
            fontWeight: "900", letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.92)",
            lineHeight: 0.9, marginBottom: "0",
          }}
        >
          Te
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{
            width: "160px", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(60,160,100,0.7), transparent)",
            margin: "32px 0",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            fontSize: "13px", letterSpacing: "8px",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase", marginBottom: "40px",
          }}
        >
          Kommer snart
        </motion.p>

        {/* Pulsringar */}
        <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "48px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: `${i * -20}px`,
                borderRadius: "50%",
                border: "1px solid rgba(60,160,100,0.3)",
              }}
            />
          ))}
          <div style={{
            position: "absolute", inset: "40px",
            borderRadius: "50%",
            background: "rgba(60,160,100,0.1)",
            border: "1px solid rgba(60,160,100,0.4)",
          }} />
        </div>

        {/* Tre info-chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "60px" }}
        >
          {["Grönt te", "Svart te", "Örtte"].map((label, i) => (
            <motion.div
              key={label}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
              style={{
                padding: "8px 20px",
                border: "1px solid rgba(60,160,100,0.25)",
                borderRadius: "20px",
                fontSize: "10px", letterSpacing: "3px",
                color: "rgba(60,160,100,0.6)",
                textTransform: "uppercase",
                background: "rgba(60,160,100,0.04)",
              }}
            >
              {label}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            fontSize: "10px", letterSpacing: "8px",
            color: "rgba(255,255,255,0.08)",
            textTransform: "uppercase",
          }}
        >
          SweGBG Trading
        </motion.p>

      </motion.section>
    </main>
  );
}