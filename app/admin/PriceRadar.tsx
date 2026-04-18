"use client";
import { useState } from "react";

type Product = { name: string; price: number };
type ScrapedData = {
  timestamp: string;
  swegbg: { muggar: Product[]; kaffe: Product[] };
  competitors: Record<string, { kaffe: Product[] | null; muggar: Product[] | null }>;
};

export default function PriceRadar() {
  const [data, setData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function fetchPrices() {
    setLoading(true);
    try {
      const res = await fetch("/api/scrape-prices");
      const json = await res.json();
      setData(json);
    } catch {
      alert("Kunde inte hämta priser");
    }
    setLoading(false);
  }

  function diff(swegbgPrice: number, competitorPrice: number) {
    const d = swegbgPrice - competitorPrice;
    const pct = ((d / competitorPrice) * 100).toFixed(0);
    if (d > 0) return { text: `+${d} kr (+${pct}%)`, color: "#e74c3c" };
    if (d < 0) return { text: `${d} kr (${pct}%)`, color: "#2ecc71" };
    return { text: "Lika", color: "#f39c12" };
  }

  return (
    <>
      <button
        onClick={() => { setOpen(!open); if (!data && !open) fetchPrices(); }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          color: "#fff",
          border: "2px solid #e94560",
          borderRadius: 16,
          padding: "14px 22px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(233,69,96,0.3)",
        }}
      >
        {open ? "✕ Stäng" : "📊 Price Radar"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            zIndex: 9998,
            width: 420,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#0f0f23",
            border: "1px solid #e94560",
            borderRadius: 16,
            padding: 24,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>🔥 SweGBG Price Radar</h3>
            <button
              onClick={fetchPrices}
              disabled={loading}
              style={{
                background: "#e94560",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Scrapar..." : "↻ Uppdatera"}
            </button>
          </div>

          {data?.timestamp && (
            <p style={{ fontSize: 11, color: "#888", margin: "0 0 16px" }}>
              Senast: {new Date(data.timestamp).toLocaleString("sv-SE")}
            </p>
          )}

          {!data && !loading && (
            <p style={{ color: "#aaa", fontSize: 14 }}>Tryck Uppdatera för att scrapa priser...</p>
          )}

          {loading && <p style={{ color: "#e94560", fontSize: 14 }}>⏳ Scrapar konkurrenterna...</p>}

          {data && (
            <>
              {/* MUGGAR */}
              <Section title="☕ Muggar">
                <PriceRow label="SweGBG Espresso Mug" price={299} isSelf />
                {data.competitors.ahles?.muggar?.map((m: Product, i: number) => (
                  <PriceRow key={i} label={`Åhléns: ${m.name}`} price={m.price} diff={diff(299, m.price)} />
                ))}
                {!data.competitors.ahles?.muggar && (
                  <p style={{ fontSize: 12, color: "#666" }}>Inga muggpriser hittade hos Åhléns</p>
                )}
              </Section>

              {/* KAFFE */}
              <Section title="🫘 Kaffe">
                {data.swegbg.kaffe.map((k: Product, i: number) => (
                  <PriceRow key={i} label={`SweGBG: ${k.name}`} price={k.price} isSelf />
                ))}
                {Object.entries(data.competitors).map(([name, comp]) =>
                  comp.kaffe?.map((k: Product, i: number) => (
                    <PriceRow
                      key={`${name}-${i}`}
                      label={`${name}: ${k.name}`}
                      price={k.price}
                      diff={diff(data.swegbg.kaffe[0]?.price || 0, k.price)}
                    />
                  ))
                )}
              </Section>
            </>
          )}
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 14, color: "#e94560", margin: "0 0 8px", borderBottom: "1px solid #222", paddingBottom: 6 }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function PriceRow({ label, price, isSelf, diff: d }: {
  label: string; price: number; isSelf?: boolean;
  diff?: { text: string; color: string };
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "6px 0", borderBottom: "1px solid #1a1a3a", fontSize: 13,
    }}>
      <span style={{ color: isSelf ? "#f1c40f" : "#ccc", flex: 1 }}>{label}</span>
      <span style={{ fontWeight: 700, marginRight: 8 }}>{price} kr</span>
      {d && <span style={{ color: d.color, fontSize: 12, fontWeight: 600 }}>{d.text}</span>}
      {isSelf && <span style={{ fontSize: 11, color: "#f1c40f" }}>⭐ DIN</span>}
    </div>
  );
}