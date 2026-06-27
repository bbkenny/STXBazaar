"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useMemo } from "react";

import { useStacks } from "@/lib/hooks/use-stacks";

function formatAddress(address?: string | null) {
  if (!address) return "—";
  return address.length <= 10
    ? address
    : `${address.slice(0, 5)}…${address.slice(address.length - 5)}`;
}

export function WalletPanel() {
  const {
    status,
    providerName,
    isLoading,
    isPending,
    isConnected,
    stxAddress,
    btcAddress,
    error,
    connect,
    disconnect,
    refresh,
  } = useStacks();

  const statusCopy = useMemo(() => {
    switch (status) {
      case "connected":
        return "Wallet connected";
      case "pending":
        return "Awaiting wallet approval…";
      case "error":
        return "Wallet error";
      case "disconnected":
        return "No wallet connected";
      default:
        return "Idle";
    }
  }, [status]);

  return (
    <div className="w-full rounded-[2rem] border border-border bg-card/40 p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Status</p>
          <p className="text-3xl font-black tracking-tighter text-foreground">{statusCopy}</p>
          {providerName ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-companion" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{providerName}</p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={refresh}
            className="flex-1 md:flex-none rounded-xl border border-border px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
            disabled={isLoading}
          >
            Refresh Data
          </button>
          {isConnected ? (
            <button
              type="button"
              onClick={disconnect}
              className="flex-1 md:flex-none rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500/20 group"
              disabled={isLoading}
            >
              <span className="flex items-center gap-2 justify-center">
                <LogOut className="w-3.5 h-3.5" /> Disconnect
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="relative group flex-1 md:flex-none overflow-hidden rounded-xl bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
              disabled={isLoading || isPending}
            >
              <span className="relative z-10">{isPending ? "Opening wallet…" : "Link Wallet"}</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-border group/addr">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stacks Address</p>
            <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/addr:animate-pulse" />
          </div>
          <p className="font-mono text-sm text-muted-foreground/80 break-all select-all hover:text-primary transition-colors">
            {formatAddress(stxAddress)}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-border group/addr">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bitcoin Address</p>
            <div className="w-2 h-2 rounded-full bg-companion/40 group-hover/addr:animate-pulse" />
          </div>
          <p className="font-mono text-sm text-muted-foreground/80 break-all select-all hover:text-companion transition-colors">
            {formatAddress(btcAddress)}
          </p>
        </div>
      </div>

      {error ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
            Error: {error}
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
