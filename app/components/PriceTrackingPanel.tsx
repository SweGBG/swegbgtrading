'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

type Product = {
  id: string;
  name: string;
  url: string;
  store: string | null;
  image_url: string | null;
  your_price: number | null;
  latest_price: number | null;
  in_stock: boolean | null;
  last_scraped: string | null;
};

type HistoryPoint = {
  price: number;
  scraped_at: string;
  in_stock: boolean | null;
};

export default function PriceTrackingPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [graphProduct, setGraphProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracking/list');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch('/api/tracking/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl.trim(),
          your_price: newPrice ? parseFloat(newPrice) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kunde inte lägga till produkten');
      setNewUrl('');
      setNewPrice('');
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/tracking/refresh', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Ta bort produkten och all dess prishistorik?')) return;
    await fetch(`/api/tracking/delete/${id}`, { method: 'DELETE' });
    await loadProducts();
  };

  const updateYourPrice = async (id: string, price: number) => {
    await fetch(`/api/tracking/update-price/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ your_price: price }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, your_price: price } : p))
    );
  };

  const openGraph = async (product: Product) => {
    setGraphProduct(product);
    const res = await fetch(`/api/tracking/history/${product.id}`);
    const data = await res.json();
    setHistory(data.history || []);
  };

  const calcDiff = (latest: number | null, yours: number | null) => {
    if (latest === null || yours === null) return null;
    const diff = ((yours - latest) / latest) * 100;
    return diff;
  };

  return (
    <section
      style={{
        background: 'rgba(20, 20, 25, 0.6)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        borderRadius: '16px',
        padding: '28px',
        marginTop: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', color: '#ffd700', margin: 0 }}>
            📊 Prisbevakning
          </h2>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0 0' }}>
            Bevaka konkurrenters priser och justera dina egna i realtid
          </p>
        </div>
        <button
          onClick={refreshAll}
          disabled={refreshing || products.length === 0}
          style={{
            background: refreshing
              ? '#333'
              : 'linear-gradient(135deg, #ffd700, #ffaa00)',
            color: refreshing ? '#888' : '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {refreshing ? 'Uppdaterar…' : '🔄 Uppdatera alla priser'}
        </button>
      </div>

      {/* Lägg till-formulär */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="url"
          placeholder="Klistra in produkt-URL (t.ex. ahlens.se/mugg-xyz)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          style={{
            flex: '1 1 300px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '14px',
          }}
        />
        <input
          type="number"
          placeholder="Ditt pris (kr)"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{
            width: '140px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '14px',
          }}
        />
        <button
          onClick={addProduct}
          disabled={adding || !newUrl.trim()}
          style={{
            background: adding ? '#333' : '#ffd700',
            color: adding ? '#888' : '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: adding ? 'not-allowed' : 'pointer',
          }}
        >
          {adding ? 'Scrapar…' : '+ Lägg till'}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(255, 80, 80, 0.1)',
            border: '1px solid rgba(255, 80, 80, 0.3)',
            color: '#ff8080',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Tabell */}
      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
          Laddar…
        </p>
      ) : products.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
          Inga produkter bevakas än. Klistra in en URL ovan för att börja.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ color: '#888', textAlign: 'left', fontSize: '12px' }}>
                <th style={{ padding: '12px 8px' }}>Produkt</th>
                <th style={{ padding: '12px 8px' }}>Butik</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>
                  Marknadspris
                </th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>
                  Ditt pris
                </th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Diff</th>
                <th style={{ padding: '12px 8px' }}>Uppdaterad</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const diff = calcDiff(p.latest_price, p.your_price);
                return (
                  <tr
                    key={p.id}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <td style={{ padding: '14px 8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              background: '#111',
                            }}
                          />
                        )}
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#fff', textDecoration: 'none' }}
                        >
                          {p.name}
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: '14px 8px', color: '#aaa' }}>
                      {p.store || '—'}
                    </td>
                    <td
                      style={{
                        padding: '14px 8px',
                        textAlign: 'right',
                        fontWeight: 600,
                      }}
                    >
                      {p.latest_price !== null ? `${p.latest_price} kr` : '—'}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <input
                        type="number"
                        defaultValue={p.your_price ?? ''}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val !== p.your_price) {
                            updateYourPrice(p.id, val);
                          }
                        }}
                        style={{
                          width: '90px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,215,0,0.2)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          color: '#ffd700',
                          textAlign: 'right',
                          fontWeight: 600,
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: '14px 8px',
                        textAlign: 'right',
                        color:
                          diff === null
                            ? '#666'
                            : diff > 0
                              ? '#ff8080'
                              : '#80ff80',
                        fontWeight: 600,
                      }}
                    >
                      {diff === null
                        ? '—'
                        : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`}
                    </td>
                    <td
                      style={{
                        padding: '14px 8px',
                        color: '#888',
                        fontSize: '12px',
                      }}
                    >
                      {p.last_scraped
                        ? new Date(p.last_scraped).toLocaleString('sv-SE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                        : '—'}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => openGraph(p)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255,215,0,0.3)',
                          color: '#ffd700',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginRight: '6px',
                          fontSize: '12px',
                        }}
                      >
                        📈 Graf
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255,80,80,0.3)',
                          color: '#ff8080',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Graf-modal */}
      {graphProduct && (
        <div
          onClick={() => setGraphProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '12px',
              padding: '28px',
              width: '100%',
              maxWidth: '800px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ color: '#ffd700', margin: 0 }}>
                Prishistorik — {graphProduct.name}
              </h3>
              <button
                onClick={() => setGraphProduct(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            {history.length < 2 ? (
              <p
                style={{
                  color: '#888',
                  textAlign: 'center',
                  padding: '40px',
                }}
              >
                Behöver minst 2 datapunkter. Klicka "Uppdatera alla priser"
                igen senare för att bygga historik.
              </p>
            ) : (
              <div style={{ width: '100%', height: '360px' }}>
                <ResponsiveContainer>
                  <LineChart
                    data={history.map((h) => ({
                      ...h,
                      date: new Date(h.scraped_at).toLocaleDateString('sv-SE', {
                        month: 'short',
                        day: 'numeric',
                      }),
                    }))}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        background: '#000',
                        border: '1px solid #333',
                        borderRadius: '6px',
                      }}
                      formatter={(v: number) => `${v} kr`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#ffd700"
                      strokeWidth={2}
                      dot={{ fill: '#ffd700', r: 4 }}
                    />
                    {graphProduct.your_price && (
                      <ReferenceLine
                        y={graphProduct.your_price}
                        stroke="#80ff80"
                        strokeDasharray="5 5"
                        label={{
                          value: `Ditt pris: ${graphProduct.your_price} kr`,
                          fill: '#80ff80',
                          fontSize: 12,
                        }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}