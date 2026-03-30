# STX Bazaar

![STX Bazaar Logo](frontend/public/logo.svg)

**Trustless marketplace on Bitcoin L2.** Live auctions, escrow deals, and on-chain asset registry — all secured by the Stacks blockchain.

---

[![npm](https://img.shields.io/badge/stacks-mainnet-brightgreen)](https://stacks.co)
[![Contracts](https://img.shields.io/badge/contracts-3%20live-blue)](#contracts)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)

---

## How It Works

STX Bazaar removes trust from peer-to-peer trading. Three smart contracts handle everything:

| Contract | What It Does |
|----------|-------------|
| **Auction House** | Create auctions, place bids, auto-refund outbid users |
| **Escrow** | Lock STX between buyer and seller, release on mutual confirmation |
| **Registry** | Register and verify on-chain asset ownership |

No admin keys. No custodial funds. The contracts are the arbiter.

---

## Quick Start

```bash
cd frontend
npm install
npm run dev --webpack
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Contracts

```
Deployer: SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D

Auction House → STXBazaar-auction-house
Escrow        → STXBazaar-escrow
Registry      → STXBazaar-registry
```

All contracts deployed on Stacks Mainnet at Clarity 4, Epoch 3.3.

---

## Auction House

**Create** an auction with title, description, starting price, duration, and category.

**Bid** on active auctions. Previous bidder is auto-refunded the moment they're outbid.

**End** an auction when the timer expires. Winner pays. Seller receives funds.

```typescript
import { useAuctionHouse } from "@/lib/hooks/use-contract";

const { createAuction, placeBid, endAuction } = useAuctionHouse();

// Create
await createAuction("Rare NFT", "Exclusive item", 1000000, 144, "art", callback);

// Bid
await placeBid(auctionId, 2000000, callback);
```

---

## Escrow

**Create** an escrow deal with a seller, amount, and timeout.

**Complete** when both parties confirm the deal is done.

**Dispute** if something goes wrong — nominate an arbitrator for resolution.

```typescript
import { useEscrow } from "@/lib/hooks/use-contract";

const { createEscrow, completeEscrow, raiseDispute } = useEscrow();

// Lock funds
await createEscrow(sellerAddress, 5000000, 500, "Escrow for domain", callback);

// Both parties confirm
await completeEscrow(escrowId, callback);
```

---

## Registry

**Register** an asset with a unique name, metadata, and category.

**Verify** ownership on-chain — immutable proof that can't be faked.

**Transfer** asset ownership to another address.

```typescript
import { useRegistry } from "@/lib/hooks/use-contract";

const { register, verifyAsset, transfer } = useRegistry();

// Register
await register("alice.btc", "Verified domain", 1, callback);

// Prove ownership
await verifyAsset("alice.btc", callback);
```

---

## Project Structure

```
STXBazaar/
│
├── frontend/
│   ├── app/
│   │   ├── auctions/       # Live auction listing + create + bid
│   │   ├── escrow/         # Escrow deals + dispute resolution
│   │   ├── registry/       # Asset registration + verification
│   │   └── page.tsx        # Landing page
│   └── lib/
│       ├── hooks/           # useAuctionHouse, useEscrow, useRegistry
│       └── constants/       # Contract addresses + network config
│
└── smartcontract/
    ├── auction-house.clar
    ├── escrow.clar
    └── registry.clar
```

---

## Fonts

| Usage | Font |
|-------|------|
| Headings | Poppins (Google Fonts) |
| Body text | Space Grotesk (Google Fonts) |

---

## Author

Built and maintained by **bbkenny**.

---

## License

MIT
