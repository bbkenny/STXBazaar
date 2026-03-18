"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gavel, Clock, TrendingUp, Eye, Zap, Filter, Plus, Loader2 } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useAuctionHouse } from "@/lib/hooks/use-contract";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { CONTRACTS } from "@/lib/constants/contracts";

const SAMPLE_AUCTIONS = [
  { id: 1, name: "BTC Inscription #441920", type: "Ordinal", currentBid: 920, bids: 14, endsIn: "2h 14m", status: "LIVE", image: "⬡", rarity: "RARE", seller: "SP2X...4K9Q" },
  { id: 2, name: "Nakamoto Edition Print", type: "Digital Art", currentBid: 1840, bids: 31, endsIn: "5h 42m", status: "LIVE", image: "◈", rarity: "EPIC", seller: "SP3M...8WRZ" },
  { id: 3, name: "Stacks Genesis Badge", type: "Collectible", currentBid: 340, bids: 9, endsIn: "12h 08m", status: "LIVE", image: "⬟", rarity: "UNCOMMON", seller: "SP1L...2TFN" },
  { id: 4, name: "sBTC Early Adopter NFT", type: "Membership", currentBid: 4500, bids: 52, endsIn: "48m", status: "ENDING", image: "◆", rarity: "LEGENDARY", seller: "SP5R...9VKH" },
  { id: 5, name: "Bitcoin Block 800K", type: "Historical", currentBid: 2200, bids: 27, endsIn: "1d 3h", status: "LIVE", image: "⬢", rarity: "EPIC", seller: "SP4C...6QPL" },
  { id: 6, name: "Clarity Smart Badge", type: "Developer", currentBid: 120, bids: 4, endsIn: "3d 12h", status: "UPCOMING", image: "◇", rarity: "COMMON", seller: "SP7N...1BXA" },
];

const RARITY_COLORS: Record<string, string> = {
  LEGENDARY: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  EPIC: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  RARE: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  UNCOMMON: "text-green-400 bg-green-400/10 border-green-400/20",
  COMMON: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const STATUS_STYLES: Record<string, string> = {
  LIVE: "bg-green-500/20 text-green-400 border border-green-500/30",
  ENDING: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  UPCOMING: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const CATEGORIES = ["General", "Art", "Collectible", "Gaming", "Music", "Domain"];

const STX_TO_MICRO = 1_000_000;

export default function AuctionsPage() {
  const { isConnected, connect } = useStacks();
  const { createAuction, placeBid, getMarketplaceStats, loading } = useAuctionHouse();

  const [filter, setFilter] = useState("ALL");
  const [bidAmounts, setBidAmounts] = useState<Record<number, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [stats, setStats] = useState({ total_auctions: "—", total_volume: "—", auctions_completed: "—" });

  // Create auction form state
  const [form, setForm] = useState({ title: "", description: "", startingPrice: "", durationDays: "7", category: "General" });

  const filters = ["ALL", "LIVE", "ENDING", "UPCOMING"];
  const filtered = filter === "ALL" ? SAMPLE_AUCTIONS : SAMPLE_AUCTIONS.filter((a) => a.status === filter);

  useEffect(() => {
    getMarketplaceStats().then((data) => {
      if (!data) return;
      const v = data.value ?? data;
      setStats({
        total_auctions: String(v?.["total-auctions"]?.value ?? "0"),
        total_volume: v?.["total-volume"]?.value ? `${(Number(v["total-volume"].value) / STX_TO_MICRO).toLocaleString()} STX` : "0 STX",
        auctions_completed: String(v?.["auctions-completed"]?.value ?? "0"),
      });
    });
  }, [getMarketplaceStats]);

  const handleBid = async (auctionId: number) => {
    if (!isConnected) { connect(); return; }
    const stx = parseFloat(bidAmounts[auctionId] || "0");
    if (!stx || stx <= 0) return;
    await placeBid(auctionId, Math.floor(stx * STX_TO_MICRO), (data) => {
      console.log("Bid tx:", data.txId);
      setBidAmounts((prev) => ({ ...prev, [auctionId]: "" }));
    });
  };

  const handleCreate = async () => {
    if (!isConnected) { connect(); return; }
    const { title, description, startingPrice, durationDays, category } = form;
    if (!title || !description || !startingPrice) return;
    const durationBlocks = Math.floor(parseFloat(durationDays) * 144);
    await createAuction(
      title,
      description,
      Math.floor(parseFloat(startingPrice) * STX_TO_MICRO),
      durationBlocks,
      category.toLowerCase(),
      (data) => {
        console.log("Auction created tx:", data.txId);
        setCreateOpen(false);
        setForm({ title: "", description: "", startingPrice: "", durationDays: "7", category: "General" });
      }
    );
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--primary)]">Live Marketplace</span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Active Auctions</h1>
              <p className="text-[var(--muted-foreground)]">Bid on rare digital assets secured by Bitcoin-grade finality.</p>
            </div>
            <button
              onClick={() => isConnected ? setCreateOpen(true) : connect()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Create Auction
            </button>
          </div>
        </motion.div>

        {/* Contract address badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-mono text-[var(--muted-foreground)]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {CONTRACTS.AUCTION_HOUSE}
        </div>

        {/* On-chain Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Auctions", value: stats.total_auctions, icon: <Zap className="w-4 h-4" /> },
            { label: "Total Volume", value: stats.total_volume, icon: <TrendingUp className="w-4 h-4" /> },
            { label: "Completed", value: stats.auctions_completed, icon: <Eye className="w-4 h-4" /> },
            { label: "Sample Cards", value: String(SAMPLE_AUCTIONS.length), icon: <Gavel className="w-4 h-4" /> },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 flex items-center gap-3">
              <span className="text-[var(--primary)]">{stat.icon}</span>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Auction grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((auction, idx) => (
            <motion.div key={auction.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07, duration: 0.4 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--companion)]/40 transition-all group">
              <div className="h-40 bg-gradient-to-br from-[var(--companion)]/10 to-[var(--primary)]/10 flex items-center justify-center relative">
                <span className="text-7xl opacity-60 group-hover:opacity-90 transition-opacity">{auction.image}</span>
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[auction.status]}`}>
                    {auction.status === "LIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
                    {auction.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${RARITY_COLORS[auction.rarity]}`}>{auction.rarity}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">{auction.name}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">{auction.type} · Seller: {auction.seller}</p>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-[var(--background)] rounded-lg p-2">
                    <p className="text-xs text-[var(--muted-foreground)]">Current Bid</p>
                    <p className="text-sm font-bold text-[var(--primary)]">{auction.currentBid} STX</p>
                  </div>
                  <div className="bg-[var(--background)] rounded-lg p-2">
                    <p className="text-xs text-[var(--muted-foreground)]">Bids</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{auction.bids}</p>
                  </div>
                  <div className="bg-[var(--background)] rounded-lg p-2">
                    <p className="text-xs text-[var(--muted-foreground)]">Ends In</p>
                    <p className={`text-sm font-bold ${auction.status === "ENDING" ? "text-orange-400" : "text-[var(--foreground)]"}`}>{auction.endsIn}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={`> ${auction.currentBid}`}
                    value={bidAmounts[auction.id] || ""}
                    onChange={(e) => setBidAmounts((prev) => ({ ...prev, [auction.id]: e.target.value }))}
                    className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]"
                  />
                  <button
                    onClick={() => handleBid(auction.id)}
                    disabled={auction.status === "UPCOMING" || loading}
                    className="px-4 py-2 rounded-lg bg-[var(--companion)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gavel className="w-3.5 h-3.5" />}
                    Bid
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-xs text-[var(--muted-foreground)] mt-10">
          <Clock className="w-3.5 h-3.5 inline mr-1" />
          Auction times are approximate and settle on Stacks block finality. ~144 blocks/day.
        </motion.p>
      </div>

      {/* Create Auction Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle>Create Auction</DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              List an asset for auction on the STXBazaar smart contract.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Title (max 64 chars)</label>
              <input
                maxLength={64}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. BTC Inscription #441920"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Description (max 256 chars)</label>
              <textarea
                maxLength={256}
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what's being auctioned..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Starting Price (STX)</label>
                <input
                  type="number"
                  min="0.000001"
                  step="0.1"
                  value={form.startingPrice}
                  onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))}
                  placeholder="1.0"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={form.durationDays}
                  onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !form.title || !form.description || !form.startingPrice}
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
              Submit to Chain
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
