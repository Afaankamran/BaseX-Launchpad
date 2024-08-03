import { STAKING_ADDRESS } from "@/config";
// import { STAKING_TOKEN } from "@/config/tokens";
import { fromWei } from "@/functions";
import { ChainId } from "@devdot/basex-sdk";
import { useMultipleContractSingleData } from "@/state/multicall/hooks";
import { useTokenBalance } from "@/state/wallet/hooks";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment-timezone";
import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
  IDOInterface,
  testIdos,
  useLaunchpadPools,
  useLaunchpads,
} from "./useLaunchpadPools";

export function useLaunchpadsStats() {
  const pools = useLaunchpadPools()?.filter((_, i) => !testIdos.includes(i));
  const poolAddress = pools.map((pool) => pool[0]);
  const getParticipantsResults = useMultipleContractSingleData(
    poolAddress,
    IDOInterface,
    "getParticipants"
  );
  const raisedResult = useMultipleContractSingleData(
    poolAddress,
    IDOInterface,
    "raised"
  );
  const idResult = useMultipleContractSingleData(
    poolAddress,
    IDOInterface,
    "id"
  );
  return useMemo(() => {
    return getParticipantsResults.length <= 0 ||
      raisedResult.length <= 0 ||
      idResult.length <= 0
      ? []
      : pools.map((pool, i) => {
        return {
          participants: getParticipantsResults[i].result,
          raised: raisedResult[i].result?.[0],
          id: idResult[i].result?.[0],
        };
      });
  }, [getParticipantsResults, raisedResult, raisedResult]);
}

export default function useStats() {
  const pools = useLaunchpads();
  const endedPools = pools.filter((pool) =>
    pool.endTime.isBefore(moment().utc())
  );
  const launchpadStats = useLaunchpadsStats();
  const computedStats = launchpadStats.reduce(
    (obj, pool) => {
      obj.wallets = new Set([
        ...obj.wallets,
        ...(pool.participants?.[0] ? pool.participants?.[0] : []),
      ]);
      obj.uniqueWallets = [...obj.wallets].length;
      obj.totalParticipants =
        Number(obj.totalParticipants) +
        Number(
          pool.participants?.[0] ? Number(pool.participants?.[0].length) : 0
        );
      obj.avaxRaised = pool.raised
        ? obj.avaxRaised.add(pool.raised)
        : obj.avaxRaised.add(BigNumber.from("0"));
      obj.poolParticipants = [
        ...obj.poolParticipants,
        {
          id: pool.id,
          participants: Number(pool.participants?.[0].length),
          raised: pool.raised ? Number(fromWei(pool.raised)) : 0,
        },
      ];
      return obj;
    },
    {
      totalParticipants: 0,
      avaxRaised: BigNumber.from("0"),
      uniqueWallets: 0,
      wallets: new Set(),
      poolParticipants: [],
    }
  );
  return {
    successFullSales: endedPools ? endedPools.length : 0,
    ...computedStats,
  };
}

// export function useStakingStats() {
//   const { account, chainId } = useActiveWeb3React();

//   const stakingContractBalance = useTokenBalance(
//     STAKING_ADDRESS[chainId] ?? undefined,
//     STAKING_TOKEN[chainId as ChainId]
//   );

//   return {
//     totalStaked: stakingContractBalance
//       ? stakingContractBalance.toSignificant(6)
//       : 0,
//     tvl:
//       Number(
//         stakingContractBalance ? stakingContractBalance.toSignificant(18) : 0
//       ) * 0,
//     totalVolume: 0,
//     treasury: 0,
//   };
// }
