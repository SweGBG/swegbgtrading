"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// 1. HÄR IMPORTERAR VI DIN CONTEXT (Dubbelkolla att mappen heter 'context' och filen 'CartContext')
import { useCart } from "../context/cartcontext";

export default function KaffePage() {
  // 2. HÄR HÄMTAR VI FUNKTIONEN FRÅN DITT SYSTEM
  const { addToCart } = useCart();

  // app/kaffe/page.tsx

  const kaffeProdukter = [
    {
      id: "gbg-brew-1",
      name: "GBG BREW (DEMO)", // Ändra från 'namn' till 'name'
      price: 149,               // Ändra från 'pris' till 'price' (och se till att det är en siffra!)
      ursprung: "GÖTEBORG - EST. 2026",
      beskrivning: 'Vår "Local Roast" är noga utvald...',
      vikt: "500g",
      bild: "images/produkt1.png"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="kaffe-container"
      style={{
        paddingTop: '180px',
        paddingBottom: '100px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Kaffe</h1>
        <p style={{ marginTop: '10px', fontSize: '18px', letterSpacing: '0.3em', opacity: 0.7 }}>
          ROSTARENS VAL
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {kaffeProdukter.map((produkt) => (
          <div key={produkt.id} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>

            <div style={{ flex: '1', minWidth: '300px', maxWidth: '450px' }}>
              <img
                src={produkt.bild}
                alt={produkt.name}
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  display: 'block'
                }}
              />
            </div>

            <div style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '36px', marginBottom: '5px' }}>{produkt.name}</h2>
              <p style={{ fontSize: '14px', letterSpacing: '2px', color: '#666', marginBottom: '25px', textTransform: 'uppercase' }}>
                {produkt.ursprung}
              </p>

              <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '500px' }}>
                {produkt.beskrivning}
              </p>

              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
                {produkt.vikt} - {produkt.pris} kr
              </p>

              <button
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '15px 40px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}
                onClick={() => {
                  // 3. HÄR KÖR VI DEN RIKTIGA FUNKTIONEN ISTÄLLET FÖR ALERT
                  addToCart(produkt);
                }}
              >
                Köp Nu
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
        <p style={{ letterSpacing: '6px', fontSize: '18px', textTransform: 'uppercase' }}>
          @ S W E G B G T R A D I N G
        </p>
      </div>
    </motion.section>
  );
}