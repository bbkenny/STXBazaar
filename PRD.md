# 📘 Product Requirements Document (PRD)

## 🟣 Product Name

STX Bazaar (powered by TimeLock BTC)

A Bitcoin-native vault protocol that enables programmable time-locked capital with structured release and financial coordination logic.

## 🧠 One-Line Summary

Lock Bitcoin with rules and unlock value over time—not instantly.

---

## 🎯 Problem Statement

Bitcoin is largely passive:

- Users hold without utility
- Limited programmability
- No native time-based financial logic

Users want:

- Yield
- Control over unlock timing
- Conditional fund release

---

## 💡 Solution

A smart contract vault system that:

- Locks BTC (or sBTC)
- Applies time-based or rule-based conditions
- Enables yield generation during lock period

---

## 🎯 Target Users

- Long-term BTC holders
- DeFi-native Bitcoin users
- DAOs managing BTC treasury
- Builders exploring BTC utility

---

## 🔥 Core Value Proposition

- Turn static BTC into programmable financial instruments
- Enable time-based control over assets
- Combine yield + security + predictability

---

## ⚙️ Core Features

### 1. BTC Vault Creation

- User deposits BTC / sBTC
- Vault is created with rules

---

### 2. Time-Based Unlock

- Funds unlock after defined duration
- Supports:
  - Fixed lock
  - Gradual release (streaming)

---

### 3. Yield Integration

- Funds can be allocated to yield strategies
- Generates passive returns during lock

---

### 4. Conditional Logic

- Unlock based on:
  - Time
  - Milestones
  - External triggers (future)

---

### 5. Vault Tracking

- View:
  - Locked balance
  - Unlock schedule
  - Yield generated

---

## 🏗️ Technical Architecture

### Smart Contracts (Clarity)

- `vault.clar`: Stores BTC and enforces time-lock logic.
- `yield-adapter.clar`: Interfaces with Stacks DeFi protocols for yield.
- `lock-engine.clar`: Core logic for release schedules.

---

### Frontend

- Framework: Next.js
- Wallet: Hiro Wallet / Leather
- UI: Premium "Bazaar" themed dashboard for vaults

---

## 🚀 MVP Scope

- Basic time-lock vault
- Fixed unlock date
- Deposit + withdraw after expiry
- Minimalist dashboard