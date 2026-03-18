# Project Roadmap & Issues - STX Bazaar

This document tracks the development of the STX Bazaar marketplace platform.

---

## Phase 1: Core Contracts

### Issue #1: Auction House Contract
**Status:** COMPLETED
**Description:** Implement  auction system with auto-refunds and stats tracking.
- **Tasks:**
  - [x] Implement `create-auction` with category tagging
  - [x] Implement `place-bid` with auto-refund to previous bidder
  - [x] Implement `end-auction` with winner stats update
  - [x] Implement `withdraw-funds` for seller payout
  - [x] Implement `cancel-auction` for no-bid auctions
  - [x] Add bidder and seller global stats tracking
  - [x] Add Clarity 4 `to-ascii?` auction summaries

### Issue #2: Escrow Contract
**Status:** COMPLETED
**Description:** Trustless P2P escrow with community arbitration and deadline expiry.
- **Tasks:**
  - [x] Implement `create-escrow` with STX locking
  - [x] Implement `complete-escrow` for buyer confirmation
  - [x] Implement `raise-dispute` with reason tracking
  - [x] Implement `nominate-arbitrator` with party validation
  - [x] Implement `resolve-dispute` with arbitrator enforcement
  - [x] Implement `claim-expired-refund` for deadline-based auto-refund
  - [x] Add arbitrator reputation tracking

### Issue #3: Registry Contract
**Status:** COMPLETED
**Description:** On-chain name/identity registry with community verification.
- **Tasks:**
  - [x] Implement `register` with category support
  - [x] Implement `update-metadata` and `update-category`
  - [x] Implement `transfer` with ownership tracking
  - [x] Implement `verify` with dedup and auto-verify at 3 verifications
  - [x] Add reverse principal-to-name lookup

---

## Phase 2: Frontend Integration

### Issue #4: Marketplace Dashboard
**Status:** PENDING
**Description:** Connect frontend to all three contracts.
- **Tasks:**
  - [ ] Auction listing and bidding UI
  - [ ] Escrow creation and management flow
  - [ ] Name registration and verification interface
  - [ ] Wallet connection (Leather/Xverse)

### Issue #5: Seller Profiles
**Status:** PENDING
**Description:** Display seller identity from registry with verification badge.
- **Tasks:**
  - [ ] Fetch registration data for seller principals
  - [ ] Show verification status and badge count
  - [ ] Link auction history to seller profile

---

## Phase 3: Deployment

### Issue #6: Testnet Deployment
**Status:** PENDING
- [ ] Deploy all 3 contracts to Stacks testnet
- [ ] Test full auction lifecycle from external wallets
- [ ] Test escrow dispute resolution flow

### Issue #7: Mainnet Deployment
**Status:** PENDING
- [ ] Audit contracts
- [ ] Deploy to mainnet
- [ ] Register on Talent Protocol

---

## Completed Milestones
- [x] Project scaffold
- [x] All 3 core contracts written (, Clarity 4)
- [x] Clarinet configuration updated
- [x] Documentation updated
