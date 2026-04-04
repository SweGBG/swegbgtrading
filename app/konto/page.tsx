"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function KontoDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "messages" | "settings">("orders");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/medlem"); // Skicka tillbaka om man inte är inloggad
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div style={{ padding: "100px", textAlign: "center" }}>Laddar...</div>;

  return (
    <main style={{ paddingTop: "100px", minHeight: "100vh", backgroundColor: "#f9f7f2" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

        {/* Header - Välkomstmeddelande */}
        <header style={{ marginBottom: "40px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "serif" }}>Hej, {user.email}!</h1>
          <p style={{ color: "#666" }}>Välkommen till dina sidor på SweGBG.</p>
        </header>

        <div style={{ display: "flex", gap: "40px" }}>
          {/* Sidomeny / Tabs */}
          <aside style={{ width: "200px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => setActiveTab("orders")}
              style={tabButtonStyle(activeTab === "orders")}
            >
              Mina Beställningar
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              style={tabButtonStyle(activeTab === "messages")}
            >
              Meddelanden
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              style={tabButtonStyle(activeTab === "settings")}
            >
              Kontoinställningar
            </button>

            <button
              onClick={handleLogout}
              style={{ ...tabButtonStyle(false), color: "black", marginTop: "20px", fontSize: "0.8rem" }}
            >
              Logga ut
            </button>
          </aside>

          {/* Dynamiskt Innehåll */}
          <section style={{ flex: 1, backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {activeTab === "orders" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Orderhistorik</h2>
                <p style={{ color: "#aaa" }}>Du har inga tidigare beställningar än.</p>
                {/* Här mappar vi orders från Supabase-tabellen sen */}
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Meddelanden</h2>
                <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "5px" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Välkommen till SweGBG!</p>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>Roligt att du har skapat ett konto. Här kommer du få personliga erbjudanden.</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Inställningar</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "5px" }}>E-post</label>
                    <input type="text" disabled value={user.email} style={{ width: "100%", padding: "10px", backgroundColor: "#f5f5f5", border: "1px solid #ddd" }} />
                  </div>
                  <button style={{ padding: "10px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}>
                    Uppdatera profil
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

// Styling för knapparna
const tabButtonStyle = (isActive: boolean) => ({
  textAlign: "left" as const,
  padding: "12px 15px",
  backgroundColor: isActive ? "#000" : "transparent",
  color: isActive ? "#fff" : "#000",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontWeight: isActive ? "bold" : "normal", // <--- Kommatecken här!
  fontSize: "13px",
});
