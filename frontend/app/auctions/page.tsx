"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Gavel, TrendingUp, Eye, Zap, Plus, Loader2, RefreshCw } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useAuctionHouse } from "@/lib/hooks/use-contract";
import { CONTRACTS } from "@/lib/constants/contracts";

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg mx-4 bg-card border border-border rounded-2xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg transition-colors">✕</button>
        {children}
      </div>
    </div>
  );
}

interface Auction {
  id: number;
  seller: string;
  title: string;
  description: string;
  startPrice: number;
  currentBid: number;
  currentBidder: string;
  endTime: number;
  status: number;
  bidCount: number;
  category: string;
}

const CATEGORIES = ["General", "Art", "Collectible", "Gaming", "Music", "Domain"];
const STX_TO_MICRO = 1_000_000;

export default function AuctionsPage() {
  const { isConnected, connect } = useStacks();
  const { createAuction, placeBid, getMarketplaceStats, getAuction, loading } = useAuctionHouse();

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [fetching, setFetching] = useState(true);
  const [bidAmounts, setBidAmounts] = useState<Record<number, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [stats, setStats] = useState({ totalAuctions: 0, totalVolume: 0, completed: 0 });
  const [form, setForm] = useState({ title: "", description: "", startingPrice: "", durationDays: "7", category: "General" });

  const fetchAuctions = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getMarketplaceStats();
      let totalAuctions = 0;
      let totalVolume = 0;
      let completed = 0;

      if (data?.value) {
        const v = data.value;
        totalAuctions = Number(v["total-auctions"]?.value ?? 0);
        totalVolume = Number(v["total-volume"]?.value ?? 0);
        completed = Number(v["auctions-completed"]?.value ?? 0);
      }

      setStats({ totalAuctions, totalVolume, completed });

      // Fetch last 9 auctions
      const list: Auction[] = [];
      for (let i = Math.max(0, totalAuctions - 9); i < totalAuctions; i++) {
        const a = await getAuction(i);
        if (a?.value?.value) {
          const v = a.value.value;
          list.push({
            id: i,
            seller: v.seller?.value ?? "",
            title: v.title?.value ?? `Auction #${i}`,
            description: v.description?.value ?? "",
            startPrice: Number(v["start-price"]?.value ?? 0),
            currentBid: Number(v["current-bid"]?.value ?? 0),
            currentBidder: v["current-bidder"]?.value ?? "",
            endTime: Number(v["end-time"]?.value ?? 0),
            status: Number(v.status?.value ?? 0),
            bidCount: Number(v["bid-count"]?.value ?? 0),
            category: v.category?.value ?? "general",
          });
        }
      }
      setAuctions(list.reverse());
    } catch (e) {
      console.error("Failed to fetch auctions:", e);
    } finally {
      setFetching(false);
    }
  }, [getMarketplaceStats, getAuction]);

  useEffect(() => { fetchAuctions(); }, [fetchAuctions]);

  const handleBid = async (auctionId: number) => {
    if (!isConnected) { connect(); return; }
    const stx = parseFloat(bidAmounts[auctionId] || "0");
    if (!stx || stx <= 0) return;
    await placeBid(auctionId, Math.floor(stx * STX_TO_MICRO), () => {
      setBidAmounts((prev) => ({ ...prev, [auctionId]: "" }));
      fetchAuctions();
    });
  };

  const handleCreate = async () => {
    if (!isConnected) { connect(); return; }
    const { title, description, startingPrice, durationDays, category } = form;
    if (!title || !description || !startingPrice) return;
    const durationBlocks = Math.floor(parseFloat(durationDays) * 144);
    await createAuction(title, description, Math.floor(parseFloat(startingPrice) * STX_TO_MICRO), durationBlocks, category.toLowerCase(), () => {
      setCreateOpen(false);
      setForm({ title: "", description: "", startingPrice: "", durationDays: "7", category: "General" });
      fetchAuctions();
    });
  };

  const statusLabel = (s: number) => s === 0 ? "ACTIVE" : s === 1 ? "ENDED" : s === 2 ? "CANCELLED" : "UNKNOWN";

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-primary uppercase tracking-widest">Global Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">Live <span className="text-primary italic">Auctions</span></h1>
            <p className="text-muted-foreground max-w-xl font-medium leading-relaxed">
              Real-time on-chain bidding with instant settlement. {stats.totalAuctions} active listings secured by Bitcoin finality.
            </p>
          </div>
          
          <div className="relative w-full lg:w-[320px] aspect-square flex-shrink-0">
             <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full" />
             <img src="/hero-luxe.png" alt="Auctions" className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(245,158,11,0.15)]" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Auctions", value: stats.totalAuctions, icon: <Zap className="w-4 h-4" /> },
            { label: "Total Volume", value: `${stats.totalVolume} uSTX`, icon: <TrendingUp className="w-4 h-4" /> },
            { label: "Completed", value: stats.completed, icon: <Eye className="w-4 h-4" /> },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 flex items-center gap-3">
              <span className="text-[var(--primary)]">{stat.icon}</span>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-lg font-bold text-[var(--foreground)]">{fetching ? "..." : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contract badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-mono text-[var(--muted-foreground)]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {CONTRACTS.AUCTION_HOUSE}
        </div>

        {/* Auction grid */}
        {fetching && auctions.length === 0 ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" /></div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted-foreground)]">
            <Gavel className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">No auctions yet</p>
            <p className="text-sm">Create the first auction to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction, idx) => (
              <motion.div key={auction.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--primary)]/40 transition-all group">
                <div className="h-32 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--companion)]/5 flex items-center justify-center">
                  <span className="text-4xl opacity-60">⬡</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{auction.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${auction.status === 0 ? "bg-green-500/20 text-green-400" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
                      {statusLabel(auction.status)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-4">{auction.category} · Seller: {auction.seller.slice(0, 12)}...</p>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-[var(--background)] rounded-lg p-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Current Bid</p>
                      <p className="text-sm font-bold text-[var(--primary)]">{(auction.currentBid / STX_TO_MICRO).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 6 })} STX</p>
                    </div>
                    <div className="bg-[var(--background)] rounded-lg p-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Bids</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">{auction.bidCount}</p>
                    </div>
                    <div className="bg-[var(--background)] rounded-lg p-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Start Price</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">{(auction.startPrice / STX_TO_MICRO).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 6 })} STX</p>
                    </div>
                  </div>
                  {auction.status === 0 && (
                    <div className="flex gap-2">
                      <input type="number" placeholder={`> ${(auction.currentBid / STX_TO_MICRO).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 6 })}`}
                        value={bidAmounts[auction.id] || ""}
                        onChange={(e) => setBidAmounts((prev) => ({ ...prev, [auction.id]: e.target.value }))}
                        className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]" />
                      <button onClick={() => handleBid(auction.id)} disabled={loading}
                        className="px-4 py-2 rounded-lg bg-[var(--companion)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5">
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gavel className="w-3.5 h-3.5" />} Bid
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground uppercase tracking-tight">Create Auction</h2>
          <p className="text-sm text-muted-foreground">List an asset for auction on the STXBazaar contract.</p>
        </div>
        <div className="space-y-4 mt-2">
          <input maxLength={64} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title"
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]" />
          <textarea maxLength={256} rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description"
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] resize-none focus:outline-none focus:border-[var(--companion)]" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min="0.000001" step="0.1" value={form.startingPrice} onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))} placeholder="Price (STX)"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]" />
            <input type="number" min="1" max="30" value={form.durationDays} onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))} placeholder="Days"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]" />
          </div>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handleCreate} disabled={loading || !form.title || !form.description || !form.startingPrice}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />} Submit to Chain
          </button>
        </div>
      </Modal>
    </main>
  );
}
