"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { useState } from "react";

const kategorier = [
  { href: "/kaffe", src: "/images/logo11a.png", label: "KAFFE" },
  { href: "/te", src: "/images/logo993.png", label: "TE" },
  { href: "/kaffemuggar", src: "/images/logo333a.png", label: "MUGGAR" },
];

const PATHS = [
  { startX: "-120vw", startY: "-60vh", startRotate: -720, delay: 0.6 },
  { startX: "0vw", startY: "-130vh", startRotate: 540, delay: 0.9 },
  { startX: "120vw", startY: "-60vh", startRotate: 720, delay: 1.2 },
];

function Mynt({ kat, path, index }: { kat: typeof kategorier[0]; path: typeof PATHS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [landed, setLanded] = useState(false);

  return (
    <motion.div
      initial={{ x: path.startX, y: path.startY, rotate: path.startRotate, opacity: 0, scale: 0.4 }}
      animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      transition={{
        delay: path.delay,
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.3, delay: path.delay },
      }}
      onAnimationComplete={() => setLanded(true)}
    >
      <Link href={kat.href} style={{ textDecoration: "none", color: "inherit", outline: "none" }}>
        <div
          style={{ cursor: "pointer", textAlign: "center", position: "relative", padding: "30px" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {landed && (
            <>
              <motion.div
                animate={{ scale: [1, 1.14, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 1.8 }}
                style={{ position: "absolute", inset: "-8px", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.4)", zIndex: 0 }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 1.8 + 0.8 }}
                style={{ position: "absolute", inset: "4px", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.2)", zIndex: 0 }}
              />
            </>
          )}

          {landed && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(180,140,60,0.35) 0%, transparent 70%)",
                zIndex: 0, pointerEvents: "none",
              }}
            />
          )}

          <motion.div
            animate={hovered ? { y: [-4, 4, -4], rotate: [-2, 2, -2] } : { y: 0, rotate: 0 }}
            transition={hovered ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <motion.div whileTap={{ scale: 0.93, rotate: 8 }} transition={{ type: "spring", stiffness: 350, damping: 18 }}>
              <Image
                src={kat.src}
                alt={kat.label}
                width={260}
                height={260}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  boxShadow: hovered
                    ? "0 0 60px rgba(180,140,60,0.5), 0 12px 40px rgba(0,0,0,0.6)"
                    : "0 0 40px rgba(180,140,60,0.2), 0 8px 32px rgba(0,0,0,0.5)",
                  objectFit: "cover",
                  objectPosition: "center 30%",
                  transition: "box-shadow 0.4s ease",
                }}
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={landed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: "20px", fontWeight: "700", fontSize: "12px", letterSpacing: "6px",
              color: hovered ? "rgba(180,140,60,0.8)" : "rgba(255,255,255,0.4)",
              position: "relative", zIndex: 1, transition: "color 0.3s ease",
            }}
          >
            {kat.label}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={landed ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{
              width: "40px", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.5), transparent)",
              margin: "8px auto 0", position: "relative", zIndex: 1,
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

      {/* Bakgrund */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0a0a0a 60%)" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(180,140,60,0.12) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, left: "30%", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,160,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* Hex-grid */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
            <polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke="rgba(180,140,60,0.1)" strokeWidth="0.5" />
            <polygon points="40,18 62,30 62,62 40,74 18,62 18,30" fill="none" stroke="rgba(180,140,60,0.04)" strokeWidth="0.5" />
            <circle cx="40" cy="46" r="1.5" fill="rgba(180,140,60,0.12)" />
          </pattern>
          <pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="40" x2="40" y2="0" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>

      {/* Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -80, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            left: `${8 + i * 8}%`,
            bottom: `${10 + (i % 3) * 15}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(180,140,60,0.6)" : "rgba(255,255,255,0.3)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Demo banner */}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 1, paddingTop: "40px" }}
      >
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "center", paddingTop: "20px", position: "relative" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", width: "360px", height: "360px",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "1px solid rgba(180,140,60,0.15)",
              borderTop: "1px solid rgba(180,140,60,0.5)",
              borderRight: "1px solid rgba(180,140,60,0.3)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", width: "300px", height: "300px",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "1px dashed rgba(180,140,60,0.1)",
              borderBottom: "1px solid rgba(180,140,60,0.3)",
            }}
          />
          {[0, 90, 180, 270].map((deg) => (
            <motion.div
              key={deg}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: deg / 360 * 2.5 }}
              style={{
                position: "absolute", width: "6px", height: "6px",
                borderRadius: "50%", background: "rgba(180,140,60,0.6)",
                top: "50%", left: "50%",
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-175px)`,
              }}
            />
          ))}
          <Image
            src="/images/hlogo2.png"
            alt="SweGBG Trading"
            width={693} height={260} priority
            style={{
              height: "auto", width: "100%", maxWidth: "480px", objectFit: "contain",
              filter: "drop-shadow(0 0 40px rgba(180,140,60,0.4)) drop-shadow(0 0 80px rgba(180,140,60,0.15))",
              position: "relative", zIndex: 1,
            }}
          />
        </motion.div>

        {/* LINJE */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ maxWidth: "400px", margin: "16px auto 24px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.4), transparent)" }}
        />

        {/* MYNTEN */}
        <div style={{ display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap", padding: "0 20px" }}>
          {kategorier.map((kat, i) => (
            <Mynt key={kat.href} kat={kat} path={PATHS[i]} index={i} />
          ))}
        </div>

        {/* Coming soon text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          style={{ textAlign: "center", marginTop: "48px", padding: "0 20px" }}
        >
          <p style={{
            fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase",
            color: "rgba(180,140,60,0.4)", margin: "0 0 8px",
          }}>
            Coming soon
          </p>
          <p style={{
            fontSize: "13px", color: "rgba(255,255,255,0.2)",
            letterSpacing: "1px", margin: 0, maxWidth: "420px",
            marginLeft: "auto", marginRight: "auto", lineHeight: 1.7,
          }}>
            Locally printed limited edition mugs — numbered #1 to #9.<br />
            Göteborg made. Never restocked.
          </p>
        </motion.div>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{
            textAlign: "center", marginTop: "48px", paddingBottom: "60px",
            fontSize: "10px", letterSpacing: "8px",
            color: "rgba(255,255,255,0.12)", textTransform: "uppercase",
          }}
        >
          GÖTEBORG — EST. 2026
        </motion.p>
      </motion.section>
    </main>
  );
}