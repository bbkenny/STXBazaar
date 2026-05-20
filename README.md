# 🟣 STX Bazaar

**Bitcoin-Native Vault & Time-Lock Protocol**

STX Bazaar is a sophisticated Bitcoin-native protocol that transforms static BTC into programmable financial instruments. By leveraging Clarity smart contracts on Stacks, it enables users to lock assets with complex release conditions while simultaneously participating in yield-generating strategies.

---

## 🚀 Vision

Turn "holding" into "committing." STX Bazaar provides the infrastructure for time-based financial coordination on Bitcoin, allowing individuals and DAOs to secure their future with mathematical certainty.

## ⚙️ Core Architecture

- **🔒 Programmable Vaults**: Non-custodial vaults with time-based or milestone-based release schedules.
- **📈 Yield Integration**: Seamlessly allocate locked capital to Stacks DeFi protocols for passive growth.
- **🛡️ Deterministic Security**: Powered by Clarity, ensuring your lock conditions are immutable and verifiable.
- **🌊 Streaming Releases**: Support for gradual fund distribution over time.

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
 
