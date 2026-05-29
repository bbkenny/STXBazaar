import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none gold-mesh" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4 md:space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-primary/10 border border-primary/20 overflow-hidden">
                <img src="/stxbazaar-logo.png" alt="STX Bazaar" className="w-7 h-7" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">STX<span className="text-primary italic">BAZAAR</span></span>
            </Link>
            <p className="hidden md:block text-sm text-muted-foreground max-w-xs leading-relaxed font-medium">
              Bitcoin-native vault protocol on Stacks L2. Lock assets under programmable Clarity rules, allocate to audited strategies, and earn yield securely.
            </p>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-stone-800" />)}
              </div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Trusted by 10k+ Bitcoiners</span>
            </div>
          </div>
          <div className="hidden md:block">
            <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.2em] text-primary">Protocol</h4>
            <ul className="space-y-4">
              {[["Home", "/"], ["Vaults", "/vaults"], ["Yield Strategies", "/yield"], ["Transaction History", "/history"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
            <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.2em] text-primary">Ecosystem</h4>
            <ul className="space-y-4">
              {[["Stacks Network", "https://stacks.co"], ["Hiro Wallet", "https://wallet.hiro.so"], ["Bitcoin L2", "https://bitcoin.org"]].map(([label, href]) => (
                <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 md:mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] text-center">© 2026 STX BAZAAR PROTOCOL. SECURED BY BITCOIN.</p>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Network Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
