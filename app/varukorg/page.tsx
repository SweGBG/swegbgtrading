"use client";

import { useCart } from "../context/cartcontext";
import Link from "next/link";

export default function VarukorgPage() {
  const { cart, clearCart } = useCart();

  // Räkna ut totalpriset
  const totalSum = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: "120px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "40px", letterSpacing: "2px" }}>DIN VARUKORG</h1>

      {cart.length === 0 ? (
        <div>
          <p>Varukorgen är tom.</p>
          <Link href="/" style={{ color: "#000", textDecoration: "underline" }}>
            Gå tillbaka och handla
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px"
                }}
              >
                <div>
                  <span style={{ fontWeight: "bold" }}>{item.name}</span>
                </div>
                <span>{item.price} kr</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px", borderTop: "2px solid #000", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
              <span>Totalt att betala:</span>
              <span>{totalSum} kr</span>
            </div>
          </div>

          {/* HÄR ÄR FIXEN: Knapparna ligger nu efter varandra, inte inuti varandra */}
          <div style={{ marginTop: "40px", display: "flex", gap: "20px", alignItems: "center" }}>
            <button
              onClick={clearCart}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                border: "1px solid #ccc",
                cursor: "pointer"
              }}
            >
              Töm varukorg
            </button>

            <Link href="/kassa" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: "10px 40px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                TILL KASSAN
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}