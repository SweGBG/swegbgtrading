"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  left: `${8 + i * 9}%`,
  bottom: `${10 + (i % 3) * 15}%`,
  size: i % 3 === 0 ? "3px" : "2px",
  color: i % 2 === 0 ? "rgba(180,140,60,0.5)" : "rgba(255,255,255,0.2)",
  duration: 4 + (i % 4),
  delay: i * 0.6,
}));

function DemoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      style={{
        position: "fixed", top: "64px", left: 0, right: 0, zIndex: 40,
        background: "rgba(180,140,60,0.08)",
        borderBottom: "1px solid rgba(180,140,60,0.2)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
      }}
    >
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(180,140,60,0.8)", flexShrink: 0 }} />
      <p style={{ color: "rgba(180,140,60,0.7)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>
        This store is currently a demo — locally printed limited edition mugs coming soon. Stay tuned.
      </p>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(180,140,60,0.8)", flexShrink: 0 }} />
    </motion.div>
  );
}

function HeroEntrance({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{
      position: "relative",
      height: isMobile ? "300px" : "580px",
      borderRadius: isMobile ? "16px" : "24px",
      overflow: "hidden",
      boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
    }}>
      <motion.img
        src="/images/produkt1.png"
        alt="GBG Brew"
        initial={{ y: "100%", scale: 1.15, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: 1.1, delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.5, delay: 0.3 },
        }}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
        }}
      />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(160deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }} />
      {/* Demo overlay på hero-bilden */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(180,140,60,0.2)",
          borderRadius: "12px",
          padding: "14px 28px",
          textAlign: "center",
        }}>
          <p style={{
            color: "rgba(180,140,60,0.8)", fontSize: "10px",
            letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 4px",
          }}>Demo product</p>
          <p style={{
            color: "rgba(255,255,255,0.3)", fontSize: "11px",
            letterSpacing: "2px", margin: 0,
          }}>Real products coming soon</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", top: "18px", left: "18px", zIndex: 4,
          background: "rgba(180,140,60,0.92)",
          backdropFilter: "blur(8px)", color: "#000",
          fontSize: "9px", letterSpacing: "3px",
          padding: "6px 14px", borderRadius: "20px",
          textTransform: "uppercase", fontWeight: "800",
        }}
      >
        New
      </motion.div>
    </div>
  );
}

function ProduktKort({ produkt, addToCart, index, isFirst }: {
  produkt: Produkt;
  addToCart: (item: any) => void;
  index: number;
  isFirst: boolean;
}) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const [added, setAdded] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "center 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 54, damping: 15 });

  const imgScale = useTransform(smooth, [0, 1], [1.06, 1]);
  const imgY = useTransform(smooth, [0, 1], [40, 0]);
  const cardO = useTransform(smooth, [0, 0.4, 1], isFirst ? [1, 1, 1] : [0, 0, 1]);
  const cardY = useTransform(smooth, [0, 1], isFirst ? [0, 0] : [60, 0]);
  const textX = useTransform(smooth, [0, 1], isMobile ? [0, 0] : [80, 0]);
  const textO = useTransform(smooth, [0, 0.35, 1], isFirst ? [1, 1, 1] : [0, 0, 1]);
  const detailO = useTransform(smooth, [0, 0.55, 1], isFirst ? [1, 1, 1] : [0, 0, 1]);
  const detailY = useTransform(smooth, [0, 1], [24, 0]);
  const lineW = useTransform(smooth, [0.4, 1], isFirst ? [40, 40] : [0, 40]);

  const handleAdd = () => {
    addToCart({ id: String(produkt.id), name: produkt.Name, price: produkt.price, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div ref={ref} style={{ marginBottom: isMobile ? "80px" : "160px", opacity: cardO, y: cardY }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "56% 1fr",
        gap: isMobile ? "28px" : "64px",
        alignItems: "center",
      }}>

        {isFirst ? (
          <HeroEntrance isMobile={isMobile} />
        ) : (
          <div style={{
            position: "relative",
            height: isMobile ? "300px" : "580px",
            borderRadius: isMobile ? "16px" : "24px",
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          }}>
            <motion.img
              src="/images/produkt1.png"
              alt={produkt.Name}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center 30%",
                scale: imgScale, y: imgY,
              }}
            />
            <div style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "linear-gradient(160deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }} />
            {/* Demo overlay */}
            <motion.div
              style={{
                position: "absolute", inset: 0, zIndex: 3,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none", opacity: detailO,
              }}
            >
              <div style={{
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(180,140,60,0.2)", borderRadius: "12px",
                padding: "12px 24px", textAlign: "center",
              }}>
                <p style={{ color: "rgba(180,140,60,0.8)", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 4px" }}>Demo product</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "2px", margin: 0 }}>Real products coming soon</p>
              </div>
            </motion.div>
            <motion.div style={{
              position: "absolute", top: "18px", left: "18px", zIndex: 2,
              opacity: detailO, y: detailY,
              background: "rgba(180,140,60,0.92)", backdropFilter: "blur(8px)", color: "#000",
              fontSize: "9px", letterSpacing: "3px", padding: "6px 14px",
              borderRadius: "20px", textTransform: "uppercase", fontWeight: "800",
            }}>
              {produkt.badge}
            </motion.div>
            <motion.div style={{
              position: "absolute", bottom: "18px", right: "18px", zIndex: 2,
              opacity: detailO,
              background: "rgba(8,8,8,0.75)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(180,140,60,0.3)", borderRadius: "14px",
              padding: isMobile ? "8px 14px" : "10px 20px",
              display: "flex", alignItems: "baseline", gap: "4px",
            }}>
              <span style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: "900", color: "rgba(180,140,60,0.95)" }}>{produkt.price}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>kr</span>
            </motion.div>
          </div>
        )}

        <motion.div style={{ x: textX, opacity: isMobile ? 1 : textO, padding: isMobile ? "0 2px" : "0" }}>
          <motion.img
            src="/images/kaffeikon2.png" alt="kaffe"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
            style={{ width: isMobile ? "36px" : "44px", height: isMobile ? "36px" : "44px", objectFit: "contain", display: "block", marginBottom: "12px", borderRadius: "50%" }}
          />

          <h2 style={{
            fontSize: isMobile ? "38px" : "52px", fontWeight: "900", lineHeight: 0.98,
            textTransform: "uppercase", letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.93)", marginBottom: "0",
          }}>
            {produkt.Name}
          </h2>

          <motion.div style={{
            height: "2px", width: lineW,
            background: "linear-gradient(90deg, rgba(180,140,60,0.9), transparent)",
            margin: "16px 0 22px", borderRadius: "2px",
          }} />

          <p style={{
            fontSize: isMobile ? "14px" : "15px", lineHeight: "1.9",
            color: "rgba(255,255,255,0.32)",
            maxWidth: isMobile ? "100%" : "340px",
            marginBottom: isMobile ? "16px" : "24px",
          }}>
            {produkt.description}
          </p>

          {/* Demo notice under beskrivning */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              background: "rgba(180,140,60,0.06)",
              border: "1px solid rgba(180,140,60,0.15)",
              borderRadius: "8px", padding: "12px 16px",
              marginBottom: isMobile ? "24px" : "36px",
            }}
          >
            <p style={{ color: "rgba(180,140,60,0.6)", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 4px" }}>
              Demo product
            </p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>
              Locally printed limited edition mugs — numbered #1 to #9 — coming soon. Göteborg made. Never restocked.
            </p>
          </motion.div>

          {isMobile && isFirst && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
              style={{
                display: "inline-flex", alignItems: "baseline", gap: "4px",
                background: "rgba(8,8,8,0.75)", border: "1px solid rgba(180,140,60,0.3)",
                borderRadius: "14px", padding: "8px 16px", marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "22px", fontWeight: "900", color: "rgba(180,140,60,0.95)" }}>{produkt.price}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>kr</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 50px rgba(180,140,60,0.45)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            onClick={handleAdd}
            style={{
              background: added
                ? "linear-gradient(135deg, rgba(40,160,80,0.9), rgba(60,200,100,0.9))"
                : "linear-gradient(135deg, rgba(180,140,60,0.92), rgba(220,180,90,0.92))",
              color: "#0a0a0a",
              padding: isMobile ? "17px 0" : "18px 52px",
              fontSize: "11px", fontWeight: "800",
              border: "none", borderRadius: "8px",
              cursor: "pointer", textTransform: "uppercase",
              letterSpacing: "4px", display: "block",
              marginBottom: "14px",
              width: isMobile ? "100%" : "auto",
              transition: "background 0.4s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  Added to cart ✓
                </motion.span>
              ) : (
                <motion.span key="buy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  Add to cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.12)", letterSpacing: "2px", textTransform: "uppercase", textAlign: isMobile ? "center" : "left" }}>
            Free shipping over 500 kr
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function KaffeClient({ produkter }: { produkter: Produkt[] }) {
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", overflowX: "hidden" }}>

      <DemoBanner />

      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse at 15% 10%, rgba(180,140,60,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 90% 90%, rgba(30,50,130,0.04) 0%, transparent 55%)
        `,
      }} />

      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kgrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="80" x2="80" y2="0" stroke="rgba(255,255,255,0.012)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="80" y2="80" stroke="rgba(180,140,60,0.025)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kgrid)" />
      </svg>

      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -70, 0], opacity: [0, 0.5, 0] }}
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
        transition={{ duration: 0.5 }}
        style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 28px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            paddingTop: isMobile ? "108px" : "138px",
            paddingBottom: isMobile ? "22px" : "44px",
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            borderBottom: "1px solid rgba(180,140,60,0.1)",
            marginBottom: "24px",
          }}
        >
          <div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(180,140,60,0.8)", marginBottom: "12px" }}
            />
            <p style={{ fontSize: "10px", letterSpacing: isMobile ? "4px" : "7px", color: "rgba(180,140,60,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
              SweGBG Trading — Est. 2026
            </p>
            <h1 style={{ fontSize: isMobile ? "54px" : "84px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 0.93, color: "rgba(255,255,255,0.93)" }}>
              Kaffe
            </h1>
          </div>
          {!isMobile && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.1)", textTransform: "uppercase", textAlign: "right", lineHeight: 2 }}
            >
              Rostarens<br />Val
            </motion.p>
          )}
        </motion.div>

        {produkter.map((p, i) => (
          <ProduktKort key={p.id} produkt={p} addToCart={addToCart} index={i} isFirst={i === 0} />
        ))}

        <div style={{ textAlign: "center", paddingBottom: "90px" }}>
          <motion.div
            animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "60px", height: "1px", margin: "0 auto 16px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.5), transparent)" }}
          />
          <p style={{ letterSpacing: "10px", fontSize: "10px", textTransform: "uppercase", color: "rgba(255,255,255,0.05)" }}>
            SweGBG Trading
          </p>
        </div>
      </motion.section>
    </main>
  );
}