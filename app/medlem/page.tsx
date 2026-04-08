"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MedlemPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Fel e-post eller lösenord");
      else router.push("/konto");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) setError(error.message);
      else setMessage("Kolla din e-post och bekräfta kontot! ✓");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Ange din e-post först"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/konto/reset`,
    });
    if (error) setError(error.message);
    else setMessage("Återställningslänk skickad! ✓");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* BAKGRUND */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0a0a0a 60%)" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "800px", height: "300px", background: "radial-gradient(ellipse, rgba(180,140,60,0.12) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, left: "30%", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,160,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* HEXMÖNSTER */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
            <polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke="rgba(180,140,60,0.1)" strokeWidth="0.5" />
            <circle cx="40" cy="46" r="1.5" fill="rgba(180,140,60,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      {/* INNEHÅLL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", padding: "20px" }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
            Göteborg · Worldwide
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "4px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>
            SweGBG
          </h1>
          <p style={{ fontSize: "11px", letterSpacing: "6px", color: "rgba(180,140,60,0.4)", textTransform: "uppercase" }}>
            Trading
          </p>
          <div style={{ width: "80px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,140,60,0.4), transparent)", margin: "16px auto 0" }} />
        </div>

        {/* KORT */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(180,140,60,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {/* TABS */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(""); setMessage(""); }}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  background: mode === tab ? "rgba(180,140,60,0.08)" : "transparent",
                  color: mode === tab ? "rgba(180,140,60,0.9)" : "rgba(255,255,255,0.25)",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderBottom: mode === tab ? "1px solid rgba(180,140,60,0.5)" : "1px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {tab === "login" ? "Logga in" : "Skapa konto"}
              </button>
            ))}
          </div>

          {/* FORMULÄR */}
          <form onSubmit={handleSubmit} style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {mode === "register" && (
              <div>
                <label style={labelStyle}>Namn</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ditt namn" style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>E-post</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@epost.se" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Lösenord</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>

            {mode === "login" && (
              <button type="button" onClick={handleForgotPassword} style={{ background: "none", border: "none", color: "rgba(180,140,60,0.5)", fontSize: "12px", cursor: "pointer", textAlign: "right", letterSpacing: "1px" }}>
                Glömt lösenordet?
              </button>
            )}

            {error && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", color: "rgba(255,80,80,0.8)", fontSize: "13px", textAlign: "center" }}>
                {error}
              </div>
            )}
            {message && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(180,140,60,0.08)", border: "1px solid rgba(180,140,60,0.2)", color: "rgba(180,140,60,0.9)", fontSize: "13px", textAlign: "center" }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(180,140,60,0.85), rgba(232,192,106,0.85))",
                color: loading ? "rgba(255,255,255,0.2)" : "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {loading ? "Laddar..." : mode === "login" ? "Logga in" : "Skapa konto"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.08)", marginTop: "24px", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} SweGBG Trading · Göteborg
        </p>
      </motion.div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "3px",
  color: "rgba(180,140,60,0.5)",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  color: "rgba(255,255,255,0.8)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};