# 🟣 STX Bazaar

**Bitcoin-Native Vault & Time-Lock Protocol**

STX Bazaar is a sophisticated Bitcoin-native protocol that transforms static BTC into programmable financial instruments. By leveraging Clarity smart contracts on Stacks, it enables users to lock assets with complex release conditions while simultaneously participating in yield-generating strategies.

---

## 🚀 Vision

Turn "holding" into "committing." STX Bazaar provides the infrastructure for time-based financial coordination on Bitcoin, allowing individuals and DAOs to secure their future with mathematical certainty.

## ⚙️ Core Architecture

## Overview

STX Bazaar is a Bitcoin-native, non-custodial vault protocol on Stacks L2. Users deposit STX into time-locked vaults with linear streaming unlocks — funds become claimable gradually block-by-block, not all at once. A pluggable yield adapter layer routes locked capital to live Stacks DeFi protocols (Arkadiko, Auto-Alex, sBTC) to earn yield on idle deposits.

> **Phase 1 (Live):** Vaults with linear streaming unlocks. Lock capital, withdraw proportionally as blocks pass.
>
> **Phase 2 (Roadmap):** Vault ↔ Yield Adapter integration. When a vault is created with a `yield-strategy`, deposited STX will be automatically routed to the selected DeFi protocol for yield generation during the lock period. The `yield-adapter` contract is already deployed and strategy-ready — the bridge between vault creation and automatic strategy routing is the Phase 2 milestone.

## 🛠 Tech Stack

- **Smart Contracts**: Clarity (Stacks L2)
- **Frontend**: Next.js 15+, Tailwind CSS 4, Framer Motion
- **Wallet Integration**: Hiro / Leather / Xverse
- **Data Layer**: Stacks API & Hiro Subnets

## 📂 Project Structure

```bash
├── frontend          # Next.js Dashboard for vault management
├── smartcontract     # Clarity contracts (Vaults, Adapters, Engine)
├── docs              # Technical guides and integration specs
└── PRD.md            # Product strategy and roadmap
```

## 🚥 Quick Start

### Smart Contracts
```bash
cd smartcontract
clarinet check
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📜 License

MIT
 
  
   
