"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useCart } from "../context/cartcontext";

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

function ProduktKort({ produkt, addToCart }: {
  produkt: Produkt;
  addToCart: (item: any) => void;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 100%", "center 60%"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 54, damping: 15 });

  // Bild — subtil zoom och lift
  const imgScale = useTransform(smooth, [0, 1], [1.04, 1]);
  const imgY = useTransform(smooth, [0, 1], [30, 0]);

  // Text — glider in från höger
  const textX = useTransform(smooth, [0, 1], [60, 0]);
  const textO = useTransform(smooth, [0, 0.3, 1], [0, 0, 1]);

  // Detaljer — popppar in lite senare
  const detailO = useTransform(smooth, [0, 0.5, 1], [0, 0, 1]);
  const detailY = useTransform(smooth, [0, 1], [20, 0]);

  return (
    <div ref={ref} style={{ marginBottom: "140px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "55% 1fr",
        gap: "60px",
        alignItems: "center",
      }}>

        {/* ── BILD ── */}
        <div style={{
          position: "relative",
          height: "560px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.65)",
        }}>
          <motion.img
            src="/images/produkt1.png"
            alt={produkt.Name}
            style={{
              position: "absolute",
              top: "0%",
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              scale: imgScale,
              y: imgY,
            }}
          />

          {/* Gradient */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 45%)",
            zIndex: 1,
            pointerEvents: "none",
          }} />

          {/* Badge */}
          <motion.div style={{
            position: "absolute",
            top: "20px", left: "20px",
            zIndex: 2,
            opacity: detailO,
            y: detailY,
            background: "rgba(180,140,60,0.9)",
            backdropFilter: "blur(6px)",
            color: "#000",
            fontSize: "9px",
            letterSpacing: "3px",
            padding: "6px 14px",
            borderRadius: "20px",
            textTransform: "uppercase",
            fontWeight: "800",
          }}>
            {produkt.badge}
          </motion.div>

          {/* Pris nere i hörnet */}
          <motion.div style={{
            position: "absolute",
            bottom: "20px", right: "20px",
            zIndex: 2,
            opacity: detailO,
            background: "rgba(10,10,10,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(180,140,60,0.25)",
            borderRadius: "12px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
          }}>
            <span style={{ fontSize: "24px", fontWeight: "900", color: "rgba(180,140,60,0.95)", letterSpacing: "-0.02em" }}>
              {produkt.price}
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>kr</span>
          </motion.div>
        </div>

        {/* ── TEXT ── */}
        <motion.div style={{ x: textX, opacity: textO }}>
          <span style={{ fontSize: "30px", display: "block", marginBottom: "14px" }}>
            {produkt.emoji}
          </span>

          <h2 style={{
            fontSize: "48px",
            fontWeight: "900",
            lineHeight: 1.0,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.92)",
            marginBottom: "0",
          }}>
            {produkt.Name}
          </h2>

          <div style={{
            width: "40px", height: "2px",
            background: "linear-gradient(90deg, rgba(180,140,60,0.85), transparent)",
            margin: "18px 0 24px",
            borderRadius: "2px",
          }} />

          <p style={{
            fontSize: "15px",
            lineHeight: "1.85",
            color: "rgba(255,255,255,0.35)",
            maxWidth: "340px",
            marginBottom: "44px",
          }}>
            {produkt.description}
          </p>

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 40px rgba(180,140,60,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => addToCart({
              id: String(produkt.id),
              name: produkt.Name,
              price: produkt.price,
              quantity: 1,
            })}
            style={{
              background: "linear-gradient(135deg, rgba(180,140,60,0.92) 0%, rgba(220,180,90,0.92) 100%)",
              color: "#0a0a0a",
              padding: "17px 48px",
              fontSize: "11px",
              fontWeight: "800",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "4px",
              display: "block",
              marginBottom: "14px",
            }}
          >
            Köp Nu
          </motion.button>

          <p style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}>
            Fri frakt över 500 kr
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function KaffeClient({ produkter }: { produkter: Produkt[] }) {
  const { addToCart } = useCart();

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* Ambient */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse at 15% 10%, rgba(180,140,60,0.055) 0%, transparent 55%),
          radial-gradient(ellipse at 90% 90%, rgba(30,50,130,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* Grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.011) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.011) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 28px",
        }}
      >
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            paddingTop: "120px",
            paddingBottom: "45px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(180,140,60,0.1)",
            marginBottom: "15px",
          }}
        >
          <div>
            <p style={{
              fontSize: "10px", letterSpacing: "7px",
              color: "rgba(180,140,60,0.4)",
              textTransform: "uppercase", marginBottom: "10px",
            }}>
              SweGBG Trading — Est. 2026
            </p>
            <h1 style={{
              fontSize: "82px", fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.92)",
            }}>
              Kaffe
            </h1>
          </div>

          <p style={{
            fontSize: "10px", letterSpacing: "4px",
            color: "rgba(255,255,255,0.12)",
            textTransform: "uppercase",
            textAlign: "right", lineHeight: 1.9,
          }}>
            Rostarens<br />Val
          </p>
        </motion.div>

        {/* PRODUKTER */}
        {produkter.map((p) => (
          <ProduktKort key={p.id} produkt={p} addToCart={addToCart} />
        ))}

        {/* FOOTER */}
        <div style={{ textAlign: "center", paddingBottom: "100px" }}>
          <p style={{
            letterSpacing: "10px", fontSize: "10px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.05)",
          }}>
            SweGBG Trading
          </p>
        </div>

      </motion.section>
    </main>
  );
}