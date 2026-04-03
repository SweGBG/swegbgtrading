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
                    width: '350px',       /* Justera denna siffra för att ändra storleken */
                    height: 'auto',
                    objectFit: 'contain',
                    marginBottom: '20px',
                    transition: 'transform 0.3s ease'
                  }}
                  className="product-image"
                />
                <p style={{ marginTop: '10px', letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: '650' }}>
                  KAFFE MUGG
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="/images/logo3.jpg"
                  style={{
                    width: '333px',       /* Justera denna siffra för att ändra storleken */
                    height: 'auto',
                    objectFit: 'contain',
                    marginBottom: '10px',
                    transition: 'transform 0.5s ease'
                  }}
                />
                <p style={{ marginTop: '10px', letterSpacing: '0.2em', fontSize: '0.8rem' }}>STICKER</p>
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
            <p>info@swegbg.se</p>
            <p style={{ marginTop: '20px', fontSize: '0.7rem', letterSpacing: '0.3em' }}>@SWEGBGTRADING</p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}