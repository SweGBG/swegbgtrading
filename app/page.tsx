"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation"; // 1. Importera router

export default function Home() {
  const [view, setView] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter(); // 2. Initiera router

  // 3. Skapa utloggningsfunktionen
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh(); // Uppdaterar sidan så menyn ändras direkt
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
      {/* 1. SIDOMENYN */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, left: 0, width: '300px', height: '100%',
                backgroundColor: '#fff', zIndex: 101, padding: '40px 20px',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)', color: '#000'
              }}
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginBottom: '30px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                ✕ <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stäng</span>
              </button>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Alla kategorier
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <Link href="/kaffe" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{
                    padding: '15px 0',
                    borderBottom: '1px solid #f9f9f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Kaffe</span>
                    <span style={{ opacity: 0.3 }}>›</span>
                  </li>
                </Link>
                <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>Te</li>
                <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>Accessoarer</li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. DIN FIXED NAV */}
      <nav className="fixed-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            onClick={() => setIsMenuOpen(true)}
            style={{ cursor: 'pointer', fontSize: '1.5rem', userSelect: 'none' }}
          >
            ☰
          </div>
          <div
            style={{ fontSize: '1.5rem', letterSpacing: '0.2em', cursor: 'pointer' }}
            onClick={() => setView("home")}
          >
            SWEGBG
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span> Om oss</span> •
          <span onClick={() => setView("contact")} style={{ cursor: 'pointer' }}> Kontakt</span> •

          {user ? (
            /* VISAS NÄR MAN ÄR INLOGGAD */
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link href="/konto" style={{ textDecoration: 'none', color: 'inherit' }}>
                Mitt konto
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#000000',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  padding: 0
                }}
              >
                Logga ut
              </button>
            </div>
          ) : (
            /* VISAS NÄR MAN ÄR UTLOGGAD */
            <Link href="/medlem" style={{ textDecoration: 'none', color: 'inherit' }}>
              Logga in
            </Link>
          )}
        </div>
      </nav>

      {/* 3. RESTEN AV SIDAN */}
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className="hero" style={{ paddingTop: '33px', paddingBottom: '20px' }}>
              <img
                src="/images/hlogo.png"
                alt="SweGBG Trading"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </section>

            <div className="grid-container" style={{ paddingTop: '20px' }}>
              <Link href="/kaffe" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <img
                    src="/images/logo.png"
                    style={{ width: '300px', height: 'fit-content' }}
                  />
                  <p style={{ marginTop: '10px', fontWeight: 'bold' }}>KAFFE</p>
                </div>
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="/images/logo3.jpg"
                  style={{
                    width: '300px',
                    height: '290px',
                    transform: 'translateY(-10px)',
                    objectFit: 'contain',
                    cursor: 'pointer'
                  }}
                  className="hover"
                />
                <p style={{ marginTop: '10px', letterSpacing: '0.2em', fontSize: '1.5rem' }}>TE</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.section
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero"
            style={{ paddingTop: '200px' }}
          >
            <h1>Kontakt</h1>
            <p style={{ marginTop: '25px', marginBottom: '39px', fontSize: '20px', letterSpacing: '0.4em' }}>Kommer Snart</p>
            <p style={{ letterSpacing: '6px', fontSize: '25px', textTransform: 'uppercase' }}>
              @ S W E G B G T R A D I N G
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}