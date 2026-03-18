"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="relative w-full h-[440px] flex items-center justify-center select-none">
      <motion.div className="absolute w-80 h-80 rounded-full border border-companion/15"
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity }} />
      <motion.div className="absolute w-56 h-56 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />

      {/* Center: lightning bolt circle */}
      <motion.div className="relative z-10 w-32 h-32"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_0_24px_rgba(249,115,22,0.45)]">
          <circle cx="32" cy="32" r="30" fill="#0C1A2E" stroke="#F97316" strokeWidth="2.5"/>
          <circle cx="32" cy="32" r="22" stroke="#0EA5E9" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
          <path d="M37 10 L23 34 H31 L27 54 L45 28 H37 L41 10 Z" fill="#F97316"/>
        </svg>
      </motion.div>

      {/* Live auction card */}
      <motion.div className="absolute top-6 right-10 bg-card border border-border rounded-2xl p-4 shadow-xl w-44"
        animate={{ y: [0, -12, 0], x: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase text-companion">Live Auction</span>
          <motion.div className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
        <p className="text-sm font-black text-foreground mb-1">BTC Inscription #441</p>
        <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
        <motion.p className="text-xl font-black text-primary"
          animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          920 STX
        </motion.p>
        <p className="text-[10px] text-red-400 font-bold mt-1">⏱ 2m 34s left</p>
      </motion.div>

      {/* Escrow card */}
      <motion.div className="absolute bottom-12 left-4 bg-card border border-border rounded-2xl p-4 shadow-xl w-36"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}>
        <div className="w-8 h-8 rounded-xl bg-companion/10 flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#0EA5E9" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <p className="text-[10px] text-muted-foreground">Escrow Deal</p>
        <p className="text-sm font-bold text-companion">SECURED</p>
        <p className="text-sm font-black mt-0.5">500 STX</p>
      </motion.div>

      {/* Registry card */}
      <motion.div className="absolute top-14 left-4 bg-card border border-border rounded-2xl p-4 shadow-xl w-32"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}>
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#F97316" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p className="text-[10px] text-muted-foreground">Registry</p>
        <p className="text-xs font-bold text-primary">VERIFIED</p>
      </motion.div>

      {[{ top: "25%", left: "48%", d: 0 }, { top: "65%", left: "55%", d: 1.5 }, { top: "40%", right: "14%", d: 0.8 }].map((p, i) => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-companion/70"
          style={p as React.CSSProperties}
          animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: p.d }} />
      ))}
    </div>
  );
}
