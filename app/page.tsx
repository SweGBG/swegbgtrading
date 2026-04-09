"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function Home() {
  const kategorier = [
    { href: "/kaffe", src: "/images/logo.png", label: "KAFFE" },
    { href: "/te", src: "/images/logo3a.png", label: "TE" },
    { href: "/kaffekoppar", src: "/images/logo3muggar.png", label: "MUGGAR" },
  ];

  return (
    <main style={{ minHeight: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0a0a0a 60%)" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(180,140,60,0.12) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, left: "30%", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,160,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

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

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: "relative", zIndex: 1 }}
      >
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
            }}
          />
        ))}

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
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
          <div style={{
            position: "absolute", width: "320px", height: "320px",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,140,60,0.06) 0%, transparent 70%)",
          }} />
          <Image
            src="/images/hlogo2.png"
            alt="SweGBG Trading"
            width={693} height={260} priority
            style={{
              width: "100%", maxWidth: "480px", objectFit: "contain",
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

        {/* KATEGORIER */}
        <div style={{ display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap", padding: "0 20px" }}>
          {kategorier.map((kat, i) => (
            <motion.div
              key={kat.href}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
            >
              <Link href={kat.href} style={{ textDecoration: "none", color: "inherit", outline: "none" }}>
                <div style={{ cursor: "pointer", textAlign: "center", position: "relative", padding: "30px" }}>

                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
                    style={{ position: "absolute", inset: "-8px", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.4)", zIndex: 0 }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.07, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 2 + 0.7 }}
                    style={{ position: "absolute", inset: "4px", borderRadius: "50%", border: "1px solid rgba(180,140,60,0.25)", zIndex: 0 }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <Image
                      src={kat.src} alt={kat.label}
                      width={260} height={260}
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        display: "block",
                        boxShadow: "0 0 40px rgba(180,140,60,0.2), 0 8px 32px rgba(0,0,0,0.5)",
                        objectFit: "cover",
                        objectPosition: "center 30%",
                      }}
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    style={{ marginTop: "20px", fontWeight: "700", fontSize: "12px", letterSpacing: "6px", color: "rgba(255,255,255,0.4)", position: "relative", zIndex: 1 }}
                  >
                    {kat.label}
                  </motion.p>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2 + i * 0.2 }}
                    style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.5), transparent)", margin: "8px auto 0", position: "relative", zIndex: 1 }}
                  />

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ textAlign: "center", marginTop: "60px", paddingBottom: "60px", fontSize: "10px", letterSpacing: "8px", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}
        >
          GÖTEBORG — EST. 2026
        </motion.p>

      </motion.section>
    </main>
  );
}