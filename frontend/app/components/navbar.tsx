"use client";

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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image src="/logo.svg" alt="STX Bazaar" width={32} height={32} className="transition-transform group-hover:scale-110" />
          <span className="text-lg font-black tracking-tight text-foreground">
            STX<span className="text-primary"> Bazaar</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-white shadow-sm shadow-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />{item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border border-border shadow-sm group">
                  <div className="w-6 h-6 rounded-full bg-companion/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-companion" />
                  </div>
                  <span className="font-mono text-xs">{formatAddress(stxAddress)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="w-4 h-4" />Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={connect} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary/90 shadow-lg shadow-primary/25 active:scale-95">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
