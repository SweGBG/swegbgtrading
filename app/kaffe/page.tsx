"use client";

import { motion } from "framer-motion";
import { useCart } from "../context/cartcontext";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-klient (använd dina env-variabler)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Matchar kolumnerna i din Products-tabell
type Produkt = {
  id: number;
  Name: string;
  price: number;
  emoji: string;
  badge: string;
  category: string;
  description: string;
};

export default function KaffePage() {
  const { addToCart } = useCart();
  const [produkter, setProdukter] = useState<Produkt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdukter() {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("category", "Kaffe"); // Filtrera på kategori!

      if (error) {
        console.error("Supabase-fel:", error);
      } else {
        setProdukter(data || []);
      }
      setLoading(false);
    }

    fetchProdukter();
  }, []);

  if (loading) return <p style={{ paddingTop: "200px", textAlign: "center" }}>Laddar...</p>;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingTop: "180px",
        paddingBottom: "100px",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "48px", textTransform: "uppercase", letterSpacing: "0.2em" }}>Kaffe</h1>
        <p style={{ marginTop: "10px", fontSize: "18px", letterSpacing: "0.3em", opacity: 0.7 }}>
          ROSTARENS VAL
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
        {produkter.map((produkt) => (
          <div key={produkt.id} style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1", minWidth: "300px", textAlign: "left" }}>
              <p style={{ fontSize: "48px" }}>{produkt.emoji}</p>
              <h2 style={{ fontSize: "36px", marginBottom: "5px" }}>{produkt.Name}</h2>
              <p style={{ fontSize: "14px", letterSpacing: "2px", color: "#666", marginBottom: "25px", textTransform: "uppercase" }}>
                {produkt.badge}
              </p>
              <p style={{ fontSize: "18px", lineHeight: "1.6", marginBottom: "30px" }}>
                {produkt.description}
              </p>
              <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px" }}>
                {produkt.price} kr
              </p>
              <button
                onClick={() => addToCart({
                  id: String(produkt.id),
                  name: produkt.Name,
                  price: produkt.price,
                  quantity: 1,
                })}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "15px 40px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Köp Nu
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}