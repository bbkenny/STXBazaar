"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Plus, ArrowRight, Loader2 } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";
import { useEscrow } from "@/lib/hooks/use-contract";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { CONTRACTS } from "@/lib/constants/contracts";

const SAMPLE_DEALS = [
  { id: 1, escrowId: 1, title: "BTC Inscription #441920 Purchase", buyer: "SP2X...4K9Q", seller: "SP3M...8WRZ", amount: 920, status: "ACTIVE", created: "2025-03-10", deadline: "2025-04-10", description: "Ordinal NFT transfer secured via STX Bazaar escrow." },
  { id: 2, escrowId: 2, title: "Nakamoto Edition Print Sale", buyer: "SP1L...2TFN", seller: "SP5R...9VKH", amount: 1840, status: "COMPLETED", created: "2025-02-14", deadline: "2025-03-14", description: "Digital art purchase — both parties confirmed delivery." },
  { id: 3, escrowId: 3, title: "sBTC Early Adopter NFT", buyer: "SP4C...6QPL", seller: "SP7N...1BXA", amount: 4500, status: "DISPUTED", created: "2025-03-01", deadline: "2025-04-01", description: "Buyer claims non-delivery. Awaiting arbitration." },
  { id: 4, escrowId: 4, title: "Stacks Genesis Badge", buyer: "SP9T...3MMK", seller: "SP2X...4K9Q", amount: 340, status: "ACTIVE", created: "2025-03-15", deadline: "2025-04-15", description: "Collectible badge escrow — waiting for seller confirmation." },
  { id: 5, escrowId: 5, title: "Bitcoin Block 800K NFT", buyer: "SP6W...7PLB", seller: "SP3M...8WRZ", amount: 2200, status: "COMPLETED", created: "2025-01-22", deadline: "2025-02-22", description: "Historical NFT — deal closed successfully." },
];

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; style: string }> = {
  ACTIVE: { label: "Active", icon: <Clock className="w-3.5 h-3.5" />, style: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  COMPLETED: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, style: "bg-green-500/10 text-green-400 border border-green-500/20" },
  DISPUTED: { label: "Disputed", icon: <AlertTriangle className="w-3.5 h-3.5" />, style: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

const STX_TO_MICRO = 1_000_000;

export default function EscrowPage() {
  const { isConnected, connect } = useStacks();
  const { createEscrow, completeEscrow, raiseDispute, getPlatformStats, loading } = useEscrow();

  const [filter, setFilter] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [activeEscrowId, setActiveEscrowId] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [stats, setStats] = useState({ total_escrows: "—", total_completed: "—", total_disputes: "—", total_volume: "—" });

  const [form, setForm] = useState({ seller: "", amount: "", durationDays: "30", description: "" });

  const filters = ["ALL", "ACTIVE", "COMPLETED", "DISPUTED"];
  const filtered = filter === "ALL" ? SAMPLE_DEALS : SAMPLE_DEALS.filter((d) => d.status === filter);

  useEffect(() => {
    getPlatformStats().then((data) => {
      if (!data) return;
      const v = data.value ?? data;
      setStats({
        total_escrows: String(v?.["total-escrows"]?.value ?? "0"),
        total_completed: String(v?.["total-completed"]?.value ?? "0"),
        total_disputes: String(v?.["total-disputes"]?.value ?? "0"),
        total_volume: v?.["total-volume"]?.value ? `${(Number(v["total-volume"].value) / STX_TO_MICRO).toLocaleString()} STX` : "0 STX",
      });
    });
  }, [getPlatformStats]);

  const handleCreate = async () => {
    if (!isConnected) { connect(); return; }
    const { seller, amount, durationDays, description } = form;
    if (!seller || !amount || !description) return;
    await createEscrow(
      seller,
      Math.floor(parseFloat(amount) * STX_TO_MICRO),
      Math.floor(parseFloat(durationDays) * 144),
      description,
      (data) => {
        console.log("Escrow created tx:", data.txId);
        setCreateOpen(false);
        setForm({ seller: "", amount: "", durationDays: "30", description: "" });
      }
    );
  };

  const handleRelease = async (escrowId: number) => {
    if (!isConnected) { connect(); return; }
    await completeEscrow(escrowId, (data) => {
      console.log("Escrow completed tx:", data.txId);
    });
  };

  const handleDispute = async () => {
    if (!isConnected || activeEscrowId === null) return;
    if (!disputeReason.trim()) return;
    await raiseDispute(activeEscrowId, disputeReason, (data) => {
      console.log("Dispute raised tx:", data.txId);
      setDisputeOpen(false);
      setDisputeReason("");
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--companion)]/10 border border-[var(--companion)]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[var(--companion)]" />
              </div>
              <span className="text-sm font-medium text-[var(--companion)]">Trustless Escrow</span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Escrow Deals</h1>
            <p className="text-[var(--muted-foreground)]">On-chain escrow secured by Stacks smart contracts. No counterparty risk.</p>
          </div>
          <button
            onClick={() => isConnected ? setCreateOpen(true) : connect()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="w-4 h-4" /> New Escrow Deal
          </button>
        </motion.div>

        {/* Contract address badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-mono text-[var(--muted-foreground)]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {CONTRACTS.ESCROW}
        </div>

        {/* On-chain Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Locked", value: stats.total_volume },
            { label: "Active Deals", value: stats.total_escrows },
            { label: "Completed", value: stats.total_completed },
            { label: "Disputed", value: stats.total_disputes },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{s.label}</p>
              <p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Deals list */}
        <div className="flex flex-col gap-4">
          {filtered.map((deal, idx) => {
            const meta = STATUS_META[deal.status];
            return (
              <motion.div key={deal.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07, duration: 0.4 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">ESC-{String(deal.escrowId).padStart(3, "0")}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.style}`}>
                        {meta.icon}{meta.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">{deal.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">{deal.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
                      <span>Buyer: <span className="font-mono text-[var(--foreground)]">{deal.buyer}</span></span>
                      <span>Seller: <span className="font-mono text-[var(--foreground)]">{deal.seller}</span></span>
                      <span>Created: {deal.created}</span>
                      <span>Deadline: {deal.deadline}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-[var(--muted-foreground)]">Locked Amount</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">{deal.amount.toLocaleString()} STX</p>
                    </div>
                    {deal.status === "ACTIVE" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setActiveEscrowId(deal.escrowId); setDisputeOpen(true); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:border-red-500/40 hover:text-red-400 transition-colors"
                        >
                          Dispute
                        </button>
                        <button
                          onClick={() => handleRelease(deal.escrowId)}
                          disabled={loading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--companion)] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                          Release
                        </button>
                      </div>
                    )}
                    {deal.status === "DISPUTED" && (
                      <button
                        onClick={() => { setActiveEscrowId(deal.escrowId); setDisputeOpen(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        View Dispute
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Escrow Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle>New Escrow Deal</DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              Lock STX in the STXBazaar escrow contract until both parties confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Seller STX Address</label>
              <input
                value={form.seller}
                onChange={(e) => setForm((p) => ({ ...p, seller: e.target.value }))}
                placeholder="SP3..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)] font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Amount (STX)</label>
                <input
                  type="number"
                  min="0.000001"
                  step="0.1"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="100"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={form.durationDays}
                  onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--companion)]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Description (max 256 chars)</label>
              <textarea
                maxLength={256}
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What is this escrow deal for?"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)] resize-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !form.seller || !form.amount || !form.description}
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Lock Funds On-Chain
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
          <DialogHeader>
            <DialogTitle>Raise Dispute</DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              Escrow #{activeEscrowId} — describe the issue. An arbitrator will be nominated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Reason (max 256 chars)</label>
              <textarea
                maxLength={256}
                rows={4}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe what went wrong..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-red-500/40 resize-none"
              />
            </div>
            <button
              onClick={handleDispute}
              disabled={loading || !disputeReason.trim()}
              className="w-full py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
              Submit Dispute On-Chain
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
