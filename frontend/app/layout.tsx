import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "STX Bazaar — Trustless Auctions & Escrow on Bitcoin L2",
    template: "%s | STX Bazaar",
  },
  description:
    "Lightning-fast trustless marketplace on Stacks L2. Run live auctions, create secure escrow deals, and register on-chain assets — all backed by Bitcoin finality.",
  keywords: ["Stacks", "Bitcoin", "auction", "escrow", "marketplace", "trustless", "blockchain", "L2", "DeFi"],
  authors: [{ name: "STX Bazaar Protocol" }],
  creator: "STX Bazaar",
  openGraph: {
    title: "STX Bazaar — Trustless Auctions & Escrow",
    description: "Lightning-speed trustless marketplace. Bid, sell, and settle on Bitcoin via Stacks L2.",
    type: "website",
    siteName: "STX Bazaar",
    images: [{ url: "/logo.svg", width: 64, height: 64, alt: "STX Bazaar Lightning Logo" }],
  },
  twitter: {
    card: "summary",
    title: "STX Bazaar — Trustless Marketplace on Bitcoin L2",
    description: "Live auctions, escrow deals, asset registry. Secured by Bitcoin. Built on Stacks.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
    shortcut: "/favicon.svg",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
