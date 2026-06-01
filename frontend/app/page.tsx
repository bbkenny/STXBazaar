"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Zap, History, TrendingUp, Users, BarChart3, Activity } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { BazaarStatsSkeleton } from "./components/ui/SkeletonLoaders";

function Counter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
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
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export default function Home() {
  const { connect, isConnected } = useStacks();

  const [stats, setStats] = useState({
    tvl: 0,
    vaults: 0,
    yield: 0,
    activeUsers: 0,
  });

  const fetchStats = useCallback(async () => {
    // Placeholder stats integration
    setStats({
      tvl: 1300000,
      vaults: 42,
      yield: 10000,
      activeUsers: 842,
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const features = [
    {
      icon: Lock,
      colorClass: "text-primary",
      title: "Time-Locked Vaults",
      sub: "Secure & Enforced",
      desc: "Lock your BTC/STX with immutable release schedules. No early withdrawals, no exceptions. Absolute commitment, secured by Bitcoin finality.",
      href: "/vaults",
      stat: "Active",
    },
    {
      icon: Zap,
      colorClass: "text-companion",
      title: "Yield Strategies",
      sub: "Passive Growth",
      desc: "Your capital doesn't sit idle. Allocate locked funds to audited Stacks DeFi protocols to generate yield during the lock duration.",
      href: "/yield",
      stat: "Live",
    },
    {
      icon: History,
      colorClass: "text-primary",
      title: "Structured Release",
      sub: "Programmable Capital",
      desc: "Set up linear streaming or milestone-based unlocks. Perfect for vesting, family trusts, or long-term treasury management.",
      href: "/history",
      stat: "Customizable",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Deposit Capital",
      desc: "Link your Stacks wallet and deposit STX or sBTC into your personal non-custodial vault.",
    },
    {
      num: "02",
      title: "Define Rules",
      desc: "Specify your unlock date, release schedule (streaming or cliff), and optional yield strategies.",
    },
    {
      num: "03",
      title: "Commit",
      desc: "Execute the transaction to lock your assets under Clarity smart contract rules. Your future self will thank you.",
    },
  ];

  const featuresRef = useRef(null);
  const inView = useInView(featuresRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/hero-luxe-opt.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-companion/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 flex flex-col items-start text-left w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 mb-8 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#F59E0B]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 tracking-widest">
              Bitcoin-Native Commitment Protocol
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground mb-8 uppercase italic"
          >
            LOCK.
            <br />
            COMMIT.
            <br />
            <span className="text-primary text-amber-glow">SCALE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl font-medium"
          >
            Transform static Bitcoin assets into programmable, yield-bearing
            financial instruments with STX Bazaar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap items-center gap-5"
          >
            {isConnected ? (
              <Link
                href="/vaults"
                className="relative group overflow-hidden rounded-2xl bg-primary px-10 py-5 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Manage Vaults <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            ) : (
              <button
                onClick={connect}
                className="relative group overflow-hidden rounded-2xl bg-primary px-10 py-5 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Create First Vault <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}
            <Link
              href="/yield"
              className="glass-pill px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-foreground hover:bg-foreground/10 transition-all flex items-center gap-3 border border-foreground/5"
            >
              Yield Strategies{" "}
              <TrendingUp className="w-5 h-5 text-primary/60" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="mx-auto max-w-7xl">
          {stats.tvl === 0 ? (
            <BazaarStatsSkeleton />
          ) : (
            <div className="glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: BarChart3,
                  label: "Total Value Locked",
                  target: stats.tvl / 1000000,
                  suffix: "M STX",
                  decimals: 1,
                },
                {
                  icon: Lock,
                  label: "Active Vaults",
                  target: stats.vaults,
                  suffix: "",
                  decimals: 0,
                },
                {
                  icon: TrendingUp,
                  label: "Yield Generated",
                  target: stats.yield / 1000000,
                  suffix: "M STX",
                  decimals: 2,
                },
                {
                  icon: Activity,
                  label: "Protocol Users",
                  target: stats.activeUsers,
                  suffix: "",
                  decimals: 0,
                },
              ].map(
                ({ icon: Icon, label, target, prefix, suffix, decimals }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center md:items-start gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-2xl font-black tracking-tighter text-foreground">
                        <Counter
                          target={target}
                          prefix={prefix}
                          suffix={suffix}
                          decimals={decimals}
                        />
                      </p>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] ml-11">
                      {label}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={featuresRef}
        className="py-32 px-6 relative overflow-hidden"
      >
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6"
            >
              Protocol Services
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.05] uppercase italic"
            >
              PROGRAMMABLE <br />
              <span className="text-muted-foreground opacity-50">
                FINANCIAL LOGIC.
              </span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.1 * i + 0.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={feat.href}
                    className="group flex flex-col h-full p-10 rounded-[2.5rem] glass-card relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-companion/10 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      <Icon className={`w-7 h-7 ${feat.colorClass}`} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-3">
                      {feat.sub}
                    </p>
                    <h3 className="text-3xl font-black mb-5 text-foreground tracking-tighter group-hover:text-primary transition-colors uppercase italic">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed flex-1 mb-8">
                      {feat.desc}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black text-primary px-4 py-2 rounded-full bg-primary/10 uppercase tracking-widest">
                        {feat.stat}
                      </span>
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
      <section className="py-32 px-6 bg-foreground/[0.01] border-y border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">
              Workflow
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic">
              THREE STEPS TO COMMIT.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-6 relative group"
              >
                <span className="text-8xl font-black text-foreground/[0.03] leading-none absolute -top-8 -left-4 select-none group-hover:text-primary/10 transition-colors">
                  {step.num}
                </span>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-black text-foreground mb-4 tracking-tight uppercase">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[3rem] bg-gradient-to-br from-card to-background border border-foreground/5 text-center relative overflow-hidden shadow-2xl"
          >
            <h2 className="relative text-5xl md:text-6xl font-black text-foreground mb-8 tracking-tighter leading-tight uppercase italic">
              SECURE YOUR <br />
              <span className="text-primary italic">BITCOIN FUTURE.</span>
            </h2>
            <p className="relative text-muted-foreground mb-12 max-w-lg mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight">
              Establish your first Bitcoin-anchored financial commitment on
              Stacks L2 today.
            </p>
            <div className="flex justify-center">
              {isConnected ? (
                <Link
                  href="/vaults"
                  className="inline-block relative group overflow-hidden rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Create Your First Vault <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              ) : (
                <button
                  onClick={connect}
                  className="relative group overflow-hidden rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Connect Stacks Wallet <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
