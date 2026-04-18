"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "ai"; text: string };

export default function AiAssistant({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Fel — kunde inte nå AI:n." }]);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
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
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: 24,
            zIndex: 9998,
            width: 400,
            maxHeight: "65vh",
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
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(180,140,60,0.2)",
              background: "rgba(180,140,60,0.05)",
            }}
          >
            <span style={{ color: "#e8c06a", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
              🤖 SWEGBG AI
            </span>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              Produktidéer · Prissättning · SEO · Strategi
            </p>
          </div>

          {/* Snabbknappar */}
          <div style={{ padding: "10px 18px", borderBottom: "1px solid rgba(180,140,60,0.1)", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              "Produktidé för mugg",
              "SEO-tips",
              "Prissättningsstrategi",
              "Skriv produkttext",
            ].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                style={{
                  padding: "5px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(180,140,60,0.2)",
                  background: "rgba(180,140,60,0.06)",
                  color: "rgba(180,140,60,0.7)",
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Meddelanden */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, minHeight: 200 }}>
            {messages.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 13, textAlign: "center", marginTop: 40, lineHeight: 2 }}>
                Fråga mig om vad som helst<br />
                för din butik och ditt varumärke
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "rgba(180,140,60,0.15)" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "#e8c06a" : "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "rgba(180,140,60,0.4)",
                      animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
                <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: "1px solid rgba(180,140,60,0.15)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Fråga AI:n..."
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
              onClick={send}
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
              }}
            >
              Skicka
            </button>
          </div>
        </div>
      )}
    </>
  );
}