"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";

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
        email,
        password,
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
    else setMessage("Återställningslänk skickad till din e-post! ✓");
  };

  return (
    <main className="medlem-page">
      <div>
        <div style={{ paddingTop: '63px' }}>
          {/* Header */}
          <div className="medlem-header">
            <p>Göteborg · Worldwide</p>
            <h1>SweGBG</h1>
            <p>Trading</p>
          </div>

          {/* Kort */}
          <div className="medlem-card">
            {/* Tabs */}
            <div className="medlem-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              >
                Logga in
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => { setMode("register"); setError(""); setMessage(""); }}
              >
                Skapa konto
              </button>
            </div>

            {/* Formulär */}
            <form className="medlem-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div>
                  <label>Namn</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ditt namn"
                  />
                </div>
              )}

              <div>
                <label>E-post</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                />
              </div>

              <div>
                <label>Lösenord</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={handleForgotPassword}
                >
                  Glömt lösenordet?
                </button>
              )}

              {error && <p className="error-msg">{error}</p>}
              {message && <p className="success-msg">{message}</p>}

              <button type="submit" className="medlem-submit" disabled={loading}>
                {loading ? "Laddar..." : mode === "login" ? "Logga in" : "Skapa konto"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: '2rem' }}>
            © {new Date().getFullYear()} SweGBG Trading · Göteborg
          </p>
        </div>  {/* ← stänger paddingTop-div */}
      </div>    {/* ← stänger yttre div */}
    </main>
  );
}
