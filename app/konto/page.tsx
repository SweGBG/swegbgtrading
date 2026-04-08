"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function KontoDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"oversikt" | "orders" | "messages" | "settings">("oversikt");
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Profil-state
  const [profile, setProfile] = useState({
    full_name: "",
    address: "",
    zip_code: "",
    city: ""
  });

  // Sparar "originalet" för att se om ändringar gjorts
  const [initialProfile, setInitialProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/medlem");
        return;
      }
      setUser(user);

      const [ordersRes, profileRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);

      if (profileRes.data) {
        const loadedProfile = {
          full_name: profileRes.data.full_name || "",
          address: profileRes.data.address || "",
          zip_code: profileRes.data.zip_code || "",
          city: profileRes.data.city || ""
        };
        setProfile(loadedProfile);
        setInitialProfile(loadedProfile);
      }

      setLoadingOrders(false);
    };
    getData();
  }, [router, supabase]);

  const updateProfile = async () => {
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

    if (!hasChanges) {
      setStatusMessage({ text: "Inga ändringar att spara.", type: 'error' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date(),
      });

    if (error) {
      setStatusMessage({ text: "Gick inte att spara: " + error.message, type: 'error' });
    } else {
      setStatusMessage({ text: "Profilen har uppdaterats! ☕", type: 'success' });
      setInitialProfile({ ...profile });
      setTimeout(() => setStatusMessage(null), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div style={{ padding: "100px", textAlign: "center" }}>Laddar profil...</div>;

  const noChanges = JSON.stringify(profile) === JSON.stringify(initialProfile);

  return (
    <main style={{ paddingTop: "100px", minHeight: "100vh", backgroundColor: "#f9f7f2" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

        <header style={{ marginBottom: "40px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
          <h1 style={{ fontSize: "2rem", fontFamily: "serif", marginBottom: "5px" }}>Mitt konto</h1>
          <p style={{ color: "#666" }}>Inloggad som: <strong>{user?.email}</strong></p>
        </header>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <aside style={{ width: "100%", maxWidth: "220px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => setActiveTab("oversikt")} style={tabButtonStyle(activeTab === "oversikt")}>Översikt</button>
            <button onClick={() => setActiveTab("orders")} style={tabButtonStyle(activeTab === "orders")}>Mina Beställningar ({orders.length})</button>
            <button onClick={() => setActiveTab("messages")} style={tabButtonStyle(activeTab === "messages")}>Meddelanden</button>
            <button onClick={() => setActiveTab("settings")} style={tabButtonStyle(activeTab === "settings")}>Inställningar</button>
            <button onClick={handleLogout} style={{ ...tabButtonStyle(false), marginTop: "20px", color: "#cc0000", border: "1px solid #ffcccc" }}>Logga ut</button>
          </aside>

          <section style={{ flex: 1, backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>

            {activeTab === "oversikt" && (
              <div>
                <h2 style={{ marginBottom: "25px", fontFamily: "serif" }}>Välkommen tillbaka, {profile.full_name || 'vän'}!</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={infoCardStyle}>
                    <span style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase" }}>Medlem sedan</span>
                    <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{new Date(user.created_at).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div style={infoCardStyle}>
                    <span style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase" }}>Antal beställningar</span>
                    <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{orders.length} st</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 style={{ marginBottom: "20px", fontFamily: "serif" }}>Dina Beställningar</h2>
                {loadingOrders ? <p>Hämtar...</p> : orders.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {orders.map((order) => (
                      <div key={order.id} style={orderCardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>Order #{order.id.slice(0, 8)}</strong>
                          <span style={statusBadgeStyle}>{order.status || 'Paid'}</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>{order.shipping_name}</p>
                        <p style={{ fontSize: "0.8rem", color: "#666" }}>{order.shipping_address}, {order.shipping_city}</p>
                        <div style={{ marginTop: "10px", fontWeight: "bold" }}>{order.amount_total} kr</div>
                      </div>
                    ))}
                  </div>
                ) : <p>Inga ordrar än.</p>}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 style={{ marginBottom: "20px", fontFamily: "serif" }}>Leveransuppgifter</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={labelStyle}>Fullständigt namn</label>
                    <input type="text" value={profile.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      style={inputStyleActive} placeholder="Namn Namnsson" />
                  </div>
                  <div>
                    <label style={labelStyle}>Gatuadress</label>
                    <input type="text" value={profile.address || ""}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      style={inputStyleActive} placeholder="Gatan 12" />
                  </div>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Postnummer</label>
                      <input type="text" value={profile.zip_code || ""}
                        onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                        style={inputStyleActive} placeholder="123 45" />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={labelStyle}>Postort</label>
                      <input type="text" value={profile.city || ""}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        style={inputStyleActive} placeholder="Göteborg" />
                    </div>
                  </div>

                  {statusMessage && (
                    <div style={{
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "15px",
                      backgroundColor: statusMessage.type === 'success' ? "#e6fffa" : "#fff5f5",
                      color: statusMessage.type === 'success' ? "#2c7a7b" : "#c53030",
                      border: `1px solid ${statusMessage.type === 'success' ? "#b2f5ea" : "#feb2b2"}`,
                      fontSize: "0.9rem",
                      textAlign: "center"
                    }}>
                      {statusMessage.text}
                    </div>
                  )}

                  <button
                    onClick={updateProfile}
                    disabled={saving || noChanges}
                    style={{
                      ...saveButtonStyle,
                      opacity: (noChanges || saving) ? 0.5 : 1,
                      cursor: (noChanges || saving) ? "not-allowed" : "pointer"
                    }}
                  >
                    {saving ? "Sparar..." : noChanges ? "Inga ändringar" : "Spara profil"}
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

const tabButtonStyle = (isActive: boolean) => ({
  textAlign: "left" as const,
  padding: "12px 18px",
  backgroundColor: isActive ? "#1a1a1a" : "transparent",
  color: isActive ? "#fff" : "#1a1a1a",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.9rem",
});

const saveButtonStyle = {
  marginTop: "10px",
  padding: "14px",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold" as const
};

const infoCardStyle = { padding: "20px", border: "1px solid #eee", borderRadius: "10px", backgroundColor: "#fafafa" };
const orderCardStyle = { padding: "20px", border: "1px solid #eee", borderRadius: "10px" };
const statusBadgeStyle = { backgroundColor: "#e6fffa", color: "#2c7a7b", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold" };
const labelStyle = { display: "block", fontSize: "0.85rem", marginBottom: "6px", color: "#555" };
const inputStyleActive = { width: "100%", padding: "12px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "6px" };