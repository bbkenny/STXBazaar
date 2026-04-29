import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  type PostCondition,
} from '@stacks/transactions';
import { STACKS_NETWORK_CONFIG } from './constants/contracts';

/**
 * Generic contract call executor — pass in any deployed contract.
 */
export const executeContractAction = async (
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: any[],
  onFinish: (data: any) => void,
  onCancel: () => void,
  postConditions: PostCondition[] = []
) => {
  await openContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: STACKS_NETWORK_CONFIG,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    postConditions,
    onFinish,
    onCancel,
  } as any);
};
