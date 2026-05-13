"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Shield, Lock, Zap, Loader2, RefreshCw, ArrowLeft, Unlock, AlertTriangle, Clock, History, Plus } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useVault } from "@/lib/hooks/use-contract";
import Link from "next/link";

interface Vault {
  id: number;
  owner: string;
  balance: number;
  createdAt: number;
  lockPeriod: number;
  isActive: boolean;
  timeRemaining: number;
}

export default function VaultsPage() {
  const { connect, isConnected, stxAddress } = useStacks();
  const { getVaultDetails, createVault, withdraw, loading } = useVault();

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ amount: "100", duration: "144" });

  const fetchVaults = useCallback(async () => {
    if (!stxAddress) return;
    setFetching(true);
    try {
      const list: Vault[] = [];
      // Fetch the first few vaults for MVP demonstration
      for (let i = 0; i < 3; i++) {
        const v = await getVaultDetails(i);
        if (v?.value) {
          const val = v.value;
          list.push({
            id: i,
            owner: val.owner?.value,
            balance: Number(val.balance?.value ?? 0) / 1000000,
            createdAt: Number(val["created-at"]?.value ?? 0),
            lockPeriod: Number(val["lock-period"]?.value ?? 0),
            isActive: val["is-active"]?.value ?? false,
            timeRemaining: Math.max(0, Number(val["lock-period"]?.value ?? 0) - 100000), // Placeholder block height
          });
        }
      }
      setVaults(list);
    } catch (e) {
      console.error("Failed to fetch vaults:", e);
    } finally {
      setFetching(false);
    }
  }, [getVaultDetails, stxAddress]);

  useEffect(() => { fetchVaults(); }, [fetchVaults]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountMicro = Math.floor(parseFloat(formData.amount) * 1000000);
    const lockBlock = 1000000; // Placeholder target block height
    await createVault(amountMicro, lockBlock, () => {
      setShowCreate(false);
      fetchVaults();
    });
  };

  return (
    <div className="min-h-screen px-6 py-24 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors mb-6 uppercase tracking-[0.2em]">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <h1 className="text-5xl font-black text-foreground uppercase italic tracking-tighter">
              PROGRAMMABLE <span className="text-primary italic">VAULTS.</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-2 uppercase text-[10px] tracking-[0.2em]">Monitoring your Bitcoin-native commitments</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCreate(true)} className="px-6 py-3 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Vault
            </button>
            <button onClick={fetchVaults} className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground transition-all">
              <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-8 rounded-3xl glass-card border-primary/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
             <form onSubmit={handleCreate} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deposit Amount (STX)</label>
                  <input type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lock Duration (Blocks)</label>
                  <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                    {loading ? "Confirming..." : "Initiate Lock"}
                  </button>
                  <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-3.5 rounded-xl bg-foreground/5 text-foreground/50 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 transition-all">
                    Cancel
                  </button>
                </div>
             </form>
          </motion.div>
        )}

        {!isConnected ? (
          <div className="text-center py-32 glass-card rounded-[3rem]">
            <Lock className="w-16 h-16 mx-auto mb-6 text-muted-foreground/20" />
            <h2 className="text-2xl font-black mb-4 uppercase italic">Authentication Required</h2>
            <button onClick={connect} className="px-10 py-4 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              Connect Stacks Wallet
            </button>
          </div>
        ) : fetching && vaults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Syncing with Stacks L2...</p>
          </div>
        ) : vaults.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-[3rem]">
            <History className="w-16 h-16 mx-auto mb-6 text-muted-foreground/20" />
            <p className="text-lg font-black text-muted-foreground uppercase italic tracking-tighter">No active vaults found</p>
            <button onClick={() => setShowCreate(true)} className="mt-6 px-10 py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
              Create Your First Vault
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vaults.map((vault, i) => (
              <motion.div key={vault.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-[2.5rem] border border-foreground/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vault ID</p>
                    <p className="text-xl font-black text-foreground italic tracking-tighter">#{vault.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Locked Capital</p>
                    <p className="text-4xl font-black text-foreground italic tracking-tighter">{vault.balance.toLocaleString()} <span className="text-primary">STX</span></p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Unlock Schedule</span>
                      <span>{vault.timeRemaining === 0 ? "Unlocked" : "Locked"}</span>
                    </div>
                    <div className="h-2 bg-foreground/5 rounded-full overflow-hidden border border-foreground/5">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: vault.timeRemaining === 0 ? "100%" : "25%" }} 
                        className={`h-full ${vault.timeRemaining === 0 ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-primary shadow-[0_0_15px_rgba(245,158,11,0.5)]"}`} 
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{vault.timeRemaining} blocks remaining</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-foreground/5">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Type</p>
                      <p className="text-xs font-bold text-foreground uppercase tracking-tight">Time-Lock</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Strategy</p>
                      <p className="text-xs font-bold text-primary uppercase tracking-tight italic">Passive Growth</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => withdraw(vault.id, () => fetchVaults())}
                    disabled={loading || !vault.isActive || vault.timeRemaining > 0}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      vault.timeRemaining === 0 && vault.isActive
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-[0_0_25px_rgba(34,197,94,0.3)]" 
                      : "bg-foreground/5 border border-foreground/10 text-foreground/30"
                    }`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : vault.timeRemaining === 0 ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {vault.timeRemaining === 0 ? "Withdraw Capital" : "Vault Locked"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
