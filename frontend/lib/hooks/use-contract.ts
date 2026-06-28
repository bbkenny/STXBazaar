"use client";

import { useState, useCallback } from 'react';
import { Cl, fetchCallReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { CONTRACTS, STACKS_NETWORK_CONFIG, VAULT_FUNCTIONS, YIELD_ADAPTER_FUNCTIONS } from '../constants/contracts';
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
        functionName: VAULT_FUNCTIONS.GET_VAULT,
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

  const createVault = async (amount: number, lockPeriod: number, onFinish: (data: any) => void, onCancel: () => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      VAULT_FUNCTIONS.CREATE_VAULT,
      [Cl.uint(amount), Cl.uint(lockPeriod)],
      (data) => { setLoading(false); onFinish(data); },
      () => { setLoading(false); onCancel(); }
    );
  };

  const withdraw = async (vaultId: number, onFinish: (data: any) => void, onCancel: () => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      VAULT_FUNCTIONS.WITHDRAW,
      [Cl.uint(vaultId), Cl.contractPrincipal(CONTRACTS.LOCK_ENGINE.split('.')[0], CONTRACTS.LOCK_ENGINE.split('.')[1])],
      (data) => { setLoading(false); onFinish(data); },
      () => { setLoading(false); onCancel(); }
    );
  };

  const getTotalVaults = useCallback(async () => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: VAULT_FUNCTIONS.GET_TOTAL_VAULTS,
        functionArgs: [],
        network: STACKS_NETWORK_CONFIG as any,
        senderAddress: stxAddress || addr,
      });
      return cvToJSON(result);
    } catch (e) {
      console.error('get-total-vaults error', e);
      return null;
    }
  }, [addr, name, stxAddress]);

  return {
    getVaultDetails,
    getTotalVaults,
    createVault,
    withdraw,
    loading,
  };
}

// ─── Yield Logic ─────────────────────────────────────────────────────────

export function useYield() {
  const { stxAddress } = useStacks();
  const [loading, setLoading] = useState(false);
  const [addr, name] = CONTRACTS.YIELD_ADAPTER.split('.');

  const getStrategyStats = useCallback(async (strategy: string) => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: addr,
        contractName: name,
        functionName: YIELD_ADAPTER_FUNCTIONS.GET_STRATEGY_STATS,
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

  const deployToStrategy = async (amount: number, strategy: string, onFinish: (data: any) => void, onCancel: () => void) => {
    setLoading(true);
    await executeContractAction(
      addr, name,
      YIELD_ADAPTER_FUNCTIONS.DEPLOY_TO_STRATEGY,
      [Cl.uint(amount), Cl.principal(strategy)],
      (data) => { setLoading(false); onFinish(data); },
      () => { setLoading(false); onCancel(); }
    );
  };

  return {
    getStrategyStats,
    deployToStrategy,
    loading,
  };
}
