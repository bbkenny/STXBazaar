"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Lock,
  Key,
  Coins,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const slides = [
  {
    title: "Bitcoin-Native Vaults",
    description:
      "Welcome to STX Bazaar. Securely lock your assets in non-custodial vaults powered by Bitcoin finality on Stacks L2.",
    icon: <Lock className="w-12 h-12 text-orange-500" />,
    color: "from-orange-500/20 to-transparent",
  },
  {
    title: "Programmable Time-Locks",
    description:
      "Define when and how your capital is released. Support for fixed locks or gradual linear streaming schedules.",
    icon: <Key className="w-12 h-12 text-blue-500" />,
    color: "from-blue-500/20 to-transparent",
  },
  {
    title: "Yield Integration",
    description:
      "Don't let your capital sit idle. Route locked assets into DeFi strategies to generate passive returns during the lock period.",
    icon: <Coins className="w-12 h-12 text-green-500" />,
    color: "from-green-500/20 to-transparent",
  },
  {
    title: "Full Transparency",
    description:
      "Track your locked balance, unlock schedules, and generated yield in real-time through our premium bazaar dashboard.",
    icon: <BarChart3 className="w-12 h-12 text-purple-500" />,
    color: "from-purple-500/20 to-transparent",
  },
  {
    title: "Trustless Security",
    description:
      "All vault logic is enforced by immutable Clarity smart contracts. Your keys, your rules, always.",
    icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
    color: "from-emerald-500/20 to-transparent",
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("stxbazaar_tour_seen");
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("stxbazaar_tour_seen", "true");
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} transition-colors duration-700`}
        />

        <div className="relative p-8 flex flex-col items-center text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 p-5 bg-zinc-800/80 rounded-2xl border border-zinc-700 shadow-xl">
                {slides[currentSlide].icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between w-full mt-auto">
            <div className="flex gap-1.5">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-6 bg-orange-500"
                      : "w-1.5 bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all active:scale-95 group shadow-lg shadow-orange-900/20"
            >
              {currentSlide === slides.length - 1 ? "Enter Bazaar" : "Next"}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
