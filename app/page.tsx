"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ paddingTop: '33px' }}
      >
        <div className="hero" style={{ paddingTop: '5px', paddingBottom: '20px' }}>
          <Image
            src="/images/hlogo2.png"
            alt="SweGBG Trading"
            width={600}
            height={300}
            priority
            style={{
              width: '100%',
              maxWidth: '600px',
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              mixBlendMode: 'multiply'
            }}
          />
        </div>

        <div className="grid-container" style={{ paddingTop: '33px', display: 'flex', justifyContent: 'center', gap: '33px' }}>

          <Link href="/kaffe" style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}>
            <div style={{ marginTop: '-20px', cursor: 'pointer', textAlign: 'center' }}>
              <Image
                src="/images/logo.png"
                alt="Kaffe"
                width={280}
                height={280}
                style={{ borderRadius: '50%', backgroundColor: '#fff' }}
              />
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>KAFFE</p>
            </div>
          </Link>

          <Link href="/te" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ marginTop: '-29px', cursor: 'pointer', textAlign: 'center' }}>
              <Image
                src="/images/logo3a.png"
                alt="Te"
                width={275}
                height={275}
                style={{ backgroundColor: '#ffffff', borderRadius: '50%' }}
              />
              <p style={{ marginTop: '-3px', fontWeight: 'bold' }}>TE</p>
            </div>
          </Link>

        </div>
      </motion.section>
    </main>
  );
}