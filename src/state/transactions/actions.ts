import { createAction } from '@reduxjs/toolkit';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

export const addTransaction = createAction<{
  chainId: number;
  hash: string;
  from: string;
  approval?: { tokenAddress: string; spender: string };
  claim?: { recipient: string };
  summary?: string;
  archer?: {
    rawTransaction: string;
    deadline: number;
    nonce: number;
    ethTip: string;
  };
}>('transactions/addTransaction');
// TODO: need to change it. dex using "ChainId" instead of "number" -> { chainId: ChainId }
export const clearAllTransactions = createAction<{ chainId: number }>(
  'transactions/clearAllTransactions',
);
export const finalizeTransaction = createAction<{
  chainId: number;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');
export const checkedTransaction = createAction<{
  chainId: number;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');
