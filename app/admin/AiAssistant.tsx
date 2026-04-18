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
      {/* Floating-knapp */}
      <button
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
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(180,140,60,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chattruta */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            zIndex: 9998,
            width: 380,
            maxHeight: "60vh",
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
              Din assistent för produkter, priser & strategi
            </p>
          </div>

          {/* Meddelanden */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, minHeight: 200 }}>
            {messages.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, textAlign: "center", marginTop: 40 }}>
                Fråga mig om produktidéer, prissättning, SEO...
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
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "rgba(180,140,60,0.15)" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "#e8c06a" : "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: "rgba(180,140,60,0.5)", fontSize: 13 }}>Tänker...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: "1px solid rgba(180,140,60,0.15)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Skriv till AI:n..."
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
              disabled={loading}
              style={{
                background: "rgba(180,140,60,0.2)",
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