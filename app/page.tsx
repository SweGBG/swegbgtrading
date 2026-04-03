"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  // ... resten av koden
  const [view, setView] = useState("home");

  return (
    <main>
      {/* DIN SNYGGA NAV - Nu med klickbara knappar */}
      <nav className="fixed-nav">
        <div
          style={{ fontSize: '1.5rem', letterSpacing: '0.2em', cursor: 'pointer' }}
          onClick={() => setView("home")}
        >
          SWEGBG
        </div>
        <div style={{ cursor: 'pointer' }}>
          <span onClick={() => setView("home")}>Kollektion</span> •
          <span> Om oss</span> •
          <span onClick={() => setView("contact")}> Kontakt</span>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* DIN HJÄLTE-SEKTION */}
            <section className="hero">
              <h1>SweGBG Trading</h1>
              <p>Premium Essentials — Göteborg</p>
            </section>

            {/* DIN PRODUKT-GRID */}
            <div className="grid-container">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="/images/logo.png"
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'contain',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // En skön "studsig" känsla
                    cursor: 'pointer'
                  }}
                  // Och lägg till en hover-effekt i din CSS eller via className
                  className="hover"
                />
                <p style={{ marginTop: '10px', letterSpacing: '0.2em', fontSize: '1.4rem', fontWeight: '650' }}>
                  KAFFE MUGG
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="/images/logo3.jpg"
                  style={{
                    width: '300px',
                    height: '300px',
                    transform: 'translateY(-20px)',
                    objectFit: 'contain',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // En skön "studsig" känsla
                    cursor: 'pointer'
                  }}
                  // Och lägg till en hover-effekt i din CSS eller via className
                  className="hover"
                />
                <p style={{ marginTop: '10px', letterSpacing: '0.2em', fontSize: '1.5rem' }}>TE</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* KONTAKT-VY (Här använder vi samma stil som Hero för att det ska bli snyggt) */
          <motion.section
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero"
            style={{ paddingTop: '200px' }}
          >
            <h1>Kontakt</h1>
            <p style={{ marginTop: '15px', fontSize: '1.5rem', letterSpacing: '0.4em' }}>Kommer Snart</p>
            <p style={{ marginTop: '20px', fontSize: '1.9rem', letterSpacing: '0.4em' }}>@SWEGBGTRADING</p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}