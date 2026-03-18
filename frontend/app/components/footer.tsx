import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.svg" alt="STX Bazaar" width={28} height={28} />
              <span className="text-lg font-black tracking-tight">STX<span className="text-primary"> Bazaar</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Lightning-speed trustless marketplace on Stacks L2. Bid, sell, and settle on Bitcoin with zero counterparty risk.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-companion animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">Live on Mainnet</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-foreground">Marketplace</h4>
            <ul className="space-y-2">
              {[["Auctions", "/auctions"], ["Escrow", "/escrow"], ["Registry", "/registry"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-2">
              {[["Stacks Network", "https://stacks.co"], ["Hiro Wallet", "https://wallet.hiro.so"], ["Bitcoin", "https://bitcoin.org"]].map(([label, href]) => (
                <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 STX Bazaar Protocol. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Zero counterparty risk · Bitcoin Finality</p>
        </div>
      </div>
    </footer>
  );
}
