"use client";

import { useCart } from "../context/cartcontext";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const menuLinks = [
    { href: "/kaffe", label: "Kaffe" },
    { href: "/te", label: "Te" },
    { href: "/kaffemuggar", label: "Muggar" },
    { href: "/om", label: "Om oss" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 100 }}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{ position: "fixed", top: 0, left: 0, width: "min(300px, 85vw)", height: "100%", zIndex: 101, padding: "40px 24px", overflowY: "auto", background: "#0a0a0a", borderRight: "1px solid rgba(180,140,60,0.2)" }}
            >
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hex-menu" x="0" y="0" width="60" height="69" patternUnits="userSpaceOnUse">
                    <polygon points="30,3 57,18 57,51 30,66 3,51 3,18" fill="none" stroke="rgba(180,140,60,0.08)" strokeWidth="0.5" />
                    <circle cx="30" cy="34" r="1" fill="rgba(180,140,60,0.1)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-menu)" />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse at 50% 0%, rgba(180,140,60,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

              <button onClick={() => setIsMenuOpen(false)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", marginBottom: "48px", display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase" }}>
                ✕ Stäng
              </button>

              <p style={{ position: "relative", fontSize: "9px", letterSpacing: "5px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>Kategorier</p>
              <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.3), transparent)", marginBottom: "16px" }} />

              <ul style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
                {menuLinks.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,140,60,0.9)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                      >
                        {link.label}
                        <span style={{ color: "rgba(180,140,60,0.4)", fontSize: "16px" }}>›</span>
                      </div>
                    </Link>
                  </motion.li>
                ))}

                <div style={{ marginTop: "40px", position: "relative" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>Konto</p>
                  <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.3), transparent)", marginBottom: "16px" }} />
                  {user ? (
                    <>
                      <Link href="/konto" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px" }}>Mitt konto</div>
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,80,80,0.5)", fontSize: "14px", padding: "14px 0", width: "100%", textAlign: "left", letterSpacing: "2px" }}>
                        Logga ut
                      </button>
                    </>
                  ) : (
                    <Link href="/medlem" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "14px 0", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px" }}>Logga in</div>
                    </Link>
                  )}
                </div>

                <p style={{ position: "absolute", bottom: "-40px", fontSize: "9px", letterSpacing: "4px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}>
                  GÖTEBORG — EST. 2026
                </p>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 51, backdropFilter: "blur(12px)", backgroundColor: scrolled ? "rgba(132,99,34,0.4)" : "rgba(100,75,20,0.25)", borderBottom: "1px solid rgba(180,140,60,0.3)", transition: "background-color 0.3s ease" }}>

        {/* VÄNSTER */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div onClick={() => setIsMenuOpen(true)} style={{ cursor: "pointer", userSelect: "none", display: "flex", flexDirection: "column", gap: "5px", padding: "10px", margin: "-6px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: i === 1 ? "16px" : "22px", height: "1.5px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
            ))}
          </div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "4px", color: "rgba(255,255,255,0.9)" }}>SWEGBG</span>
          </Link>
        </div>

        {/* HÖGER */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="desktop-only">
            <Link href="/om" style={{ textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "1px" }}>Om oss</Link>
          </span>
          <span className="desktop-only">
            <Link href="/kontakt" style={{ textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "1px" }}>Kontakt</Link>
          </span>

          {/* KONTO-IKON */}
          <div data-dropdown style={{ position: "relative" }}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: "36px", height: "36px", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: "16px", cursor: "pointer" }}>
              👤
            </div>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute", top: "48px", right: 0, background: "#0f0d08", border: "1px solid rgba(180,140,60,0.2)", borderRadius: "10px", overflow: "hidden", minWidth: "160px", zIndex: 200 }}
                >
                  {user ? (
                    <>
                      <Link href="/konto" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.65)", fontSize: "13px", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(180,140,60,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          Mitt konto
                        </div>
                      </Link>
                      <div onClick={() => { handleLogout(); setDropdownOpen(false); }} style={{ padding: "12px 16px", color: "rgba(255,80,80,0.6)", fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,80,80,0.06)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Logga ut
                      </div>
                    </>
                  ) : (
                    <Link href="/medlem" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "12px 16px", color: "rgba(180,140,60,0.8)", fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(180,140,60,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Logga in
                      </div>
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* VARUKORG */}
          <Link href="/varukorg" style={{ textDecoration: "none", position: "relative" }}>
            <div style={{ width: "36px", height: "36px", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
              🛒
            </div>
            {itemCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: "-4px", right: "-4px", background: "linear-gradient(135deg, #b48c3c, #e8c06a)", color: "#000", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {itemCount}
              </motion.span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{ position: "fixed", top: 0, left: 0, width: "min(300px, 85vw)", height: "100%", zIndex: 101, padding: "40px 24px", overflowY: "auto", background: "#0a0a0a", borderRight: "1px solid rgba(180,140,60,0.2)" }}
            >
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hex-menu" x="0" y="0" width="60" height="69" patternUnits="userSpaceOnUse">
                    <polygon points="30,3 57,18 57,51 30,66 3,51 3,18" fill="none" stroke="rgba(180,140,60,0.08)" strokeWidth="0.5" />
                    <circle cx="30" cy="34" r="1" fill="rgba(180,140,60,0.1)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-menu)" />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse at 50% 0%, rgba(180,140,60,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

              <button onClick={() => setIsMenuOpen(false)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", marginBottom: "48px", display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase" }}>
                ✕ Stäng
              </button>

              <p style={{ position: "relative", fontSize: "9px", letterSpacing: "5px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>Kategorier</p>
              <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.3), transparent)", marginBottom: "16px" }} />

              <ul style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
                {menuLinks.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,140,60,0.9)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                      >
                        {link.label}
                        <span style={{ color: "rgba(180,140,60,0.4)", fontSize: "16px" }}>›</span>
                      </div>
                    </Link>
                  </motion.li>
                ))}

                <div style={{ marginTop: "40px", position: "relative" }}>
                  <p style={{ fontSize: "9px", letterSpacing: "5px", color: "rgba(180,140,60,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>Konto</p>
                  <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(180,140,60,0.3), transparent)", marginBottom: "16px" }} />
                  {user ? (
                    <>
                      <Link href="/konto" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px" }}>Mitt konto</div>
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,80,80,0.5)", fontSize: "14px", padding: "14px 0", width: "100%", textAlign: "left", letterSpacing: "2px" }}>
                        Logga ut
                      </button>
                    </>
                  ) : (
                    <Link href="/medlem" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "14px 0", color: "rgba(255,255,255,0.65)", fontSize: "15px", letterSpacing: "2px" }}>Logga in</div>
                    </Link>
                  )}
                </div>

                <p style={{ position: "absolute", bottom: "-40px", fontSize: "9px", letterSpacing: "4px", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}>
                  GÖTEBORG — EST. 2026
                </p>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(12px)", backgroundColor: scrolled ? "rgba(132,99,34,0.4)" : "rgba(100,75,20,0.25)", borderBottom: "1px solid rgba(180,140,60,0.3)", transition: "background-color 0.3s ease" }}>

        {/* VÄNSTER */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div onClick={() => setIsMenuOpen(true)} style={{ cursor: "pointer", userSelect: "none", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: i === 1 ? "16px" : "22px", height: "1.5px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
            ))}
          </div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "4px", color: "rgba(255,255,255,0.9)" }}>SWEGBG</span>
          </Link>
        </div>

        {/* HÖGER */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="desktop-only">
            <Link href="/om" style={{ textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "1px" }}>Om oss</Link>
          </span>
          <span className="desktop-only">
            <Link href="/kontakt" style={{ textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "1px" }}>Kontakt</Link>
          </span>

          {/* KONTO-IKON — syns alltid */}
          <div data-dropdown style={{ position: "relative" }}>
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: "36px", height: "36px", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: "16px", cursor: "pointer" }}>
              👤
            </div>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute", top: "48px", right: 0, background: "#0f0d08", border: "1px solid rgba(180,140,60,0.2)", borderRadius: "10px", overflow: "hidden", minWidth: "160px", zIndex: 200 }}
                >
                  {user ? (
                    <>
                      <Link href="/konto" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                        <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.65)", fontSize: "13px", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(180,140,60,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          Mitt konto
                        </div>
                      </Link>
                      <div onClick={() => { handleLogout(); setDropdownOpen(false); }} style={{ padding: "12px 16px", color: "rgba(255,80,80,0.6)", fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,80,80,0.06)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Logga ut
                      </div>
                    </>
                  ) : (
                    <Link href="/medlem" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "12px 16px", color: "rgba(180,140,60,0.8)", fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(180,140,60,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Logga in
                      </div>
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* VARUKORG */}
          <Link href="/varukorg" style={{ textDecoration: "none", position: "relative" }}>
            <div style={{ width: "36px", height: "36px", border: "1px solid rgba(180,140,60,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
              🛒
            </div>
            {itemCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: "-4px", right: "-4px", background: "linear-gradient(135deg, #b48c3c, #e8c06a)", color: "#000", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {itemCount}
              </motion.span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
