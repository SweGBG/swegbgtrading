export default function TackPage() {
  return (
    <div style={{ padding: "120px 40px", textAlign: "center" }}>
      <div style={{ fontSize: "3rem" }}>✓</div>
      <h1 style={{ fontFamily: "serif", fontSize: "2rem", margin: "1rem 0" }}>
        Tack för din beställning!
      </h1>
      <p style={{ color: "#666" }}>
        Du får en bekräftelse via e-post från Stripe.
      </p>
    </div>
  );
}