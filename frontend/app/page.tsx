"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Gavel, ShieldCheck, BookOpen, Zap, Lock, Globe, ChevronRight, Activity, TrendingUp, FileCheck, Database } from "lucide-react";
import { HeroIllustration } from "./components/hero-illustration";
import { useStacks } from "@/lib/hooks/use-stacks";

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      setCount(Math.floor(n));
      if (n >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Gavel, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Live Auctions", sub: "Bid & Win", desc: "Real-time on-chain bidding. Previous bidder is auto-refunded the moment they are outbid. Winner pays only when the auction timer expires.", href: "/auctions", stat: "320+ Active" },
  { icon: ShieldCheck, colorClass: "text-companion", bgClass: "bg-companion/10", title: "Secure Escrow", sub: "Trust Nobody", desc: "Lock STX in smart contract escrow. Dispute resolution built-in. Funds release only when both parties confirm — zero counterparty risk.", href: "/escrow", stat: "1,840 Deals" },
  { icon: BookOpen, colorClass: "text-primary", bgClass: "bg-primary/10", title: "Asset Registry", sub: "Verify On-Chain", desc: "Register and verify asset ownership on Bitcoin. Immutable proof of authenticity that cannot be altered or revoked by any third party.", href: "/registry", stat: "9.2K+ Assets" },
];

const stats = [
  { icon: Activity, label: "Live Auctions", target: 320, suffix: "+" },
  { icon: TrendingUp, label: "Trading Volume", prefix: "$", target: 2400000 },
  { icon: FileCheck, label: "Escrow Deals", target: 1840 },
  { icon: Database, label: "Registered Assets", target: 9200, suffix: "+" },
];

const steps = [
  { num: "01", title: "Connect Wallet", desc: "Link your Stacks wallet (Leather or Xverse). Your wallet is your identity — no signups, no KYC." },
  { num: "02", title: "List or Bid", desc: "Create an auction, set up an escrow deal, or bid on live listings. Everything happens on-chain." },
  { num: "03", title: "Settle Instantly", desc: "Funds move automatically when conditions are met. No waiting, no middleman, no fees to a third party." },
];

export default function Home() {
  const { connect, isConnected } = useStacks();
  const featuresRef = useRef(null);
  const inView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0c0a09] min-h-[95vh] flex items-center">
        {/* Warm grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[25%] right-[20%] w-[350px] h-[350px] bg-companion/6 rounded-full blur-[100px] pointer-events-none" />
        {/* Diamond pattern accent */}
        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04] pointer-events-none" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 L60,0 L120,60 L60,120 Z" fill="#F59E0B" />
          <path d="M120,60 L180,0 L240,60 L180,120 Z" fill="#F59E0B" />
          <path d="M240,60 L300,0 L360,60 L300,120 Z" fill="#F59E0B" />
          <path d="M360,60 L420,0 L480,60 L420,120 Z" fill="#F59E0B" />
          <path d="M480,60 L540,0 L600,60 L540,120 Z" fill="#F59E0B" />
          <path d="M600,60 L660,0 L720,60 L660,120 Z" fill="#F59E0B" />
          <path d="M720,60 L780,0 L840,60 L780,120 Z" fill="#F59E0B" />
          <path d="M840,60 L900,0 L960,60 L900,120 Z" fill="#F59E0B" />
          <path d="M960,60 L1020,0 L1080,60 L1020,120 Z" fill="#F59E0B" />
          <path d="M1080,60 L1140,0 L1200,60 L1140,120 Z" fill="#F59E0B" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/8 border border-primary/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Trustless &middot; Bitcoin Secured</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight text-white mb-6" style={{ fontFamily: "var(--font-display), serif" }}>
              Trade Fast.<br />
              Settle <span className="text-primary text-amber-glow italic">Instantly.</span><br />
              <span className="text-companion">Trust Nobody.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="text-lg text-stone-400 leading-relaxed mb-10 max-w-lg">
              The lightning-speed trustless marketplace on Stacks L2. Live auctions with auto-refund, smart contract escrow, and on-chain asset registry — all backed by Bitcoin finality.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Link href="/auctions" className="group inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-sm font-bold text-primary-foreground hover:bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all hover:scale-105 active:scale-95">
                  Browse Auctions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button onClick={connect} className="group inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-sm font-bold text-primary-foreground hover:bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all hover:scale-105 active:scale-95">
                  Start Trading <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <Link href="/escrow" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-9 py-4 text-sm font-semibold text-white/80 hover:bg-white/5 hover:border-white/20 transition-all">
                Create Escrow <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
              {[{ icon: Lock, label: "Bitcoin Finality" }, { icon: Zap, label: "Instant Settlement" }, { icon: Globe, label: "Zero Counterparty" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-stone-500">
                  <Icon className="w-4 h-4 text-companion/70" />
                  <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-secondary/40 border-y border-border backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, target, prefix, suffix }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display), serif" }}><Counter target={target} prefix={prefix} suffix={suffix} /></p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">Marketplace Tools</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display), serif" }}>
              Trade on Bitcoin.<br />
              <span className="text-primary italic">No middlemen. Ever.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.href} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 * i + 0.2 }}>
                  <Link href={feat.href} className="group flex flex-col h-full p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(245,158,11,0.06)]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-companion/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${feat.colorClass}`} />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-companion mb-2">{feat.sub}</p>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-display), serif" }}>{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{feat.desc}</p>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-md uppercase tracking-wider">{feat.stat}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display), serif" }}>Trade in three steps.<br /><span className="italic">Settle in seconds.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-4 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm">
                <span className="text-7xl font-bold text-primary/15 leading-none" style={{ fontFamily: "var(--font-display), serif" }}>{step.num}</span>
                <h3 className="text-xl font-bold -mt-2" style={{ fontFamily: "var(--font-display), serif" }}>{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-amber-500 to-orange-500 p-14 text-center shadow-[0_0_60px_rgba(245,158,11,0.2)]">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <h2 className="relative text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-display), serif" }}>Start Trading on Bitcoin.</h2>
            <p className="relative text-white/80 mb-10 max-w-lg mx-auto text-lg">Connect your Stacks wallet and access the trustless marketplace. No registration, no fees to us.</p>
            <button onClick={connect} className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-bold text-amber-700 hover:bg-white/95 transition-all hover:scale-105 active:scale-95 shadow-lg">
              Connect Wallet <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
