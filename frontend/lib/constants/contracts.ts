// STX Bazaar Contract Addresses
// Dummy addresses — update these after mainnet deployment
export const CONTRACTS = {
  AUCTION_HOUSE: "SP2STXBAZAAR000000000000000000000000.auction-house",
  ESCROW: "SP2STXBAZAAR000000000000000000000000.escrow",
  REGISTRY: "SP2STXBAZAAR000000000000000000000000.registry",
} as const;

export const STACKS_NETWORK_CONFIG = {
  chainId: 1, // Mainnet
  coreApiUrl: "https://api.hiro.so",
} as const;

export const PLATFORM_CONFIG = {
  name: "STX Bazaar",
  tagline: "Trustless Marketplace",
  version: "1.0.0",
  deployer: "SP2STXBAZAAR000000000000000000000000",
} as const;
