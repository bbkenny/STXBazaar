"use client";

import { toast, Toaster as HotToaster, Toast } from "react-hot-toast";
import { CheckCircle2, AlertCircle, Info, Lock } from "lucide-react";

export const bazaarToast = {
  success: (message: string) =>
    toast.custom((t: Toast) => (
      <div
        className={`${
          t.visible
            ? "animate-in fade-in slide-in-from-right-full"
            : "animate-out fade-out slide-out-to-right-full"
        } max-w-md w-full bg-zinc-900 border-2 border-orange-500/30 shadow-2xl rounded-2xl pointer-events-auto flex overflow-hidden duration-300`}
      >
        <div className="flex-1 p-4 bg-gradient-to-r from-orange-500/5 to-transparent flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white uppercase tracking-wider">
              Vault Update
            </p>
            <p className="mt-1 text-sm text-zinc-400 font-medium">{message}</p>
          </div>
        </div>
      </div>
    )),
  error: (message: string) =>
    toast.custom((t: Toast) => (
      <div
        className={`${
          t.visible
            ? "animate-in fade-in slide-in-from-right-full"
            : "animate-out fade-out slide-out-to-right-full"
        } max-w-md w-full bg-zinc-900 border-2 border-red-500/30 shadow-2xl rounded-2xl pointer-events-auto flex overflow-hidden duration-300`}
      >
        <div className="flex-1 p-4 bg-gradient-to-r from-red-500/5 to-transparent flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white uppercase tracking-wider">
              Protocol Error
            </p>
            <p className="mt-1 text-sm text-zinc-400 font-medium">{message}</p>
          </div>
        </div>
      </div>
    )),
  lock: (amount: string, duration: string) =>
    toast.custom(
      (t: Toast) => (
        <div
          className={`${
            t.visible
              ? "animate-in fade-in zoom-in"
              : "animate-out fade-out zoom-out"
          } max-w-sm w-full bg-zinc-950 border border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.2)] rounded-3xl pointer-events-auto flex overflow-hidden duration-500`}
        >
          <div className="flex-1 p-6 bg-gradient-to-b from-orange-500/10 to-transparent flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-zinc-900 border border-orange-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-white uppercase italic tracking-tighter">
                Vault Secured
              </p>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                {amount} Locked for {duration}
              </p>
            </div>
          </div>
        </div>
      ),
      { duration: 5000 },
    ),
};

export const BazaarToaster = () => (
  <HotToaster
    position="top-right"
    toastOptions={{
      duration: 4000,
    }}
  />
);
