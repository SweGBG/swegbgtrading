"use client";
import Link from 'next/link';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      {/* Flytta ner motion.section så att den omsluter allt innehåll */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 2, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }} // Lite långsammare fade känns ofta lyxigare på startsidan
        style={{ paddingTop: '33px' }}
      >

        {/* Stor logotyp (H-logo) */}
        <div className="hero" style={{ paddingTop: '5px', paddingBottom: '20px' }}>
          <img
            src="/images/hlogo2.png"
            alt="SweGBG Trading"
            style={{
              width: '100%',
              maxWidth: '600px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              mixBlendMode: 'multiply' // Detta gör att det vita i bilden blir genomskinligt mot din bakgrund
            }}
          />
        </div>

        {/* Kategorier (Kaffe & Te) */}
        <div className="grid-container" style={{ paddingTop: '33px', display: 'flex', justifyContent: 'center', gap: '33px' }}>

          {/* KAFFE */}
          <Link href="/kaffe" style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}>
            <div style={{
              marginTop: '-20px',
              cursor: 'pointer',
              textAlign: 'center',
              outline: 'none',
              border: 'none'
            }}>
              <img
                src="/images/logo.png"
                alt="Kaffe"
                style={{
                  width: '280px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'block'
                }}
              />
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>KAFFE</p>
            </div>
          </Link>

          {/* TE */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link href="/te" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ marginTop: '-29px', cursor: 'pointer', textAlign: 'center' }}>
                <img
                  src="/images/logo3a.png"
                  alt="Te"
                  style={{ width: '275px' }}
                />
                <p style={{ marginTop: '-3px', fontWeight: 'bold' }}>TE</p>
              </div>
            </Link>
          </div>
        </div>

      </motion.section>
    </main>
  );
}