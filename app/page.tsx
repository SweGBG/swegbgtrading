"use client";
import Link from 'next/link';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      {/* Ingen Nav eller Sidomeny här – layout.tsx sköter det! */}

      <section className="hero" style={{ paddingTop: '25px', paddingBottom: '20px' }}>
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
          <div style={{ marginTop: 'none', cursor: 'pointer', textAlign: 'center' }}>
            <img src="/images/logo.png" style={{ width: '300px' }} />
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>KAFFE</p>
          </div>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link href="/te" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ marginTop: '-23px', cursor: 'pointer', textAlign: 'center' }}>
              <img src="/images/logo3.jpg" style={{ width: '289px' }} />
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>TE</p>
            </div>
          </Link>


        </div>
      </div>
    </main>
  );
}