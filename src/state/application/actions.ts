import { createAction } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';
import { ReactNode } from "react";

export type PopupContent =
  | {
      txn: {
        hash: string;
        success: boolean;
        summary?: string;
      };
    }
  | {
      listUpdate: {
        listUrl: string;
        oldList: TokenList;
        newList: TokenList;
        auto: boolean;
      };
    }
  | {
      content: {
        success: boolean;
        summary?: string;
      };
    }
  | {
      component: {
        jsx: ReactNode;
      };
    };

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  LANGUAGE,
  NETWORK,
}

export const updateBlockNumber = createAction<{
  chainId: number;
  blockNumber: number;
}>('application/updateBlockNumber');
export const setOpenModal = createAction<ApplicationModal | null>(
  'application/setOpenModal',
);
export const addPopup = createAction<{
  key?: string;
  removeAfterMs?: number | null;
  content: PopupContent;
}>('application/addPopup');
export const removePopup = createAction<{ key: string }>(
  'application/removePopup',
);
export const setKashiApprovalPending = createAction<string>(
  'application/setKashiApprovalPending',
);
