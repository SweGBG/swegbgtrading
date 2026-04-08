"use client";

import { useCart } from "../context/cartcontext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function VarukorgPage() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();
  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      {/* BAKGRUND */}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative", zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
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
          <h1 style={{ fontSize: "clamp(36px, 7vw, 64px)", fontWeight: "900", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "0", lineHeight: 1 }}>
            Varukorg
          </h1>
          <div style={{ marginTop: "20px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.4), transparent)" }} />
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: "center", paddingTop: "60px" }}
          >
            {/* TOM VARUKORG — pulserande ring */}
            <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 40px" }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                  style={{
                    position: "absolute",
                    inset: `${i * -16}px`,
                    borderRadius: "50%",
                    border: "1px solid rgba(180,140,60,0.3)",
                  }}
                />
              ))}
              <div style={{
                position: "absolute", inset: "30px",
                borderRadius: "50%",
                background: "rgba(180,140,60,0.1)",
                border: "1px solid rgba(180,140,60,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>
                🛒
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "4px", fontSize: "12px", textTransform: "uppercase", marginBottom: "32px" }}>
              Varukorgen är tom
            </p>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 40px",
                background: "transparent",
                border: "1px solid rgba(180,140,60,0.3)",
                borderRadius: "6px",
                color: "rgba(180,140,60,0.7)",
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}>
                Fortsätt handla
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* PRODUKTLISTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 24px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "10px",
                      marginBottom: "8px",
                      gap: "16px",
                    }}
                  >
                    {/* NAMN */}
                    <span style={{ fontWeight: "700", fontSize: "14px", letterSpacing: "1px", color: "rgba(255,255,255,0.8)", flex: 1 }}>
                      {item.name}
                    </span>

                    {/* +/- */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => removeFromCart(item.id)} style={btnStyle}>−</button>
                      <span style={{ minWidth: "20px", textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => addToCart({ ...item, quantity: 1 })} style={btnStyle}>+</button>
                    </div>

                    {/* PRIS */}
                    <span style={{ minWidth: "80px", textAlign: "right", fontWeight: "700", color: "rgba(180,140,60,0.8)", fontSize: "16px" }}>
                      {item.price * item.quantity} kr
                    </span>

                    {/* TA BORT */}
                    <button
                      onClick={() => { for (let i = 0; i < item.quantity; i++) removeFromCart(item.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: "14px", padding: "4px 8px", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,80,80,0.6)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* TOTALT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: "32px",
                padding: "24px",
                background: "rgba(180,140,60,0.05)",
                border: "1px solid rgba(180,140,60,0.15)",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "11px", letterSpacing: "4px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                Totalt att betala
              </span>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "rgba(180,140,60,0.9)" }}>
                {totalSum} <span style={{ fontSize: "14px", fontWeight: "400", opacity: 0.6 }}>kr</span>
              </span>
            </motion.div>

            {/* KNAPPAR */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
            >
              <button
                onClick={clearCart}
                style={{
                  padding: "13px 24px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,80,80,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                Töm varukorg
              </button>

              <Link href="/kassa" style={{ textDecoration: "none", flex: 1 }}>
                <button style={{
                  width: "100%",
                  padding: "14px 40px",
                  background: "linear-gradient(135deg, rgba(180,140,60,0.85), rgba(232,192,106,0.85))",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "12px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Till kassan →
                </button>
              </Link>
            </motion.div>
          </>
        )}

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", marginTop: "80px", fontSize: "10px", letterSpacing: "8px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}
        >
          SWEGBG TRADING — EST. 2026
        </motion.p>
      </motion.div>
    </main>
  );
}

const btnStyle: React.CSSProperties = {
  width: "30px",
  height: "30px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.6)",
  transition: "all 0.2s",
};