"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Unlock, 
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Wallet,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useStacks } from "@/lib/hooks/use-stacks";

interface Transaction {
  txId: string;
  rawTxId: string;
  action: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Failed";
  blockHeight: number;
  timestamp: string;
  explorerUrl: string;
}

export default function HistoryPage() {
  const { isConnected, stxAddress } = useStacks();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback deployer address to fetch real, active protocol transactions when disconnected
  const targetAddress = stxAddress || "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D";

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.mainnet.hiro.so/extended/v1/address/${targetAddress}/transactions?limit=25`
      );
      if (!response.ok) throw new Error("Failed to query Stacks API");
      
      const data = await response.json();
      if (!data.results) {
        setTransactions([]);
        return;
      }

      const parsed: Transaction[] = data.results.map((tx: any) => {
        let action = "Contract Call";
        let amount = "N/A";
        
        if (tx.tx_type === "token_transfer") {
          action = "STX Transfer";
          amount = `${(Number(tx.token_transfer.amount) / 1000000).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })} STX`;
        } else if (tx.tx_type === "contract_call") {
          const fn = tx.contract_call.function_name;
          const cid = tx.contract_call.contract_id;
          
          if (cid.includes("stxbazaar-vault")) {
            if (fn === "create-vault") action = "Deposit";
            else if (fn === "withdraw") action = "Withdrawal";
            else action = `Vault: ${fn}`;
          } else if (cid.includes("stxbazaar-yieldadapter")) {
            if (fn === "allocate") action = "Allocation";
            else if (fn === "deallocate") action = "Deallocation";
            else action = `Yield: ${fn}`;
          } else {
            // Format function name to readable sentence
            action = fn.charAt(0).toUpperCase() + fn.slice(1).replace(/-/g, " ");
          }
          
          // Map fee as dynamic context
          amount = tx.fee_rate 
            ? `${(Number(tx.fee_rate) / 1000000).toLocaleString('en-US', { maximumFractionDigits: 6 })} STX (Fee)` 
            : "0 STX";
        } else if (tx.tx_type === "smart_contract") {
          action = "Deploy Contract";
          amount = "N/A";
        }

        const dateStr = tx.burn_block_time_iso 
          ? new Date(tx.burn_block_time_iso).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric", 
              hour: "2-digit", 
              minute: "2-digit" 
            })
          : "Pending Block";

        return {
          txId: `${tx.tx_id.slice(0, 6)}...${tx.tx_id.slice(-4)}`,
          rawTxId: tx.tx_id,
          action,
          amount,
          status: tx.tx_status === "success" ? "Confirmed" : tx.tx_status === "pending" ? "Pending" : "Failed",
          blockHeight: tx.block_height,
          timestamp: dateStr,
          explorerUrl: `https://explorer.hiro.so/txid/${tx.tx_id}?chain=mainnet`
        };
      });

      setTransactions(parsed);
    } catch (e) {
      console.error(e);
      setError("Failed to sync on-chain logs. Check connection.");
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.rawTxId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || 
                          tx.action.toLowerCase().includes(activeFilter.toLowerCase()) ||
                          (activeFilter === "Deposit" && tx.action === "Deposit") ||
                          (activeFilter === "Allocation" && tx.action === "Allocation") ||
                          (activeFilter === "Withdrawal" && tx.action === "Withdrawal");
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (action: string) => {
    if (action.includes("Deposit")) return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
    if (action.includes("Withdrawal")) return <ArrowUpRight className="w-4 h-4 text-primary" />;
    if (action.includes("Allocation")) return <Clock className="w-4 h-4 text-companion" />;
    if (action.includes("Deallocation") || action.includes("Unlock")) return <Unlock className="w-4 h-4 text-yellow-500" />;
    if (action.includes("Transfer")) return <Wallet className="w-4 h-4 text-primary" />;
    return <Settings className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Failed":
        return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="min-h-screen px-6 py-24 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors mb-6 uppercase tracking-[0.2em]">
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-foreground uppercase italic tracking-tighter">
                TRANSACTION <span className="text-primary italic">HISTORY.</span>
              </h1>
              <p className="text-muted-foreground font-medium mt-2 uppercase text-[10px] tracking-[0.2em]">
                {stxAddress ? "Live logs of your Stacks address" : "Live logs of STX Bazaar deployer contract"}
              </p>
            </div>
            
            {/* AUDIT COUNTERS */}
            <div className="flex flex-wrap gap-4 md:gap-8 bg-foreground/5 border border-foreground/10 p-4 rounded-2xl">
              <div className="pr-4 border-r border-foreground/10">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">Synced Records</span>
                <span className="text-lg font-black text-primary font-mono block mt-0.5">{transactions.length} Active</span>
              </div>
              <div className="pr-4 border-r border-foreground/10">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">Network type</span>
                <span className="text-lg font-black text-foreground block mt-0.5">Mainnet</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">API status</span>
                <span className="text-lg font-black text-green-500 block mt-0.5">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-foreground/5 border border-foreground/10 p-4 rounded-2xl">
          {/* Search box */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by Transaction ID or Action..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-foreground/10 rounded-xl pl-11 pr-4 py-3 font-bold text-xs focus:border-primary outline-none text-foreground"
            />
          </div>
          {/* Filter options */}
          <div className="flex gap-2 flex-wrap md:justify-end">
            {["All", "Deposit", "Allocation", "Withdrawal"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  activeFilter === filter
                  ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-background border-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSACTION AUDIT LIST */}
        <div className="glass-card rounded-[2.5rem] border border-foreground/5 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Stacks L2 Node...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 text-red-400 space-y-4">
              <ShieldAlert className="w-12 h-12 mx-auto text-red-500/30 animate-bounce" />
              <p className="text-sm font-black uppercase italic tracking-tighter">{error}</p>
              <button onClick={fetchHistory} className="px-6 py-2 bg-primary text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Retry</button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground space-y-4">
              <ShieldAlert className="w-12 h-12 mx-auto text-muted-foreground/20" />
              <p className="text-sm font-black uppercase italic tracking-tighter">No transactions match your search</p>
            </div>
          ) : (
            <div className="w-full">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/10 bg-foreground/5">
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value Context</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Block Height</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Transaction ID</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx, idx) => (
                      <tr key={idx} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                              {getActionIcon(tx.action)}
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-foreground">{tx.action}</span>
                          </div>
                        </td>
                        <td className="p-6 text-xs font-black text-foreground font-mono">{tx.amount}</td>
                        <td className="p-6 text-xs font-black text-muted-foreground font-mono">{tx.blockHeight || "Pending"}</td>
                        <td className="p-6 text-xs font-bold text-foreground font-mono">{tx.txId}</td>
                        <td className="p-6 text-xs font-bold text-muted-foreground font-mono">{tx.timestamp}</td>
                        <td className="p-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusClass(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <a 
                            href={tx.explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE LAYOUT CARDS LIST */}
              <div className="block md:hidden divide-y divide-foreground/5">
                {filteredTransactions.map((tx, idx) => (
                  <div key={idx} className="p-6 space-y-4 hover:bg-foreground/5 transition-all">
                    {/* Upper row: Action & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                          {getActionIcon(tx.action)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-foreground">{tx.action}</span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusClass(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>

                    {/* Middle details */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block font-bold uppercase tracking-wider">Value Context</span>
                        <span className="font-black text-foreground font-mono text-xs">{tx.amount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block font-bold uppercase tracking-wider">Timestamp</span>
                        <span className="font-bold text-foreground font-mono text-xs">{tx.timestamp}</span>
                      </div>
                    </div>

                    {/* Lower row */}
                    <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                      <div className="text-[10px]">
                        <span className="text-muted-foreground block font-bold uppercase tracking-wider">Tx ID & Block Height</span>
                        <span className="font-bold text-foreground font-mono">{tx.txId} · H:{tx.blockHeight || "Pending"}</span>
                      </div>
                      <a 
                        href={tx.explorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Explorer <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
