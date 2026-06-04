"use client";

import { useStacks } from "@/lib/hooks/use-stacks";
import { PLATFORM_CONFIG, CONTRACTS } from "@/lib/constants/contracts";
import { ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isConnected, stxAddress } = useStacks();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isConnected) {
      setIsAuthorized(false);
      return;
    }
    
    if (stxAddress === PLATFORM_CONFIG.deployer) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      setTimeout(() => router.push("/"), 2000);
    }
  }, [isConnected, stxAddress, router]);

  if (isAuthorized === null) return null;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center border border-red-500/20">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black uppercase text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground text-sm font-medium">
            This area is restricted to the protocol deployer address only. Redirecting you to the dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground italic">
              Protocol Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
              Deployer Access Verified
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-border">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Administrative Actions
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Protocol management functions will be active here in the upcoming release. Manage yield strategies, update protocol administrators, and modify supported tokens.
            </p>
            <div className="space-y-4">
              <button disabled className="w-full py-4 rounded-xl bg-secondary/20 text-muted-foreground text-xs font-black uppercase tracking-widest cursor-not-allowed border border-border/50">
                Update Active Strategies
              </button>
              <button disabled className="w-full py-4 rounded-xl bg-secondary/20 text-muted-foreground text-xs font-black uppercase tracking-widest cursor-not-allowed border border-border/50">
                Set Protocol Admin
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-border">
            <h2 className="text-xl font-black uppercase mb-6 text-foreground">Protocol Addresses</h2>
            <div className="space-y-4 font-mono text-[10px] sm:text-xs text-muted-foreground break-all">
              <div className="p-4 rounded-xl bg-secondary/10 border border-border/50">
                <p className="font-bold text-primary mb-1 uppercase font-sans tracking-wider">Vaults Contract</p>
                <p>{CONTRACTS.VAULT}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10 border border-border/50">
                <p className="font-bold text-primary mb-1 uppercase font-sans tracking-wider">Lock Engine</p>
                <p>{CONTRACTS.LOCK_ENGINE}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10 border border-border/50">
                <p className="font-bold text-primary mb-1 uppercase font-sans tracking-wider">Yield Adapter</p>
                <p>{CONTRACTS.YIELD_ADAPTER}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
