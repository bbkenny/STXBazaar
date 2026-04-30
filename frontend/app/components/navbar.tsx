"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStacks } from "@/lib/hooks/use-stacks";
import { ThemeToggle } from "./ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, LogOut, User, Gavel, ShieldCheck, BookOpen, Home } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Auctions", href: "/auctions", icon: Gavel },
  { name: "Escrow", href: "/escrow", icon: ShieldCheck },
  { name: "Registry", href: "/registry", icon: BookOpen },
];

function formatAddress(address?: string | null) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, stxAddress, connect, disconnect } = useStacks();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="mx-auto max-w-7xl h-16 glass-pill rounded-2xl flex items-center justify-between px-6 pointer-events-auto transition-all duration-500 hover:shadow-primary/5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative">
            <img src="/stxbazaar-logo.png" alt="STX Bazaar" className="w-8 h-8 transition-transform group-hover:scale-110 relative z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">
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
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 group">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-foreground/90">{formatAddress(stxAddress)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-foreground/40 group-data-[state=open]:rotate-180 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 bg-card/90 backdrop-blur-2xl border-border rounded-2xl shadow-2xl">
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
      </nav>
    </div>
  );
}
