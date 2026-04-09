"use client";

import { motion } from "framer-motion";
import { useCart } from "../context/cartcontext";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";

type Produkt = {
  id: number;
  Name: string;
  price: number;
  emoji: string;
  badge: string;
  category: string;
  description: string;
  image_url: string;
};

export default function KaffekopparPage() {
  const { addToCart } = useCart();
  const supabase = createClient(); // ← inne i komponenten nu
  const [produkter, setProdukter] = useState<Produkt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdukter() {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("category", "Kaffekoppar");

      if (error) console.error("Supabase-fel:", error);
      else setProdukter(data || []);
      setLoading(false);
    }
    fetchProdukter();
  }, []);

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <p style={{ letterSpacing: "6px", fontSize: "12px", textTransform: "uppercase", color: "rgba(180,140,60,0.5)" }}>
        Laddar...
      </p>
    </div>
  );

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", overflow: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 30% 20%, rgba(180,140,60,0.07) 0%, transparent 50%)" }} />
      <div style={{ position: "fixed", bottom: 0, left: "30%", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,160,0.04) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

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
        style={{
          position: "relative", zIndex: 1,
          minHeight: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {/* HEADER */}
        <div style={{
          paddingTop: "110px",
          paddingBottom: "40px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(180,140,60,0.15)",
          marginBottom: "60px",
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ fontSize: "11px", letterSpacing: "6px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
              SWEGBG TRADING — EST. 2026
            </p>
            <h1 style={{ fontSize: "72px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1, color: "rgba(255,255,255,0.9)" }}>
              MUGGAR
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: "13px", letterSpacing: "4px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", textAlign: "right" }}
          >
            GBGS<br />FAVORIT
          </motion.p>
        </div>

        {/* PRODUKTER */}
        {produkter.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", paddingTop: "60px" }}
          >
            <p style={{ fontSize: "13px", letterSpacing: "6px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
              Kommer snart
            </p>
          </motion.div>
        ) : (
          produkter.map((produkt, index) => (
            <motion.div
              key={produkt.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + index * 0.15 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "center",
                marginBottom: "120px",
              }}
            >
              {/* BILD */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: "-16px",
                  background: "rgba(180,140,60,0.04)",
                  borderRadius: "28px", zIndex: 0,
                }} />
                <img
                  src="/images/logo3koppar.png"
                  alt={produkt.Name}
                  style={{ width: "100%", borderRadius: "20px", display: "block", position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                />
                <div style={{
                  position: "absolute", top: "20px", left: "20px", zIndex: 2,
                  background: "rgba(180,140,60,0.9)", color: "#000",
                  fontSize: "10px", letterSpacing: "3px", padding: "6px 14px",
                  borderRadius: "20px", textTransform: "uppercase", fontWeight: "700",
                }}>
                  {produkt.badge}
                </div>
              </div>

              {/* INFO */}
              <div>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>{produkt.emoji}</p>
                <h2 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "8px", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "0.02em", color: "rgba(255,255,255,0.9)" }}>
                  {produkt.Name}
                </h2>
                <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.6), transparent)", marginBottom: "24px" }} />
                <p style={{ fontSize: "17px", lineHeight: "1.8", color: "rgba(255,255,255,0.45)", marginBottom: "36px", maxWidth: "400px" }}>
                  {produkt.description}
                </p>
                <p style={{ fontSize: "36px", fontWeight: "900", marginBottom: "36px", letterSpacing: "-0.02em", color: "rgba(180,140,60,0.9)" }}>
                  {produkt.price} <span style={{ fontSize: "18px", fontWeight: "400", opacity: 0.5 }}>kr</span>
                </p>
                <button
                  onClick={() => addToCart({
                    id: String(produkt.id),
                    name: produkt.Name,
                    price: produkt.price,
                    quantity: 1,
                  })}
                  style={{
                    background: "linear-gradient(135deg, rgba(180,140,60,0.85), rgba(232,192,106,0.85))",
                    color: "#000", padding: "18px 48px", fontSize: "13px",
                    fontWeight: "700", border: "none", borderRadius: "6px",
                    cursor: "pointer", textTransform: "uppercase", letterSpacing: "3px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Köp Nu
                </button>
              </div>
            </motion.div>
          ))
        )}

        <div style={{ textAlign: "center", paddingBottom: "80px" }}>
          <p style={{ letterSpacing: "8px", fontSize: "11px", textTransform: "uppercase", color: "rgba(255,255,255,0.08)" }}>
            SWEGBG TRADING
          </p>
        </div>

      </motion.section>
    </main>
  );
}