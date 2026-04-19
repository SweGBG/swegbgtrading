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

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  activeTab: string;
};

export default function PriceTrackingPanel({ open, setOpen, activeTab }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [graphProduct, setGraphProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Ta bort ${selectedIds.size} produkt${selectedIds.size > 1 ? 'er' : ''} och all prishistorik?`)) return;
    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/tracking/delete/${id}`, { method: 'DELETE' })
      )
    );
    setSelectedIds(new Set());
    await loadProducts();
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map((p) => p.id)));
  };

  const updateYourPrice = async (id: string, price: number) => {
    await fetch(`/api/tracking/update-price/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ your_price: price }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, your_price: price } : p)));
  };

  const openGraph = async (product: Product) => {
    setGraphProduct(product);
    const res = await fetch(`/api/tracking/history/${product.id}`);
    const data = await res.json();
    setHistory(data.history || []);
  };

  const calcDiff = (latest: number | null, yours: number | null) => {
    if (latest === null || yours === null) return null;
    return ((yours - latest) / latest) * 100;
  };

  return (
    <>
      {/* Floating toggle-knapp – visas bara på Pris Bevakning-tabben */}
      {activeTab === 'pricetracking' && <button
        onClick={() => setOpen(!open)}
        title="Prisbevakning"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          bottom: '24px',
          zIndex: 1001,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: open
            ? 'rgba(255, 215, 0, 0.2)'
            : 'linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,170,0,0.9))',
          border: open
            ? '2px solid rgba(255,215,0,0.6)'
            : '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        📊
      </button>}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          width: '820px',
          maxWidth: '95vw',
          overflowY: 'auto',
          background: 'rgba(10, 10, 14, 0.98)',
          borderLeft: '1px solid rgba(255, 215, 0, 0.15)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.7)',
          padding: '32px 28px',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: '#ffd700', margin: 0 }}>📊 Prisbevakning</h2>
            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
              Bevaka konkurrenters priser i realtid
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {selectedIds.size > 0 && (
              <button
                onClick={deleteSelected}
                style={{
                  background: 'rgba(255,80,80,0.15)',
                  border: '1px solid rgba(255,80,80,0.4)',
                  color: '#ff8080',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                🗑️ Ta bort ({selectedIds.size})
              </button>
            )}
            <button
              onClick={refreshAll}
              disabled={refreshing || products.length === 0}
              style={{
                background: refreshing ? '#222' : 'linear-gradient(135deg, #ffd700, #ffaa00)',
                color: refreshing ? '#555' : '#000',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              {refreshing ? 'Uppdaterar…' : '🔄 Uppdatera alla'}
            </button>
          </div>
        </div>

        {/* Lägg till-formulär */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="url"
            placeholder="Klistra in produkt-URL (t.ex. ahlens.se/mugg-xyz)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{
              flex: '1 1 200px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '9px 12px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <input
            type="number"
            placeholder="Ditt pris (kr)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            style={{
              width: '110px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '9px 12px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            onClick={addProduct}
            disabled={adding || !newUrl.trim()}
            style={{
              background: adding ? '#222' : '#ffd700',
              color: adding ? '#555' : '#000',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: adding ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '13px',
            }}
          >
            {adding ? 'Scrapar…' : '+ Lägg till'}
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.1)',
            border: '1px solid rgba(255,80,80,0.3)',
            color: '#ff8080',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '12px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Tabell */}
        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '32px', fontSize: '13px' }}>Laddar…</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '32px', fontSize: '13px' }}>
            Inga produkter bevakas än.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#555', textAlign: 'left', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 6px', width: '32px' }}>
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedIds.size === products.length}
                      onChange={toggleSelectAll}
                      style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#ffd700' }}
                    />
                  </th>
                  <th style={{ padding: '10px 6px' }}>Produkt</th>
                  <th style={{ padding: '10px 6px' }}>Butik</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>Marknad</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>Ditt pris</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>Diff</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const diff = calcDiff(p.latest_price, p.your_price);
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: selectedIds.has(p.id) ? 'rgba(255,215,0,0.04)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 6px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#ffd700' }}
                        />
                      </td>
                      <td style={{ padding: '12px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {p.image_url && (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', background: '#111' }}
                            />
                          )}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#ccc', textDecoration: 'none', fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                          >
                            {p.name}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '12px 6px', color: '#666', fontSize: '12px' }}>{p.store || '—'}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right', fontWeight: 600, color: '#fff' }}>
                        {p.latest_price !== null ? `${p.latest_price} kr` : '—'}
                      </td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <input
                          type="number"
                          defaultValue={p.your_price ?? ''}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val !== p.your_price) updateYourPrice(p.id, val);
                          }}
                          style={{
                            width: '72px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            borderRadius: '5px',
                            padding: '4px 6px',
                            color: '#ffd700',
                            textAlign: 'right',
                            fontWeight: 600,
                            fontSize: '12px',
                            outline: 'none',
                          }}
                        />
                      </td>
                      <td style={{
                        padding: '12px 6px',
                        textAlign: 'right',
                        color: diff === null ? '#444' : diff > 0 ? '#ff8080' : '#80ff80',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}>
                        {diff === null ? '—' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`}
                      </td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <button
                          onClick={() => openGraph(p)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,215,0,0.25)',
                            color: '#ffd700',
                            padding: '4px 9px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '4px',
                            fontSize: '11px',
                          }}
                        >
                          📈
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,80,80,0.25)',
                            color: '#ff8080',
                            padding: '4px 8px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '11px',
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
      </div>

      {/* Graf-modal */}
      {graphProduct && (
        <div
          onClick={() => setGraphProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: '14px',
              padding: '28px',
              width: '100%',
              maxWidth: '780px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#ffd700', margin: 0, fontSize: '16px' }}>
                Prishistorik — {graphProduct.name}
              </h3>
              <button
                onClick={() => setGraphProduct(null)}
                style={{ background: 'transparent', border: 'none', color: '#555', fontSize: '22px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            {history.length < 2 ? (
              <p style={{ color: '#555', textAlign: 'center', padding: '40px', fontSize: '13px' }}>
                Behöver minst 2 datapunkter. Klicka "Uppdatera alla" igen senare för att bygga historik.
              </p>
            ) : (
              <div style={{ width: '100%', height: '340px' }}>
                <ResponsiveContainer>
                  <LineChart
                    data={history.map((h) => ({
                      ...h,
                      date: new Date(h.scraped_at).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
                    }))}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="#444" />
                    <YAxis stroke="#444" />
                    <Tooltip
                      contentStyle={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px' }}
                      formatter={(v: any) => `${v} kr`}
                    />
                    <Line type="monotone" dataKey="price" stroke="#ffd700" strokeWidth={2} dot={{ fill: '#ffd700', r: 4 }} />
                    {graphProduct.your_price && (
                      <ReferenceLine
                        y={graphProduct.your_price}
                        stroke="#80ff80"
                        strokeDasharray="5 5"
                        label={{ value: `Ditt pris: ${graphProduct.your_price} kr`, fill: '#80ff80', fontSize: 11 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}