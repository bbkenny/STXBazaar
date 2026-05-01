"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Gavel, ShieldCheck, BookOpen, Activity, TrendingUp, FileCheck, Database } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useAuctionHouse, useEscrow, useRegistry } from "@/lib/hooks/use-contract";

const STX_TO_MICRO = 1_000_000;

function Counter({ target, prefix = "", suffix = "", decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / 80;
    if (target === 0) {
      setCount(0);
      return;
    }
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      setCount(n);
      if (n >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: Math.max(decimals, 6) })}{suffix}</span>;
}





const steps = [
  { num: "01", title: "Connect Wallet", desc: "Link your Stacks wallet (Leather or Xverse). Your wallet is your identity — no signups, no KYC." },
  { num: "02", title: "List or Bid", desc: "Create an auction, set up an escrow deal, or bid on live listings. Everything happens on-chain." },
  { num: "03", title: "Settle Instantly", desc: "Funds move automatically when conditions are met. No waiting, no middleman, no fees to a third party." },
];

export default function Home() {
  const { connect, isConnected } = useStacks();
  const { getMarketplaceStats } = useAuctionHouse();
  const { getPlatformStats } = useEscrow();
  const { getRegistryStats } = useRegistry();

  const [liveStats, setLiveStats] = useState({
    auctions: 0,
    volume: 0,
    escrows: 0,
    assets: 0,
  });

  const fetchStats = async () => {
    try {
      const [auctionData, escrowData, registryData] = await Promise.all([
        getMarketplaceStats(),
        getPlatformStats(),
        getRegistryStats(),
      ]);

      const av = auctionData?.value;
      const ev = escrowData?.value;
      const rv = registryData?.value;

      setLiveStats({
        auctions: Number(av?.["total-auctions"]?.value ?? 0),
        volume: Number(av?.["total-volume"]?.value ?? 0) / STX_TO_MICRO,
        escrows: Number(ev?.["total-escrows"]?.value ?? 0),
        assets: Number(rv?.["total-registrations"]?.value ?? 0),
      });
    } catch (e) {
      console.error("Failed to fetch landing stats:", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    { icon: Activity, label: "Live Auctions", target: liveStats.auctions, suffix: "", decimals: 0 },
    { icon: TrendingUp, label: "Trading Volume", prefix: "", target: liveStats.volume, suffix: " STX", decimals: 3 },
    { icon: FileCheck, label: "Escrow Deals", target: liveStats.escrows, suffix: "", decimals: 0 },
    { icon: Database, label: "Registered Assets", target: liveStats.assets, suffix: "+", decimals: 0 },
  ];

  const features = [
    { icon: Gavel, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Live Auctions", sub: "Bid & Win", desc: "Real-time on-chain bidding. Previous bidder is auto-refunded the moment they are outbid. Winner pays only when the auction timer expires.", href: "/auctions", stat: `${liveStats.auctions} Active` },
    { icon: ShieldCheck, colorClass: "text-companion", bgClass: "bg-companion/10", title: "Secure Escrow", sub: "Trust Nobody", desc: "Lock STX in smart contract escrow. Dispute resolution built-in. Funds release only when both parties confirm — zero counterparty risk.", href: "/escrow", stat: `${liveStats.escrows} Deals` },
    { icon: BookOpen, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Asset Registry", sub: "Verify On-Chain", desc: "Register and verify asset ownership on Bitcoin. Immutable proof of authenticity that cannot be altered or revoked by any third party.", href: "/registry", stat: `${liveStats.assets} Assets` },
  ];

  const featuresRef = useRef(null);
  const inView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-background">
        {/* New Hero background integration */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <img src="/hero-luxe-opt.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>
        
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-companion/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 flex flex-col items-start text-left w-full">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 mb-8 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#F59E0B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">Secured by Bitcoin Finality</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter text-foreground mb-8">
              TRADE <span className="text-primary italic text-amber-glow">FAST</span>.<br />
              SETTLE <span className="text-foreground/40">NOW.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl font-medium">
              The lightning-speed trustless marketplace on Stacks L2. Peer-to-peer auctions and secure escrow with zero counterparty risk.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap items-center gap-5">
              {isConnected ? (
                <Link href="/auctions" className="relative group overflow-hidden rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                  <span className="relative z-10 flex items-center gap-3">Browse Auctions <ArrowRight className="w-5 h-5" /></span>
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 font-bold" />
                </Link>
              ) : (
                <button onClick={connect} className="relative group overflow-hidden rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                  <span className="relative z-10 flex items-center gap-3">Start Trading <ArrowRight className="w-5 h-5" /></span>
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              )}
              <Link href="/escrow" className="glass-pill px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-foreground hover:bg-foreground/10 transition-all flex items-center gap-3 border border-foreground/5">
                Secure Escrow <ShieldCheck className="w-5 h-5 text-primary/60" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="mx-auto max-w-7xl glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, label, target, prefix, suffix, decimals }) => (
            <div key={label} className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-black tracking-tighter text-foreground">
                  <Counter target={target} prefix={prefix} suffix={suffix} decimals={decimals} />
                </p>
              </div>
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] ml-11">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-companion/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-24">
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Marketplace Protocols</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05]">
              TRUSTLESS TOOLS <br />
              <span className="text-muted-foreground italic opacity-50">FOR THE BITCOIN ERA.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.href} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 * i + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={feat.href} className="group flex flex-col h-full p-10 rounded-[2.5rem] glass-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-primary/10 transition-colors" />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-companion/10 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      <Icon className={`w-7 h-7 ${feat.colorClass}`} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-3">{feat.sub}</p>
                    <h3 className="text-3xl font-black mb-5 text-foreground tracking-tighter group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed flex-1 mb-8">{feat.desc}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black text-primary px-4 py-2 rounded-full bg-primary/10 uppercase tracking-widest">{feat.stat}</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5 translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Workflow</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">TRADE IN SECONDS.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-6 relative group">
                <span className="text-8xl font-black text-foreground/[0.03] leading-none absolute -top-8 -left-4 select-none group-hover:text-primary/10 transition-colors">{step.num}</span>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/2 blur-[150px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-16 rounded-[3rem] bg-gradient-to-br from-card to-background border border-foreground/5 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] gold-mesh" />
            <h2 className="relative text-5xl md:text-6xl font-black text-foreground mb-8 tracking-tighter leading-tight">START TRADING <br /><span className="text-primary italic">ON BITCOIN.</span></h2>
            <p className="relative text-muted-foreground mb-12 max-w-lg mx-auto text-xl font-medium leading-relaxed">Join the most advanced trustless marketplace on Stacks L2. No registration required.</p>
            {isConnected ? (
              <Link href="/auctions" className="inline-block relative group overflow-hidden rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <span className="relative z-10 flex items-center gap-3">Explore Marketplace <ArrowRight className="w-5 h-5 translate-x-[-2px] group-hover:translate-x-0 transition-transform" /></span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none opacity-10" />
              </Link>
            ) : (
              <button onClick={connect} className="relative group overflow-hidden rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <span className="relative z-10 flex items-center gap-3">Connect Wallet <ArrowRight className="w-5 h-5 translate-x-[-2px] group-hover:translate-x-0 transition-transform" /></span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none opacity-10" />
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
