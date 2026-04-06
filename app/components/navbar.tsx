"use client";

import { useCart } from "../context/cartcontext";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* SIDOMENY */}
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
                position: 'fixed', top: 0, left: 0,
                width: 'min(300px, 85vw)', // 👈 passar även smala skärmar
                height: '100%',
                backgroundColor: '#fff', zIndex: 101, padding: '40px 20px',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)', color: '#000',
                overflowY: 'auto' // 👈 scroll om menyn är lång
              }}
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  background: 'none', border: 'none', fontSize: '1rem',
                  cursor: 'pointer', marginBottom: '30px', padding: '0',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                ✕ <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stäng</span>
              </button>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Alla kategorier
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <Link href="/kaffe" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Kaffe</span><span style={{ opacity: 0.3 }}>›</span>
                  </li>
                </Link>
                <Link href="/te" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Te</span><span style={{ opacity: 0.3 }}>›</span>
                  </li>
                </Link>
                <Link href="/om" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Om oss</span><span style={{ opacity: 0.3 }}>›</span>
                  </li>
                </Link>
                <Link href="/kontakt" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Kontakt</span><span style={{ opacity: 0.3 }}>›</span>
                  </li>
                </Link>

                {/* Auth i menyn på mobil */}
                {user ? (
                  <>
                    <Link href="/konto" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>Mitt konto</li>
                    </Link>
                    <li style={{ padding: '15px 0' }}>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                        Logga ut
                      </button>
                    </li>
                  </>
                ) : (
                  <Link href="/medlem" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>Logga in</li>
                  </Link>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', // 👈 mindre padding på mobil
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 50, backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(5px)', borderBottom: '1px solid #eee'
      }}>
        {/* VÄNSTER: Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            onClick={() => setIsMenuOpen(true)}
            style={{ cursor: 'pointer', fontSize: '1.5rem', userSelect: 'none', padding: '4px' }}
          >
            ☰
          </div>
          <Link href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>
            SWEGBG
          </Link>
        </div>

        {/* HÖGER: bara cart + auth på mobil, alla länkar på desktop */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

          {/* Dessa länkar döljs på mobil via CSS-klassen */}
          <span className="desktop-only">
            <Link href="/om" style={{ textDecoration: 'none', color: '#000' }}>Om oss</Link>
          </span>
          <span className="desktop-only">
            <Link href="/kontakt" style={{ textDecoration: 'none', color: '#000' }}>Kontakt</Link>
          </span>
          <span className="desktop-only">
            {user ? (
              <>
                <Link href="/konto" style={{ textDecoration: 'none', color: '#000', marginRight: '16px' }}>Mitt konto</Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontSize: '16px' }}>
                  Logga ut
                </button>
              </>
            ) : (
              <Link href="/medlem" style={{ textDecoration: 'none', color: '#000' }}>Logga in</Link>
            )}
          </span>

          {/* Varukorg syns alltid */}
          <Link href="/varukorg" style={{ textDecoration: 'none', color: '#000', position: 'relative' }}>
            🛒
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: '-10px', right: '-10px',
                backgroundColor: 'black', color: 'white', borderRadius: '50%',
                padding: '2px 6px', fontSize: '0.7rem'
              }}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}