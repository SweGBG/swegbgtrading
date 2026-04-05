"use client";

import Link from "next/link";

export default function KassaPage() {
  return (
    <div style={{ padding: "120px 40px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>KASSA</h1>
      <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "40px" }}>
        Betalningsfunktionen kommer snart! Vi håller på att integrera Stripe för säkra betalningar.
      </p>

      <Link href="/varukorg" style={{ color: "#000", fontWeight: "bold" }}>
        ← Tillbaka till varukorgen
      </Link>
    </div>
  );
}