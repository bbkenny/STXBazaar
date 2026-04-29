import { StacksMainnet } from '@stacks/network';

// STX Bazaar Contract Addresses
export const CONTRACTS = {
  AUCTION_HOUSE: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.STXBazaar-auction-house",
  ESCROW: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.STXBazaar-escrow",
  REGISTRY: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D.STXBazaar-registry",
} as const;

export const STACKS_NETWORK_CONFIG = new StacksMainnet();

export const PLATFORM_CONFIG = {
  name: "STX Bazaar",
  tagline: "Trustless Marketplace",
  version: "1.0.0",
  deployer: "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D",
} as const;
