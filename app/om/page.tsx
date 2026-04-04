"use client";

import { motion } from "framer-motion";

export default function KontaktPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero"
      style={{ paddingTop: '200px' }}
    >
      <h1>Om Oss</h1>
      <p style={{ marginTop: '25px', marginBottom: '39px', fontSize: '20px', letterSpacing: '0.4em' }}>
        Kommer Snart
      </p>
      <p style={{ letterSpacing: '6px', fontSize: '25px', textTransform: 'uppercase' }}>
        @ S W E G B G T R A D I N G
      </p>
    </motion.section>
  );
}