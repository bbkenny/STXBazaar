# STX Bazaar

**Trustless Auction & Escrow Marketplace on Stacks L2**

STX Bazaar is a fully barrier-free marketplace built on Bitcoin via the Stacks blockchain. List anything for auction, settle deals through escrow, and build your seller identity — all without admin gates, gatekeepers, or minimum financial requirements.

Any wallet can interact with every core function. No whitelists. No approvals. Just connect and trade.

## How It Works

### Auction House
Create auctions with any starting price (even 1 microSTX). Bidders compete openly, and each new bid auto-refunds the previous bidder. After the auction ends, anyone can trigger the close, and the seller withdraws the winning bid.

**Open functions:** `create-auction`, `place-bid`, `end-auction`, `withdraw-funds`, `cancel-auction`

### Escrow
Lock STX in a trustless escrow for P2P deals. The buyer creates the escrow, and the seller delivers. If there's a dispute, either party can raise it and nominate a community arbitrator. Expired escrows auto-refund the buyer.

**Open functions:** `create-escrow`, `complete-escrow`, `raise-dispute`, `nominate-arbitrator`, `resolve-dispute`, `claim-expired-refund`

### Registry
Claim a unique name on-chain as your seller/store identity. Update metadata, transfer ownership, and earn community verifications. Names auto-verify after 3 independent verifications from different wallets.

**Open functions:** `register`, `update-metadata`, `update-category`, `transfer`, `verify`

## Barrier-Free Design

Every write function in STX Bazaar is callable by any external wallet:

| Contract | Open Write Functions | Total |
|---|---|---|
| `auction-house.clar` | `create-auction`, `place-bid`, `end-auction`, `withdraw-funds`, `cancel-auction` | 5 |
| `escrow.clar` | `create-escrow`, `complete-escrow`, `raise-dispute`, `nominate-arbitrator`, `resolve-dispute`, `claim-expired-refund` | 6 |
| `registry.clar` | `register`, `update-metadata`, `update-category`, `transfer`, `verify` | 5 |
| **Total** | | **16** |

## No Minimums

All STX-facing functions accept amounts from `u1` (0.000001 STX). There are no floor limits on:
- Auction starting prices
- Bid amounts
- Escrow values

## Technical Stack

- **Clarity 4** — Latest smart contract language for Stacks
- **Nakamoto / Epoch 3.3** — Full Nakamoto upgrade compatibility
- **Clarinet** — Development and testing framework
- **Next.js** — Frontend dashboard

## Quick Start

```bash
cd smartcontract
clarinet check
clarinet console
```

## Project Structure

```
StacksFlash/
  smartcontract/
    contracts/
      auction-house.clar    # Public auctions with auto-refunds
      escrow.clar            # P2P escrow with arbitration
      registry.clar          # Name/identity registry
    Clarinet.toml
    settings/
  frontend/
    # Next.js dashboard
```

## Deployment

### Testnet
```bash
cd smartcontract
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Mainnet
```bash
cd smartcontract
clarinet deployments generate --mainnet --medium-cost
clarinet deployment apply -p deployments/default.mainnet-plan.yaml
```

## Clarity 4 Features Used

- `to-ascii?` — Human-readable on-chain summaries for auctions, escrows, and registrations
- `stacks-block-height` — Block-based timing for auctions and escrow deadlines
- `as-contract` — Proper contract-as-principal pattern for STX custody and auto-refunds

---

**Built for trustless commerce on Bitcoin.**
