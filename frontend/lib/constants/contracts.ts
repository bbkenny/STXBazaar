import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// STX Bazaar Contract Addresses - Bitcoin Vault Protocol
export const CONTRACTS = {
  VAULT: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.stxbazaar-vault",
  LOCK_ENGINE: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.stxbazaar-lockengine",
  YIELD_ADAPTER: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.stxbazaar-yieldadapter",
} as const;

export const STACKS_NETWORK_CONFIG = {
  ...STACKS_MAINNET,
  baseUrl: STACKS_MAINNET.client.baseUrl,
};

export const STACKS_TESTNET_CONFIG = {
  ...STACKS_TESTNET,
  baseUrl: STACKS_TESTNET.client.baseUrl,
};

export const PLATFORM_CONFIG = {
  name: "STX Bazaar",
  tagline: "Bitcoin-Native Vault Protocol",
  version: "1.0.0",
  deployer: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D",
} as const;
