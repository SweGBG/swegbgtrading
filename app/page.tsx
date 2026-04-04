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

      <div className="grid-container" style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>

        {/* LOGGA 1 - KAFFE (Nu matchad med Logo 2) */}
        <Link href="/kaffe" style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}>
          <div style={{
            marginTop: '-20px',
            cursor: 'pointer',
            textAlign: 'center',
            outline: 'none', /* Tar bort den blå kanten vid klick */
            border: 'none'   /* Dubbelkollar att ingen ram finns */
          }}>
            <img
              src="/images/logo.png"
              style={{
                width: '280px',
                borderRadius: '50%', /* Gör bilden rund */
                backgroundColor: '#fff', /* Vit bakgrund inuti cirkeln */
                display: 'block'

              }}
            />
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>KAFFE</p>
          </div>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Link href="/te" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ marginTop: '-29px', cursor: 'pointer', textAlign: 'center' }}>
              <img src="/images/logo3.jpg" style={{ width: '275px' }} />
              <p style={{ marginTop: '-3px', fontWeight: 'bold' }}>TE</p>
            </div>
          </Link>


        </div>
      </div>
    </main>
  );
}