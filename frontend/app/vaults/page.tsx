"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Shield, Lock, Zap, Loader2, RefreshCw, ArrowLeft, Unlock, AlertTriangle, Clock, History, Plus, Wallet, CheckCircle, Activity, Landmark } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useVault } from "@/lib/hooks/use-contract";
import { useBalance } from "@/lib/hooks/use-balance";
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
  const { getVaultDetails, getTotalVaults, createVault, withdraw, loading } = useVault();

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ amount: "100", duration: "144" });
  
  const { formattedSTX, rawMicroStx, isLoading: balanceLoading } = useBalance();
  const [simState, setSimState] = useState<"idle" | "simulating" | "broadcasting" | "confirmed">("idle");
  const [txId, setTxId] = useState("");
  
  const amountMicroStx = BigInt(Math.floor(parseFloat(formData.amount || "0") * 1000000));
  const exceedsBalance = amountMicroStx > rawMicroStx && rawMicroStx > BigInt(0);

  const fetchVaults = useCallback(async () => {
    if (!stxAddress) return;
    setFetching(true);
    try {
      const list: Vault[] = [];
      const totalRes = await getTotalVaults();
      const totalVaults = totalRes ? parseInt(totalRes.value, 10) : 0;

      if (!isNaN(totalVaults) && totalVaults > 0) {
        // Fetch vaults (up to top 50 for performance)
        const limit = Math.min(totalVaults, 50);
        for (let i = 0; i < limit; i++) {
          const v = await getVaultDetails(i);
          if (v && v.value && v.value.owner) {
            const val = v.value;
            const ownerAddress = val.owner?.value;
            
            // Only show the user's vaults!
            if (ownerAddress === stxAddress) {
              list.push({
                id: i,
                owner: ownerAddress,
                balance: Number(val.balance?.value ?? 0) / 1000000,
                createdAt: Number(val["created-at"]?.value ?? 0),
                lockPeriod: Number(val["lock-period"]?.value ?? 0),
                isActive: val["is-active"]?.value ?? false,
                timeRemaining: Math.max(0, Number(val["lock-period"]?.value ?? 0) - 100000), // Placeholder block height
              });
            }
          }
        }
      }

      setVaults(list);
    } catch (e) {
      console.error("Failed to fetch vaults:", e);
    } finally {
      setFetching(false);
    }
  }, [getVaultDetails, getTotalVaults, stxAddress]);

  useEffect(() => { fetchVaults(); }, [fetchVaults]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountMicroStx || amountMicroStx <= BigInt(0)) return;
    if (exceedsBalance) return;
    
    setSimState("simulating");
  };

  const confirmTransaction = async () => {
    setSimState("broadcasting");
    const lockBlock = 1000000; // Placeholder target block height
    await createVault(Number(amountMicroStx), lockBlock, (data: any) => {
      if (data && data.txId) setTxId(data.txId);
      setSimState("confirmed");
      setTimeout(() => {
        setSimState("idle");
        setShowCreate(false);
        fetchVaults();
      }, 2000);
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
             <form onSubmit={handleCreate} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deposit Amount (STX)</label>
                    <span className={`text-[9px] font-bold uppercase flex items-center gap-1 ${balanceLoading ? "text-slate-600" : "text-slate-400"}`}>
                      <Wallet className="w-3 h-3" /> Bal: {balanceLoading ? "..." : formattedSTX} STX
                    </span>
                  </div>
                  <div className="relative">
                    <input type="number" step="any" min="0.000001" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={`w-full bg-background border ${exceedsBalance ? "border-red-500/50" : "border-foreground/10"} rounded-xl px-4 py-3 font-bold focus:border-primary outline-none pr-16`} />
                    <button type="button" onClick={() => setFormData({...formData, amount: (Number(rawMicroStx) / 1000000).toString()})} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary hover:text-orange-400">MAX</button>
                  </div>
                  {exceedsBalance && <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-1 animate-pulse">Insufficient Balance</p>}
                </div>
                <div className="space-y-2 mt-0">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Lock Duration (Blocks)</span>
                    {formData.duration && <span className="text-primary tracking-wider">(~ {(Number(formData.duration) / 6).toFixed(1)} hours)</span>}
                  </label>
                  <input type="number" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 font-bold focus:border-primary outline-none" />
                </div>
                <div className="flex gap-4 items-end h-full pt-6">
                  <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                    Initiate Lock
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
          <div className="flex flex-col items-center max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">No Active Vaults</h2>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Create one below. Here is an example of what your vault will look like:</p>
            </div>
            
            {/* Labeled Mockup Example */}
            <div className="w-full relative">
              <div className="absolute -top-3 -right-3 z-20 bg-primary text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg transform rotate-3">
                Mock Example
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="glass-card p-8 rounded-[2.5rem] border-2 border-dashed border-primary/30 relative overflow-hidden bg-primary/5"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="relative">
                    <div className="absolute -top-6 -left-2 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Vault Icon</div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40">
                      <Landmark className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-right relative">
                    <div className="absolute -top-6 right-0 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded whitespace-nowrap">Unique Vault ID</div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vault ID</p>
                    <p className="text-xl font-black text-foreground italic tracking-tighter">#0001</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="relative">
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Deposit</div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Locked Capital</p>
                    <p className="text-4xl font-black text-foreground italic tracking-tighter">15,000 <span className="text-primary">STX</span></p>
                  </div>

                  <div className="space-y-2 relative border border-primary/20 p-3 rounded-2xl bg-background/50">
                    <div className="absolute -top-3 left-4 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Timeline Tracking</div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                      <span>Unlock Schedule</span>
                      <span>Locked</span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-primary shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">144 blocks remaining (~ 24 hrs)</span>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-foreground/10 text-foreground/50 border border-dashed border-foreground/20 cursor-not-allowed">
                    <Lock className="w-4 h-4" /> Vault Locked
                  </button>
                </div>
              </motion.div>
            </div>

            <button onClick={() => setShowCreate(true)} className="mt-12 px-12 py-5 rounded-full bg-primary text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]">
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
                    <Landmark className="w-6 h-6 text-primary" />
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

      {/* Transaction Simulation Modal */}
      {simState !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-secondary border border-primary/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              {simState === "simulating" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <Activity className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h2 className="text-xl font-black uppercase mb-2">Simulating Transaction</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    You are about to lock <span className="text-foreground font-bold">{formData.amount} STX</span> into the bazaar.
                  </p>
                  
                  <div className="w-full bg-background/50 rounded-xl p-4 mb-8 text-left space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider">Estimated Fee</span>
                      <span className="text-foreground">~0.002 STX</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider">Lock Duration</span>
                      <span className="text-foreground">{formData.duration} Blocks</span>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button onClick={() => setSimState("idle")} className="flex-1 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground text-xs font-black uppercase tracking-widest transition-colors">
                      Cancel
                    </button>
                    <button onClick={confirmTransaction} className="flex-1 py-3 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      Sign & Confirm
                    </button>
                  </div>
                </>
              )}

              {simState === "broadcasting" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h2 className="text-xl font-black uppercase mb-2">Broadcasting</h2>
                  <p className="text-sm text-muted-foreground">
                    Awaiting your signature and pushing to the network...
                  </p>
                </>
              )}

              {simState === "confirmed" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-black uppercase mb-2 text-green-400">Lock Confirmed</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your STX is now securely vaulted.
                  </p>
                  {txId && (
                    <p className="text-[10px] text-muted-foreground font-mono mb-4 break-all">
                      TxID: {txId}
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      </div>
    </div>
  );
}
