import { ChainId, CurrencyAmount, Token } from "@devdot/basex-sdk";

import { fromWei } from "@/functions";
import Images from "@/public/Assets/Images";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { useActiveWeb3React } from ".";
// import { STAKING_TOKEN } from "../config/tokens";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useTransactionAdder } from "../state/transactions/hooks";
import { useStakingContract } from "./useContract";

const useSushiBar = () => {
  const addTransaction = useTransactionAdder();
  const barContract = useStakingContract();
  const { account } = useActiveWeb3React();
  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined, summary?: string) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.deposit(amount?.quotient.toString());
          return addTransaction(tx, {
            summary: summary ? summary : "Enter Stake",
          });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      try {
        const tx = await barContract?.withdraw(amount?.quotient.toString());
        return addTransaction(tx, { summary: "Leave Stake" });
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [addTransaction, barContract]
  );

  const reStakeReward = useCallback(
    async function () {
      if (!barContract) {
        return;
      }
      try {
        const tx = await barContract.reDeposit();
        return addTransaction(tx as any, {
          summary: `Re Staked Reward`,
        });
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [addTransaction, barContract]
  );

  const claimReward = useCallback(
    async function () {
      if (!barContract) {
        return;
      }
      try {
        const tx = await barContract.withdrawRewards();
        return addTransaction(tx as any, {
          summary: `Claim Reward`,
        });
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [addTransaction, barContract]
  );
  return { enter, leave, reStakeReward, claimReward };
};

export default useSushiBar;

// export function useBarUserMappings() {
//   const barContract = useStakingContract();
//   const { account, chainId } = useActiveWeb3React();

//   const stakesresult = useSingleCallResult(
//     account ? barContract : null,
//     "userInfo",
//     account ? [account] : []
//   );
//   const result = useSingleCallResult(
//     account ? barContract : null,
//     "pendingArray",
//     account ? [account] : []
//   );
//   const lockedResult = useSingleCallResult(
//     account ? barContract : null,
//     "isLocked",
//     account ? [account] : []
//   );
//   const unlockTimeResult = useSingleCallResult(
//     account ? barContract : null,
//     "getUserUnlockTime",
//     account ? [account] : []
//   );
//   const userTierResult = useSingleCallResult(
//     account ? barContract : null,
//     "getUserTier",
//     account ? [account] : []
//   );

//   return useMemo(() => {
//     return stakesresult.loading ||
//       result.loading ||
//       unlockTimeResult.loading ||
//       !result?.result?.[0] ||
//       lockedResult.loading ||
//       userTierResult.loading ||
//       !(
//         Array.isArray(stakesresult?.result) ||
//         (stakesresult?.result && stakesresult?.result?.length > 0)
//       )
//       ? {
//         stakedAmount: CurrencyAmount.fromRawAmount(
//           STAKING_TOKEN[chainId as ChainId] as Token,
//           0
//         ),
//         pendingReward: CurrencyAmount.fromRawAmount(
//           STAKING_TOKEN[chainId as ChainId] as Token,
//           0
//         ),
//       }
//       : {
//         stakedAmount: CurrencyAmount.fromRawAmount(
//           STAKING_TOKEN[chainId as ChainId] as Token,
//           stakesresult?.result?.[0].toString()
//         ),
//         pendingReward: CurrencyAmount.fromRawAmount(
//           STAKING_TOKEN[chainId as ChainId] as Token,
//           result?.result?.[0].toString()
//         ),
//         isLocked: lockedResult.result?.[0],
//         unlockAt: unlockTimeResult.result?.[0],
//         tier: userTierResult.result?.[0],
//       };
//   }, [stakesresult, result, chainId, lockedResult]);
// }
export function useRewardPerBlock(): number {
  const barContract = useStakingContract();
  const result = useSingleCallResult(barContract, "rewardPerBlock", []);
  return useMemo(() => {
    return result.loading
      ? 0
      : result.result?.[0]
        ? Number(fromWei(result.result?.[0]))
        : 0;
  }, [result]);
}
// export function useBarAPY(address: string | undefined) {
//   const barContract = useStakingContract(address);
//   const result = useSingleCallResult(barContract, 'liquidityMining', []);
//   return useMemo(() => {
//     return result.loading || !result?.result?.[0]
//       ? 0
//       : fromWei(result?.result?.[1], 12);
//   }, [result]);
// }

export interface TierData {
  img: StaticImageData;
  title: string;
  requirement: number;
  lockPeriod: number;
  poolWeight: string;
}

export const useTiers = () => {
  const stakingContract = useStakingContract();

  const imagesMap = new Map();
  imagesMap.set(1, Images.tiresystem1);
  imagesMap.set(2, Images.tiresystem2);
  imagesMap.set(3, Images.tiresystem3);
  imagesMap.set(4, Images.tiresystem4);

  return useSWR(stakingContract ? "web3/useTiers" : null, async () => {
    const tiersData: TierData[] = [];

    const lockPeriodInSeconds = await stakingContract.lockPeriod();
    dayjs.extend(duration);
    const durationObject = dayjs.duration(
      +lockPeriodInSeconds.toString(),
      "seconds"
    );
    const lockPeriodInDays = durationObject.asDays();

    for (let i = 1; i <= 4; ++i) {
      const currentTier = await stakingContract.tiers(i);
      tiersData.push({
        img: imagesMap.get(i),
        // title: `${currentTier.id}`,
        title: `Tier ${i}`,
        poolWeight: currentTier.weight.toString(),
        requirement: Math.ceil(currentTier.minAmount / 10 ** 18),
        lockPeriod: lockPeriodInDays,
      });
    }

    return tiersData;
  });
};
