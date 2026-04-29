"use client";

import { useState, useCallback } from 'react';
import { Cl, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { CONTRACTS, STACKS_NETWORK_CONFIG } from '../constants/contracts';
import { useStacks } from './use-stacks';
import { executeContractAction } from '../stacks-actions';

// ─── Auction House ────────────────────────────────────────────────────────────

export function useAuctionHouse() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.AUCTION_HOUSE.split('.');

  const getAuction = useCallback(async (auctionId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-auction',
        functionArgs: [Cl.uint(auctionId)],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-auction error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getMarketplaceStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-marketplace-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-marketplace-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const createAuction = async (
    title: string,
    description: string,
    startingPriceMicro: number,
    durationBlocks: number,
    category: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'create-auction',
      [
        Cl.stringAscii(title),
        Cl.stringAscii(description),
        Cl.uint(startingPriceMicro),
        Cl.uint(durationBlocks),
        Cl.stringAscii(category),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const placeBid = async (
    auctionId: number,
    bidAmountMicro: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'place-bid',
      [Cl.uint(auctionId), Cl.uint(bidAmountMicro)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const endAuction = async (auctionId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'end-auction',
      [Cl.uint(auctionId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const withdrawFunds = async (auctionId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'withdraw-funds',
      [Cl.uint(auctionId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const cancelAuction = async (auctionId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'cancel-auction',
      [Cl.uint(auctionId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getAuction,
    getMarketplaceStats,
    createAuction,
    placeBid,
    endAuction,
    withdrawFunds,
    cancelAuction,
    loading,
  };
}

// ─── Escrow ───────────────────────────────────────────────────────────────────

export function useEscrow() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.ESCROW.split('.');

  const getEscrow = useCallback(async (escrowId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-escrow',
        functionArgs: [Cl.uint(escrowId)],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-escrow error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getPlatformStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-escrow-platform-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-escrow-platform-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const createEscrow = async (
    seller: string,
    amountMicro: number,
    durationBlocks: number,
    description: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'create-escrow',
      [
        Cl.principal(seller),
        Cl.uint(amountMicro),
        Cl.uint(durationBlocks),
        Cl.stringAscii(description),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const completeEscrow = async (escrowId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'complete-escrow',
      [Cl.uint(escrowId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const raiseDispute = async (
    escrowId: number,
    reason: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'raise-dispute',
      [Cl.uint(escrowId), Cl.stringAscii(reason)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const nominateArbitrator = async (
    escrowId: number,
    arbitrator: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'nominate-arbitrator',
      [Cl.uint(escrowId), Cl.principal(arbitrator)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const claimExpiredRefund = async (escrowId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'claim-expired-refund',
      [Cl.uint(escrowId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getEscrow,
    getPlatformStats,
    createEscrow,
    completeEscrow,
    raiseDispute,
    nominateArbitrator,
    claimExpiredRefund,
    loading,
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export function useRegistry() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.REGISTRY.split('.');

  const getRegistration = useCallback(async (assetName: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-registration',
        functionArgs: [Cl.stringAscii(assetName)],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-registration error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const getRegistryStats = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-registry-stats',
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-registry-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const isNameAvailable = useCallback(async (assetName: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'is-name-available',
        functionArgs: [Cl.stringAscii(assetName)],
        network: STACKS_NETWORK_CONFIG,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('is-name-available error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const register = async (
    assetName: string,
    metadata: string,
    category: number,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'register',
      [
        Cl.stringAscii(assetName),
        Cl.stringAscii(metadata),
        Cl.uint(category),
      ],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const verifyAsset = async (assetName: string, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'verify',
      [Cl.stringAscii(assetName)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const updateMetadata = async (
    assetName: string,
    newMetadata: string,
    onFinish: (data: any) => void
  ) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'update-metadata',
      [Cl.stringAscii(assetName), Cl.stringAscii(newMetadata)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getRegistration,
    getRegistryStats,
    isNameAvailable,
    register,
    verifyAsset,
    updateMetadata,
    loading,
  };
}
