"use client";

import { useState, useCallback } from 'react';
import { Cl, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { CONTRACTS, STACKS_NETWORK_CONFIG } from '../constants/contracts';
import { useStacks } from './use-stacks';
import { executeContractAction } from '../stacks-actions';

// ─── Vault Logic ─────────────────────────────────────────────────────────

export function useVault() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.VAULT.split('.');

  const getVaultDetails = useCallback(async (vaultId: number) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-vault',
        functionArgs: [Cl.uint(vaultId)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-vault error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  const createVault = async (amount: number, lockPeriod: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'create-vault',
      [Cl.uint(amount), Cl.uint(lockPeriod)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  const withdraw = async (vaultId: number, onFinish: (data: any) => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      'withdraw',
      [Cl.uint(vaultId)],
      (data) => { setLoading(false); onFinish(data); },
      () => setLoading(false)
    );
  };

  return {
    getVaultDetails,
    createVault,
    withdraw,
    loading,
  };
}

// ─── Yield Logic ─────────────────────────────────────────────────────────

export function useYield() {
  const { stxAddress } = useStacks();
  const [addr, name] = CONTRACTS.YIELD_ADAPTER.split('.');

  const getStrategyStats = useCallback(async (strategy: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: 'get-strategy-stats',
        functionArgs: [Cl.principal(strategy)],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-strategy-stats error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  return {
    getStrategyStats,
  };
}
