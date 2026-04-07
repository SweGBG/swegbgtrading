"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function KontoDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]); // Ny state för ordrar
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "messages" | "settings">("orders");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUserAndOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/medlem");
        return;
      }

      setUser(user);

      // HÄR HÄMTAR VI ORDRARNA FRÅN SUPABASE
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id) // FILTRERAR PÅ DITT UUID!
        .order('created_at', { ascending: false });

      if (!error && ordersData) {
        setOrders(ordersData);
      }
      setLoadingOrders(false);
    };

    getUserAndOrders();
  }, [router, supabase]);

  // ... (behåll handleLogout och loading-div)

  return (
    <main style={{ paddingTop: "100px", minHeight: "100vh", backgroundColor: "#f9f7f2" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

        <header style={{ marginBottom: "40px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
          <h1 style={{ fontSize: "1.8rem", fontFamily: "serif" }}>Hej, {user?.email}!</h1>
          <p style={{ color: "#666" }}>Välkommen till dina sidor på SweGBG.</p>
        </header>

        <div style={{ display: "flex", gap: "40px" }}>
          {/* Sidomeny... (samma som förut) */}

          <section style={{ flex: 1, backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {activeTab === "orders" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>Orderhistorik</h2>

                {loadingOrders ? (
                  <p>Hämtar dina ordrar...</p>
                ) : orders.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {orders.map((order) => (
                      <div key={order.id} style={{ padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <strong>Order #{order.id.slice(0, 8)}</strong>
                          <span style={{ backgroundColor: "#e6fffa", color: "#2c7a7b", padding: "2px 8px", borderRadius: "10px", fontSize: "0.7rem", textTransform: "uppercase" }}>
                            {order.status || 'Betald'}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.9rem", margin: 0 }}>Mottagare: {order.shipping_name}</p>
                        <p style={{ fontSize: "0.8rem", color: "#666" }}>Adress: {order.shipping_address}, {order.shipping_city}</p>
                        <p style={{ fontSize: "0.9rem", fontWeight: "bold", marginTop: "10px" }}>
                          Totalt: {order.amount_total / 100} kr
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#aaa" }}>Du har inga tidigare beställningar än.</p>
                )}
              </div>
            )}

            {/* ... (behåll messages och settings) */}
          </section>
        </div>
      </div>
    </main>
  );
}