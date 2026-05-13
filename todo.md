# 📝 STX Bazaar Development TODO

> [!IMPORTANT]
> This document tracks the pending tasks for the **STX Bazaar** (TimeLock BTC) project as it pivots to a Bitcoin-native vault protocol.

## 🚀 Phase 1: Smart Contract Development
- [x] **Contract Refactor**: Replaced legacy marketplace contracts with `vault.clar`, `lock-engine.clar`, and `yield-adapter.clar`.
- [ ] **Advanced Streaming**: Implement non-linear release schedules in `lock-engine.clar`.
- [ ] **Security Audit**: Ensure the `as-contract` transfers in `vault.clar` are fully secure.
- [ ] **Yield Integration**: Connect `yield-adapter.clar` to real Stacks DeFi protocols (e.g., Arkadiko, Alex).

## 🖥️ Frontend Integration
- [x] **Navigation Refactor**: Updated `navbar.tsx` to reflect the vault protocol features.
- [x] **Dashboard Overhaul**: Rebuilt `page.tsx` with high-impact "Commitment Protocol" branding.
- [x] **Vault Management**: Implemented `app/vaults/page.tsx` for vault creation and monitoring.
- [ ] **Yield Marketplace**: Build `app/yield/page.tsx` to allow users to select yield strategies for their locked funds.
- [ ] **Transaction History**: Build `app/history/page.tsx` to show full audit logs of vault interactions.
- [ ] **Visual Progress Indicators**: Add detailed countdowns and streaming progress visualizations.

## 🛠 Deployment & DevOps
- [x] **Documentation**: Updated `PRD.md` and `README.md` to align with the new vision.
- [ ] **Clarinet Devnet**: Deploy the new contracts to a local Devnet and verify frontend integration.
- [ ] **Mainnet Deployment Plan**: Sequence the launch of the vault protocol.

## 🧪 Testing & Validation
- [ ] **Unit Tests**: Create new Vitest tests in `smartcontract/tests/` for the vault logic.
- [ ] **Security Simulation**: Test edge cases like early withdrawal attempts and strategy failure scenarios.
