"use client";
import { useState } from "react";

type ScrapeResult = {
  success: boolean;
  action: string;
  extract?: any;
  markdown?: string | null;
  url?: string;
  scrapedAt?: string;
  query?: string;
  results?: SearchResult[];
  resultCount?: number;
  searchedAt?: string;
};

type SearchResult = {
  title: string;
  url: string;
  description: string;
  extract: any;
};

const MODES = [
  { id: "general", label: "Allmänt", icon: "🔍" },
  { id: "priser", label: "Priser", icon: "💰" },
  { id: "seo", label: "SEO", icon: "📊" },
];

const ACTIONS = [
  { id: "scrape", label: "Scrapa URL", icon: "🔥" },
  { id: "search", label: "Sök webben", icon: "🌐" },
];

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  activeTab: string;
};

export default function WebScraper({ open, setOpen, activeTab }: Props) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("general");
  const [action, setAction] = useState("scrape");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setExpandedResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(action === "search" ? { query: input.trim() } : { url: input.trim() }),
          mode,
          action,
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Kunde inte nå servern");
    }
    setLoading(false);
  }

  return (
    <>
      {activeTab === 'tools' && <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "2px solid rgba(180,140,60,0.5)",
          background: open ? "#1a1510" : "linear-gradient(135deg, #1a1510, #2a1f10)",
          color: "#e8c06a",
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(180,140,60,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        {open ? "✕" : "🔥"}
      </button>}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            zIndex: 9998,
            width: 440,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            background: "#0f0d08",
            border: "1px solid rgba(180,140,60,0.3)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(180,140,60,0.2)", background: "rgba(180,140,60,0.05)" }}>
            <span style={{ color: "#e8c06a", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>🔥 WEB SCRAPER</span>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              Scrapa priser, SEO-data & innehåll från vilken sida som helst
            </p>
          </div>

          {/* Action-väljare */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(180,140,60,0.1)" }}>
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => { setAction(a.id); setResult(null); setError(""); setInput(""); }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  borderBottom: action === a.id ? "2px solid rgba(180,140,60,0.6)" : "2px solid transparent",
                  background: action === a.id ? "rgba(180,140,60,0.06)" : "transparent",
                  color: action === a.id ? "#e8c06a" : "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  fontWeight: action === a.id ? 700 : 400,
                  cursor: "pointer",
                  letterSpacing: 1,
                  transition: "all 0.15s",
                }}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(180,140,60,0.1)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder={action === "search" ? "Sök t.ex. 'espresso muggar pris sverige'" : "https://example.com"}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(180,140,60,0.2)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                onClick={run}
                disabled={loading || !input.trim()}
                style={{
                  background: loading ? "rgba(180,140,60,0.1)" : "rgba(180,140,60,0.2)",
                  border: "1px solid rgba(180,140,60,0.3)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  color: "#e8c06a",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "⏳" : action === "search" ? "Sök" : "Scrapa"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    border: mode === m.id ? "1px solid rgba(180,140,60,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: mode === m.id ? "rgba(180,140,60,0.1)" : "transparent",
                    color: mode === m.id ? "#e8c06a" : "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resultat */}
          <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
            {loading && (
              <div style={{ textAlign: "center", color: "rgba(180,140,60,0.6)", fontSize: 14, marginTop: 30 }}>
                ⏳ {action === "search" ? `Söker: "${input}"` : `Scrapar ${input}`}...
              </div>
            )}

            {error && (
              <div style={{ color: "#e74c3c", fontSize: 13, padding: 12, background: "rgba(231,76,60,0.1)", borderRadius: 10 }}>
                {error}
              </div>
            )}

            {result && result.action === "search" && !loading && (
              <>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                  🌐 {result.resultCount} resultat för "{result.query}" — {new Date(result.searchedAt!).toLocaleString("sv-SE")}
                </div>
                {result.results?.map((r, i) => (
                  <div key={i} style={{ marginBottom: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
                    <div
                      onClick={() => setExpandedResult(expandedResult === i ? null : i)}
                      style={{ padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#e8c06a", marginBottom: 4 }}>{r.title}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", wordBreak: "break-all" }}>{r.url}</p>
                        {r.description && (
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, lineHeight: 1.4 }}>
                            {r.description.substring(0, 120)}{r.description.length > 120 ? "..." : ""}
                          </p>
                        )}
                      </div>
                      <span style={{ color: "rgba(180,140,60,0.4)", fontSize: 14, flexShrink: 0 }}>
                        {expandedResult === i ? "▼" : "►"}
                      </span>
                    </div>
                    {expandedResult === i && r.extract && (
                      <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <RenderExtract data={r.extract} mode={mode} />
                      </div>
                    )}
                  </div>
                ))}
                {result.results?.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", marginTop: 20 }}>
                    Inga resultat hittades.
                  </p>
                )}
              </>
            )}

            {result && result.action === "scrape" && !loading && (
              <>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                  ✓ {result.url} — {new Date(result.scrapedAt!).toLocaleString("sv-SE")}
                </div>
                {result.extract && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: "#e8c06a", marginBottom: 8, textTransform: "uppercase" }}>
                      Extraherad data
                    </div>
                    <RenderExtract data={result.extract} mode={mode} />
                  </div>
                )}
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", padding: "4px 0" }}
                >
                  {showRaw ? "▼ Dölj rå-data" : "► Visa rå-data"}
                </button>
                {showRaw && (
                  <pre style={{ marginTop: 8, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.5)", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 300, overflowY: "auto" }}>
                    {JSON.stringify(result.extract, null, 2)}
                  </pre>
                )}
              </>
            )}

            {!result && !loading && !error && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 13 }}>
                  {action === "search" ? "Skriv en sökfråga och välj läge" : "Klistra in en URL och välj läge"}
                </p>
                <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.1)", lineHeight: 2 }}>
                  🌐 Sök webben efter produkter & priser<br />
                  💰 Scrapa konkurrenters priser<br />
                  📊 Analysera SEO på valfri sida<br />
                  🔍 Hämta innehåll och data
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function RenderExtract({ data, mode }: { data: any; mode: string }) {
  if (!data) return null;

  if (mode === "priser" && Array.isArray(data)) {
    return (
      <div>
        {data.map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{item.name}</span>
            <span style={{ color: "#e8c06a", fontWeight: 700 }}>{item.price} {item.currency || "kr"}</span>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "seo" && typeof data === "object" && !Array.isArray(data)) {
    return (
      <div style={{ fontSize: 13 }}>
        {data.title && <div style={{ marginBottom: 8 }}><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>TITLE:</span><p style={{ color: "#fff", margin: "2px 0" }}>{data.title}</p></div>}
        {data.description && <div style={{ marginBottom: 8 }}><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>META DESC:</span><p style={{ color: "rgba(255,255,255,0.7)", margin: "2px 0" }}>{data.description}</p></div>}
        {data.h1s?.length > 0 && <div style={{ marginBottom: 8 }}><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>H1:</span>{data.h1s.map((h: string, i: number) => <p key={i} style={{ color: "rgba(255,255,255,0.7)", margin: "2px 0" }}>{h}</p>)}</div>}
        {data.h2s?.length > 0 && <div><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>H2:</span>{data.h2s.map((h: string, i: number) => <p key={i} style={{ color: "rgba(255,255,255,0.6)", margin: "2px 0", fontSize: 12 }}>{h}</p>)}</div>}
      </div>
    );
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <div style={{ fontSize: 13 }}>
        {data.summary && <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 12, lineHeight: 1.5 }}>{data.summary}</p>}
        {data.products?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: "#e8c06a", fontSize: 11 }}>PRODUKTER:</span>
            {data.products.map((p: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "rgba(255,255,255,0.6)" }}>
                <span>{p.name}</span>
                <span style={{ color: "#e8c06a" }}>{p.price}</span>
              </div>
            ))}
          </div>
        )}
        {data.keyFacts?.length > 0 && (
          <div>
            <span style={{ color: "#e8c06a", fontSize: 11 }}>FAKTA:</span>
            {data.keyFacts.map((f: string, i: number) => <p key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: "4px 0" }}>• {f}</p>)}
          </div>
        )}
      </div>
    );
  }

  return <pre style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>;
}