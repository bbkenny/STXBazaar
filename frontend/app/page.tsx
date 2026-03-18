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
      <section className="relative overflow-hidden bg-[#020617] min-h-[92vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(#0EA5E9 1px,transparent 1px),linear-gradient(90deg,#0EA5E9 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-companion/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-companion/15 border border-companion/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-companion animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-companion">Trustless · Bitcoin Secured</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6">
              Trade Fast.<br />Settle Instantly.<br /><span className="text-primary">Trust Nobody.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              The lightning-speed trustless marketplace on Stacks L2. Live auctions with auto-refund, smart contract escrow, and on-chain asset registry — all backed by Bitcoin finality.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Link href="/auctions" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Browse Auctions <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button onClick={connect} className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Start Trading <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link href="/escrow" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all">
                Create Escrow <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-6 mt-10">
              {[{ icon: Lock, label: "Bitcoin Finality" }, { icon: Zap, label: "Instant Settlement" }, { icon: Globe, label: "Zero Counterparty" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-companion" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, target, prefix, suffix }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-companion/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-companion" />
              </div>
              <div>
                <p className="text-2xl font-black"><Counter target={target} prefix={prefix} suffix={suffix} /></p>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Marketplace Tools</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight">
              Trade on Bitcoin.<br /><span className="text-primary">No middlemen. Ever.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.href} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 * i + 0.2 }}>
                  <Link href={feat.href} className="group flex flex-col h-full p-8 rounded-3xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                    <div className={`w-14 h-14 ${feat.bgClass} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feat.colorClass}`} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{feat.sub}</p>
                    <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{feat.desc}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{feat.stat}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black">Trade in three steps.<br />Settle in seconds.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border">
                <span className="text-5xl font-black text-companion/20 leading-none">{step.num}</span>
                <h3 className="text-lg font-bold -mt-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-companion to-companion/80 p-12 text-center shadow-2xl shadow-companion/25">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%,white 1px,transparent 1px),radial-gradient(circle at 80% 50%,white 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            <h2 className="relative text-3xl md:text-4xl font-black text-white mb-4">Start Trading on Bitcoin.</h2>
            <p className="relative text-white/80 mb-8 max-w-md mx-auto">Connect your Stacks wallet and access the trustless marketplace. No registration, no fees to us.</p>
            <button onClick={connect} className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-black text-companion hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg">
              Connect Wallet <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
