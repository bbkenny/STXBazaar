"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Plus, ArrowRight } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";

const DEALS = [
  {
    id: "ESC-001",
    title: "BTC Inscription #441920 Purchase",
    buyer: "SP2X...4K9Q",
    seller: "SP3M...8WRZ",
    amount: 920,
    status: "ACTIVE",
    created: "2025-03-10",
    deadline: "2025-04-10",
    description: "Ordinal NFT transfer secured via STX Bazaar escrow.",
  },
  {
    id: "ESC-002",
    title: "Nakamoto Edition Print Sale",
    buyer: "SP1L...2TFN",
    seller: "SP5R...9VKH",
    amount: 1840,
    status: "COMPLETED",
    created: "2025-02-14",
    deadline: "2025-03-14",
    description: "Digital art purchase — both parties confirmed delivery.",
  },
  {
    id: "ESC-003",
    title: "sBTC Early Adopter NFT",
    buyer: "SP4C...6QPL",
    seller: "SP7N...1BXA",
    amount: 4500,
    status: "DISPUTED",
    created: "2025-03-01",
    deadline: "2025-04-01",
    description: "Buyer claims non-delivery. Awaiting arbitration.",
  },
  {
    id: "ESC-004",
    title: "Stacks Genesis Badge",
    buyer: "SP9T...3MMK",
    seller: "SP2X...4K9Q",
    amount: 340,
    status: "ACTIVE",
    created: "2025-03-15",
    deadline: "2025-04-15",
    description: "Collectible badge escrow — waiting for seller confirmation.",
  },
  {
    id: "ESC-005",
    title: "Bitcoin Block 800K NFT",
    buyer: "SP6W...7PLB",
    seller: "SP3M...8WRZ",
    amount: 2200,
    status: "COMPLETED",
    created: "2025-01-22",
    deadline: "2025-02-22",
    description: "Historical NFT — deal closed successfully.",
  },
];

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; style: string }> = {
  ACTIVE: {
    label: "Active",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  DISPUTED: {
    label: "Disputed",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    style: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
};

export default function EscrowPage() {
  const { isConnected, connect } = useStacks();
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "ACTIVE", "COMPLETED", "DISPUTED"];
  const filtered =
    filter === "ALL" ? DEALS : DEALS.filter((d) => d.status === filter);

  const handleAction = () => {
    if (!isConnected) {
      connect();
      return;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--companion)]/10 border border-[var(--companion)]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[var(--companion)]" />
              </div>
              <span className="text-sm font-medium text-[var(--companion)]">
                Trustless Escrow
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
              Escrow Deals
            </h1>
            <p className="text-[var(--muted-foreground)]">
              On-chain escrow secured by Stacks smart contracts. No counterparty risk.
            </p>
          </div>

          <button
            onClick={handleAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="w-4 h-4" />
            New Escrow Deal
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Locked", value: "9.8K STX" },
            { label: "Active Deals", value: "2" },
            { label: "Completed", value: "2" },
            { label: "Disputed", value: "1" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
            >
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{s.label}</p>
              <p className="text-xl font-bold text-[var(--foreground)]">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--primary)]/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Deals list */}
        <div className="flex flex-col gap-4">
          {filtered.map((deal, idx) => {
            const meta = STATUS_META[deal.status];
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        {deal.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.style}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      {deal.description}
                    </p>
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
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {deal.amount.toLocaleString()} STX
                      </p>
                    </div>

                    {deal.status === "ACTIVE" && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleAction}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--companion)]/40 transition-colors"
                        >
                          Dispute
                        </button>
                        <button
                          onClick={handleAction}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--companion)] text-white hover:opacity-90 transition-opacity"
                        >
                          Release <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {deal.status === "DISPUTED" && (
                      <button
                        onClick={handleAction}
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
    </main>
  );
}
