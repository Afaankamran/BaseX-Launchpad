import { BRIDGE_ADDRESS } from "@/config";
import { useTransactionAdder } from "@/state/transactions/hooks";
import { useCallback } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
  useArrayContract,
  useBridgeContract,
  useZksyncArrayContract,
  useZkSyncBridgeContract
} from "./useContract";

export const useBridge = () => {
  const { chainId } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const bridgeContract = useBridgeContract();
  const zkSyncBridgeContract = useZkSyncBridgeContract();
  const arrayContract = useArrayContract();
  const zkSyncArrayContract = useZksyncArrayContract();

  const anySwapOutUnderlying = useCallback(
    async (token: string, to: string, amount: number, toChainID: number) => {
      try {
        const decimals = await arrayContract.decimals();
        const allowance = await arrayContract.allowance(to, BRIDGE_ADDRESS[chainId]);
        if (parseInt(allowance) < amount * 10 ** decimals){
          const approveTx = await arrayContract.approve(
            BRIDGE_ADDRESS[chainId],
            (amount * 10 ** decimals).toString()
          );
  
          addTransaction(approveTx, {
            summary: "Bridge amount approved",
          });
        }
        const tx = await bridgeContract[
          `anySwapOutUnderlying(address,address,uint256,uint256)`
        ](token, to, (amount * 10 ** decimals).toString(), toChainID);

        return addTransaction(tx, {
          summary:
            "Bridge success, please wait for the funds to be transferred, this takes 30 minutes on average",
        });
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    [bridgeContract, addTransaction]
  );

  const anySwapOut = useCallback(
    async (token: string, to: string, amount: number, toChainID: number) => {
      try {
        const decimals = await zkSyncArrayContract.decimals();
        const allowance = await zkSyncArrayContract.allowance(to, BRIDGE_ADDRESS[chainId]);

        if (parseInt(allowance) < amount * 10 ** decimals){
          const approveTx = await zkSyncArrayContract.approve(
            BRIDGE_ADDRESS[chainId],
            (amount * 10 ** decimals).toString()
          );
  
          addTransaction(approveTx, {
            summary: "Bridge amount approved",
          });
        }

        const tx = await bridgeContract[
          `anySwapOutUnderlying(address,address,uint256,uint256)`
        ](token, to, (amount * 10 ** decimals).toString(), toChainID);

          return addTransaction(tx, {
            summary:
              "Bridge success, please wait for the funds to be transferred, this takes 30 minutes on average",
          });
        } catch (error) {
        console.error(error);
        return error;
      }
    },
    [bridgeContract, addTransaction]
  );

  return { anySwapOutUnderlying, anySwapOut };
};
