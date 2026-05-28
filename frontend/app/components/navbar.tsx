"use client";

import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, LogOut, User, Lock, LayoutDashboard, Zap, History, Wallet, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Vaults", href: "/vaults", icon: Lock },
  { name: "Yield", href: "/yield", icon: Zap },
  { name: "History", href: "/history", icon: History },
];

function formatAddress(address?: string | null) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function WalletBalance({ address }: { address: string }) {
  const [balance, setBalance] = useState<string>("Loading...");

  useEffect(() => {
    if (!address) return;
    let isMounted = true;
    
    async function fetchBalance() {
      try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`);
        const data = await res.json();
        if (isMounted && data.stx?.balance) {
          const stxAmount = (Number(data.stx.balance) / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
          setBalance(`${stxAmount} STX`);
        }
      } catch (err) {
        if (isMounted) setBalance("Error");
      }
    }
    
    fetchBalance();
    return () => { isMounted = false; };
  }, [address]);

  return <>{balance}</>;
}export function Navbar() {
  const pathname = usePathname();
  const { isConnected, stxAddress, connect, disconnect } = useStacks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="mx-auto max-w-7xl h-16 glass-pill rounded-2xl flex items-center justify-between px-6 pointer-events-auto transition-all duration-500 hover:shadow-primary/5">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
            <img src="/stxbazaar-logo.png" alt="STX Bazaar" className="w-full h-full object-contain transition-transform group-hover:scale-110 relative z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="hidden sm:inline text-lg md:text-xl font-black tracking-tighter text-foreground">
            STX<span className="text-primary italic">BAZAAR</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5 p-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive ? "text-primary bg-primary/8" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.name}
                {isActive && <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" />}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <ThemeToggle />
          
          {/* DESKTOP WALLET CONTROLS */}
          <div className="hidden md:flex items-center gap-2">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 group">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20 shrink-0">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-foreground/90">{formatAddress(stxAddress)}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-foreground/40 group-data-[state=open]:rotate-180 transition-transform" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2 bg-card/90 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl">
                  {stxAddress && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-foreground/5 bg-foreground/5 text-foreground/80 cursor-default mb-2">
                      <Wallet className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider leading-none">Wallet Balance</span>
                        <span className="text-xs font-black font-mono text-foreground mt-0.5">
                          <WalletBalance address={stxAddress} />
                        </span>
                      </div>
                    </div>
                  )}
                  <DropdownMenuItem onClick={disconnect} className="flex items-center gap-3 p-3 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={connect} className="relative group overflow-hidden rounded-xl bg-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <span className="relative z-10">Connect Wallet</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden p-2 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border p-6 shadow-2xl z-50 flex flex-col justify-between md:hidden text-foreground pointer-events-auto"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-6">
                  <div className="flex items-center gap-2">
                    <img src="/stxbazaar-logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                    <span className="text-sm font-black tracking-tight text-foreground font-display">
                      STX<span className="text-primary italic">BAZAAR</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                {/* Navigation inside drawer */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? "text-primary bg-primary/10 border-l-2 border-primary font-bold" 
                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Footer / Account section inside drawer */}
              <div className="space-y-4 pt-6 border-t border-border/40">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-foreground/5 p-3 border border-border flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20 shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono font-bold text-foreground truncate">{formatAddress(stxAddress)}</p>
                        <p className="text-[10px] font-black text-primary tracking-wider uppercase mt-0.5">
                          {stxAddress && <WalletBalance address={stxAddress} />}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connect();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-widest text-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    Connect Wallet
                  </button>
                )}
                
                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22C55E]" />
                  <span>Protocol Operational</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
