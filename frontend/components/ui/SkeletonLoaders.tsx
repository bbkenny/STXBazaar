"use client";

import { motion } from "framer-motion";

const Shimmer = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{
      repeat: Infinity,
      duration: 2,
      ease: "linear",
    }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"
  />
);

export const VaultCardSkeleton = () => (
  <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6">
    <div className="flex justify-between items-start">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 bg-zinc-800 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800/50 rounded" />
        </div>
      </div>
      <div className="h-6 w-16 bg-zinc-800 rounded-full" />
    </div>

    <div className="space-y-4">
      <div className="h-10 w-full bg-zinc-800/40 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 bg-zinc-800/30 rounded-xl" />
        <div className="h-12 bg-zinc-800/30 rounded-xl" />
      </div>
    </div>

    <div className="h-12 w-full bg-zinc-800 rounded-2xl" />
    <Shimmer />
  </div>
);

export const BazaarStatsSkeleton = () => (
  <div className="relative overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl space-y-2"
      >
        <div className="h-3 w-24 bg-zinc-800/60 rounded" />
        <div className="h-8 w-32 bg-zinc-800 rounded-lg" />
        <Shimmer />
      </div>
    ))}
  </div>
);

export const UnlockScheduleSkeleton = () => (
  <div className="space-y-4 w-full">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="relative overflow-hidden bg-zinc-900/30 border border-zinc-800/40 p-4 rounded-2xl flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-zinc-800 rounded" />
            <div className="h-2 w-16 bg-zinc-800/50 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-zinc-800/60 rounded-lg" />
        <Shimmer />
      </div>
    ))}
  </div>
);
