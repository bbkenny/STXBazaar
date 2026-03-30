import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./globals.css";

const poppins = Poppins({ variable: "--font-heading", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-body", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

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
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  other: {
    "talentapp:project_verification": "c2a90ba4f10f1648a21147b01e04a7c8165bd0b2a01367e0277e2117625d7a4d4e93c795541534079c2bdaef6cac609ce653b61d34039f1173a67ccd71c2adaf",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${spaceGrotesk.variable} antialiased min-h-screen bg-background text-foreground`}>
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
