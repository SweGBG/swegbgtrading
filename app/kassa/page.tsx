"use client";

import { useCart } from "../context/cartcontext";
import { createClient } from "@/utils/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KassaPage() {
  const { cart, clearCart } = useCart();
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setForm(prev => ({ ...prev, email: user.email ?? "" }));

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          const nameParts = (profile.full_name ?? "").split(" ");
          setForm(prev => ({
            ...prev,
            firstName: nameParts[0] ?? "",
            lastName: nameParts.slice(1).join(" ") ?? "",
            address: profile.address ?? "",
            postalCode: profile.zip_code ?? "",
            city: profile.city ?? "",
            phone: profile.phone ?? "",
          }));
        }
      }
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const required = ["firstName", "lastName", "email", "address", "postalCode", "city"];
    const missing = required.filter(k => !form[k as keyof typeof form]);

    if (missing.length > 0) {
      alert("Fyll i alla obligatoriska fält.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          userId: user?.id || null, // Automatiserar ID-kopplingen!
          customerDetails: form        // Skickar med adressen också
        }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Betalningsfel:", err);
      alert("Något gick fel med betalningen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <div style={styles.card}>
          <h1 style={styles.title}>KASSA</h1>

          {!user && (
            <div style={styles.loginBanner}>
              <span>Har du ett konto? </span>
              <Link href="/medlem" style={{ color: "#c9a84c", fontWeight: 600 }}>Logga in</Link>
              <span> för snabbare utcheckning.</span>
            </div>
          )}

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Kontaktuppgifter</h2>
            <div style={styles.row}>
              <Field label="Förnamn *" name="firstName" value={form.firstName} onChange={handleChange} />
              <Field label="Efternamn *" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
            <Field label="E-post *" name="email" value={form.email} onChange={handleChange} type="email" />
            <Field label="Telefon" name="phone" value={form.phone} onChange={handleChange} type="tel" />
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Leveransadress</h2>
            <Field label="Gatuadress *" name="address" value={form.address} onChange={handleChange} />
            <div style={styles.row}>
              <Field label="Postnummer *" name="postalCode" value={form.postalCode} onChange={handleChange} />
              <Field label="Stad *" name="city" value={form.city} onChange={handleChange} />
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Betalning</h2>
            <div style={styles.stripePlaceholder}>
              🔒 Säker kortbetalning via Stripe
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Skickar till betalning..." : `Lägg beställning — ${total} kr`}
          </button>
        </div>

        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Din order</h2>
          {cart.length === 0 ? (
            <p style={{ color: "#999", fontSize: "0.9rem" }}>Varukorgen är tom.</p>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={styles.orderItem}>
                <span>{item.name}</span>
                <span style={{ color: "#888", fontSize: "0.85rem" }}>×{item.quantity}</span>
                <span style={{ marginLeft: "auto" }}>{item.price * (item.quantity ?? 1)} kr</span>
              </div>
            ))
          )}

          <div style={styles.divider} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
            <span>Totalt</span>
            <span>{total} kr</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.5rem" }}>
            Inkl. moms. Frakt beräknas vid leverans.
          </p>
          <Link href="/varukorg" style={{ display: "block", marginTop: "1.5rem", color: "#888", fontSize: "0.85rem" }}>
            ← Ändra varukorg
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
        autoComplete={name}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f5f0e8", padding: "100px 20px 60px" },
  layout: { maxWidth: "1000px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" },
  card: { background: "#fff", borderRadius: "16px", padding: "2rem", flex: "1 1 500px", boxShadow: "0 4px 30px rgba(0,0,0,0.07)" },
  summary: { background: "#fff", borderRadius: "16px", padding: "2rem", flex: "1 1 260px", boxShadow: "0 4px 30px rgba(0,0,0,0.07)", position: "sticky", top: "90px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", marginBottom: "1.5rem", letterSpacing: "2px" },
  sectionTitle: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", marginBottom: "1rem" },
  section: { marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #f0f0f0" },
  row: { display: "flex", gap: "1rem" },
  label: { display: "block", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "0.4rem" },
  input: { width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e5e5", borderRadius: "8px", background: "#fafafa", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" },
  stripePlaceholder: { background: "#fafafa", border: "1px dashed #ddd", borderRadius: "8px", padding: "1.2rem", textAlign: "center", color: "#999", fontSize: "0.85rem" },
  submitBtn: { width: "100%", padding: "1rem", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" },
  loginBanner: { background: "#fffbf0", border: "1px solid #f0e4b8", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", marginBottom: "1.5rem", color: "#555" },
  orderItem: { display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.6rem 0", fontSize: "0.9rem", borderBottom: "1px solid #f5f5f5" },
  divider: { borderTop: "1px solid #eee", margin: "1rem 0" },
};