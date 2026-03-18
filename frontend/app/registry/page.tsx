"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, CheckCircle2, Clock, Plus, ExternalLink, Tag } from "lucide-react";
import { useStacks } from "@/lib/hooks/use-stacks";

const ASSETS = [
  {
    id: "REG-001",
    name: "BTC Inscription #441920",
    type: "Ordinal",
    owner: "SP2X...4K9Q",
    status: "VERIFIED",
    registered: "2025-02-15",
    metadataHash: "0x3f8a...d20c",
    tags: ["ordinal", "bitcoin", "rare"],
  },
  {
    id: "REG-002",
    name: "Nakamoto Edition Print",
    type: "Digital Art",
    owner: "SP3M...8WRZ",
    status: "VERIFIED",
    registered: "2025-01-28",
    metadataHash: "0x91bc...44ef",
    tags: ["art", "nakamoto", "limited"],
  },
  {
    id: "REG-003",
    name: "Stacks Genesis Badge",
    type: "Collectible",
    owner: "SP1L...2TFN",
    status: "PENDING",
    registered: "2025-03-12",
    metadataHash: "0x77dd...bb3a",
    tags: ["badge", "genesis", "collectible"],
  },
  {
    id: "REG-004",
    name: "sBTC Early Adopter NFT",
    type: "Membership",
    owner: "SP5R...9VKH",
    status: "VERIFIED",
    registered: "2025-02-01",
    metadataHash: "0xc5e1...0871",
    tags: ["sbtc", "membership", "early-adopter"],
  },
  {
    id: "REG-005",
    name: "Bitcoin Block 800K",
    type: "Historical",
    owner: "SP4C...6QPL",
    status: "PENDING",
    registered: "2025-03-16",
    metadataHash: "0x20f9...7c4b",
    tags: ["historical", "block", "bitcoin"],
  },
  {
    id: "REG-006",
    name: "Clarity Smart Badge",
    type: "Developer",
    owner: "SP7N...1BXA",
    status: "VERIFIED",
    registered: "2025-01-05",
    metadataHash: "0xab34...f192",
    tags: ["developer", "clarity", "badge"],
  },
];

const STATUS_META: Record<string, { icon: React.ReactNode; style: string }> = {
  VERIFIED: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  PENDING: {
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  },
};

export default function RegistryPage() {
  const { isConnected, connect } = useStacks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "VERIFIED", "PENDING"];
  const filtered = ASSETS.filter((a) => {
    const matchesFilter = filter === "ALL" || a.status === filter;
    const matchesSearch =
      search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleRegister = () => {
    if (!isConnected) {
      connect();
      return;
    }
    alert("Asset registration flow coming soon.");
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
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--primary)]">
                On-Chain Registry
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
              Asset Registry
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Every asset verifiably registered and ownership-tracked on Stacks.
            </p>
          </div>

          <button
            onClick={handleRegister}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity w-fit"
          >
            <Plus className="w-4 h-4" />
            Register Asset
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
            { label: "Total Assets", value: "6" },
            { label: "Verified", value: "4" },
            { label: "Pending Review", value: "2" },
            { label: "Unique Owners", value: "6" },
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

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by name, type, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--companion)]"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--primary)]/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Asset grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((asset, idx) => {
            const meta = STATUS_META[asset.status];
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--companion)]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        {asset.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.style}`}
                      >
                        {meta.icon}
                        {asset.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] text-base">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {asset.type}
                    </p>
                  </div>
                  <button className="text-[var(--muted-foreground)] hover:text-[var(--companion)] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Owner</span>
                    <span className="font-mono text-[var(--foreground)]">{asset.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Registered</span>
                    <span className="text-[var(--foreground)]">{asset.registered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Metadata Hash</span>
                    <span className="font-mono text-[var(--foreground)]">{asset.metadataHash}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted-foreground)]">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No assets match your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
