"use client";

import { useCart } from "../context/cartcontext";
import Link from "next/link";

export default function VarukorgPage() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            {cart.map((item) => (
              <div key={item.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #eee",
                paddingBottom: "16px",
                gap: "16px"
              }}>
                {/* Namn */}
                <span style={{ fontWeight: "bold", flex: 1 }}>{item.name}</span>

                {/* +/- knappar */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={btnStyle}
                  >
                    −
                  </button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                    style={btnStyle}
                  >
                    +
                  </button>
                </div>

                {/* Pris */}
                <span style={{ minWidth: "80px", textAlign: "right" }}>
                  {item.price * item.quantity} kr
                </span>

                {/* Ta bort helt */}
                <button
                  onClick={() => {
                    // Ta bort alla av denna produkt
                    for (let i = 0; i < item.quantity; i++) removeFromCart(item.id);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1rem" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px", borderTop: "2px solid #000", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold" }}>
              <span>Totalt att betala:</span>
              <span>{totalSum} kr</span>
            </div>
          </div>

          <div style={{ marginTop: "40px", display: "flex", gap: "20px", alignItems: "center" }}>
            <button onClick={clearCart} style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}>
              Töm varukorg
            </button>

            <Link href="/kassa" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "10px 40px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}>
                TILL KASSAN
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: "1.1rem",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};