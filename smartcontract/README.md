# Smart Contracts — STX Bazaar

This directory contains the Clarity 4 smart contracts for STX Bazaar, a barrier-free marketplace on Bitcoin L2.

## Contracts

### auction-house.clar
A fully open auction system. Any wallet can create auctions, place bids, end auctions, and withdraw proceeds.

**Data structures:**
- `auctions` — Full auction config with bid tracking and category
- `bid-history` — Per-bidder bid amount per auction
- `bidder-stats` — Global bidder career stats (bids, spent, wins)
- `seller-stats` — Global seller career stats (auctions, revenue)

**Write functions (all barrier-free):**
- `create-auction(title, description, starting-price, duration-blocks, category)` — List an item
- `place-bid(auction-id, bid-amount)` — Bid with auto-refund to previous bidder
- `end-auction(auction-id)` — Close auction after end block
- `withdraw-funds(auction-id)` — Seller withdraws winning bid
- `cancel-auction(auction-id)` — Cancel auction (only before first bid)

**Read functions:**
- `get-auction`, `get-bid-for`, `get-bidder-stats-info`, `get-seller-stats-info`
- `get-marketplace-stats` — Global marketplace statistics
- `get-auction-summary` — Clarity 4 `to-ascii?` human-readable auction info

---

### escrow.clar
A trustless P2P escrow system with community arbitration and deadline-based auto-refund.

**Data structures:**
- `escrows` — Full escrow config with dispute tracking and arbitrator
- `arbitrator-stats` — Arbitrator reputation (cases, outcomes)
- `user-escrow-count` — Per-user escrow history count

**Write functions (all barrier-free):**
- `create-escrow(seller, amount, duration-blocks, description)` — Lock STX for a P2P deal
- `complete-escrow(escrow-id)` — Buyer confirms, releases funds to seller
- `raise-dispute(escrow-id, reason)` — Either party raises a dispute
- `nominate-arbitrator(escrow-id, arbitrator)` — Either party nominates a neutral arbitrator
- `resolve-dispute(escrow-id, buyer-wins)` — Arbitrator resolves the dispute
- `claim-expired-refund(escrow-id)` — Buyer reclaims after deadline expires

**Read functions:**
- `get-escrow`, `get-arbitrator-stats-info`, `get-user-escrow-count`
- `get-escrow-platform-stats` — Global escrow statistics
- `get-escrow-summary` — Clarity 4 `to-ascii?` human-readable escrow info

---

### registry.clar
An on-chain name and identity registry with community verification.

**Data structures:**
- `registry` — Registration with owner, metadata, category, status, verification count
- `principal-to-name` — Reverse lookup (principal -> name)
- `verification-records` — Dedup tracker (prevents double-verify by same wallet)
- `wallet-name-count` — Per-wallet name ownership count

**Write functions (all barrier-free):**
- `register(name, metadata, category)` — Claim a unique name (free)
- `update-metadata(name, new-metadata)` — Update description (owner only)
- `update-category(name, new-category)` — Change category (owner only)
- `transfer(name, new-owner)` — Transfer ownership (owner only)
- `verify(name)` — Community verification (auto-verifies at 3 independent verifications)

**Categories:** General, Store, Artist, Service, DAO, Project

**Read functions:**
- `get-registration`, `get-name-by-principal`, `is-name-available`, `has-verified`
- `get-registry-stats` — Global registry statistics
- `get-registration-summary` — Clarity 4 `to-ascii?` human-readable registration info

## Testing

```bash
npm install
npm run test
clarinet check
```

## Deployment

See root [README](../README.md) for deployment instructions.

---

**Clarity 4 | Nakamoto | Epoch 3.3**
