"use client";

import { useCart } from "../context/cartcontext";
import Link from 'next/link';

export default function Navbar() {
  const { cart } = useCart(); // Nu kommer detta fungera!
  const itemCount = cart.length;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>
          SWEGBG
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/varukorg" style={{ textDecoration: 'none', color: '#000', position: 'relative' }}>
          🛒
          {itemCount > 0 && (
            <span style={{
              position: 'absolute', top: '-10px', right: '-10px',
              backgroundColor: 'red', color: 'white', borderRadius: '50%',
              padding: '2px 6px', fontSize: '0.7rem'
            }}>
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}