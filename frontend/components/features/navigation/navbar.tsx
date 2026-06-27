"use client";

import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useEffect, useState } from "react";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, User, Lock, LayoutDashboard, Zap, History, Wallet, Menu, X, Settings } from "lucide-react";
import { PLATFORM_CONFIG } from "@/lib/constants/contracts";

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
}

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, stxAddress, connect, disconnect } = useStacks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = stxAddress === PLATFORM_CONFIG.deployer;

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
          
          {isAdmin && (
            <Link 
              href="/admin"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                pathname === "/admin" ? "text-primary bg-primary/8" : "text-amber-500/80 hover:text-amber-500 hover:bg-amber-500/5"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
              {pathname === "/admin" && <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" />}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <ThemeToggle />
          
          {/* DESKTOP WALLET CONTROLS */}
          <div className="hidden md:flex items-center gap-2">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 group">
                    <div className="w-6 h-6 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${stxAddress}`} alt="avatar" className="w-full h-full object-cover" />
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

          {/* MOBILE WALLET CONTROLS */}
          <div className="flex md:hidden items-center gap-2">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 group">
                    <div className="w-5 h-5 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${stxAddress}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-foreground/90">{formatAddress(stxAddress)}</span>
                    <ChevronDown className="w-3 h-3 text-foreground/40 group-data-[state=open]:rotate-180 transition-transform" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1.5 bg-card/90 backdrop-blur-2xl border border-border rounded-xl shadow-2xl">
                  {stxAddress && (
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-foreground/5 bg-foreground/5 text-foreground/80 cursor-default mb-1">
                      <Wallet className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-wider leading-none">Wallet Balance</span>
                        <span className="text-[10px] font-black font-mono text-foreground mt-0.5">
                          <WalletBalance address={stxAddress} />
                        </span>
                      </div>
                    </div>
                  )}
                  <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 px-2.5 py-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={connect} className="relative group overflow-hidden rounded-xl bg-primary px-4 py-2 text-[9px] font-black uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <span className="relative z-10">Connect</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex md:hidden items-end justify-around pb-4 pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col items-center justify-center flex-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10 scale-110" : "group-hover:bg-foreground/5 group-active:bg-foreground/5 group-hover:-translate-y-1 group-active:-translate-y-1"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-black tracking-wider uppercase mt-1 text-center block w-full transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
