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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
    <main className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <p className="tracking-[0.3em] text-xs text-gray-400 uppercase mb-2">
            Göteborg · Worldwide
          </p>
          <h1 className="text-4xl font-bold tracking-wide text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}>
            SweGBG
          </h1>
          <p className="text-sm text-gray-500 tracking-widest uppercase mt-1">
            Trading
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              className={`flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-200 ${mode === "login"
                ? "text-gray-900 border-b-2 border-yellow-500 bg-yellow-50"
                : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Logga in
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setMessage(""); }}
              className={`flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-200 ${mode === "register"
                ? "text-gray-900 border-b-2 border-yellow-500 bg-yellow-50"
                : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Skapa konto
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                    Namn
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ditt namn"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                  Lösenord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-yellow-600 hover:text-yellow-700 tracking-wide"
                  >
                    Glömt lösenordet?
                  </button>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 font-medium text-center bg-red-50 rounded-lg py-2">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-green-600 font-medium text-center bg-green-50 rounded-lg py-2">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gray-900 text-white text-sm font-semibold tracking-widest uppercase hover:bg-yellow-500 hover:text-gray-900 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Laddar..." : mode === "login" ? "Logga in" : "Skapa konto"}
              </button>
            </form>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} SweGBG Trading · Göteborg
        </p>
      </div>
    </main>
  );
}