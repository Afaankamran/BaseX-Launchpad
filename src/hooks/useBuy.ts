import { BigNumber } from '@ethersproject/bignumber';
import { useMemo } from 'react';
import { WhiteListedUser } from '../features/launchpad/types';
import { fromWei, toWei } from '../functions';
import { useSingleCallResult } from '../state/multicall/hooks';
import { useIDOContract } from './useContract';

export function useBuyingPower(
  poolAddress: string,
  address: string,
  whiteUser: WhiteListedUser,
): { maxBuy: number; tokenBought: number } {
  const idoContract = useIDOContract(poolAddress);

  const result = useSingleCallResult(idoContract, 'userHasBought', [address]);
  return useMemo(() => {
    return result.loading || !result.result?.[0] || !whiteUser?.buyingPower
      ? {
          maxBuy: Number(fromWei(whiteUser?.buyingPower || 0)) || 0,
          tokenBought: 0,
        }
      : {
          maxBuy:
            Number(fromWei(whiteUser?.buyingPower || 0)) -
            Number(fromWei(result.result?.[0])),
          tokenBought: Number(fromWei(result.result?.[0])),
        };
  }, [result]);

  // const result = useSingleCallResult(idoContract, 'userInfoMapping', [address])
  // return useMemo(() => {
  //   return result.loading || !result.result?.[1]
  //     ? {
  //         maxBuy: 0,
  //         tokenBought: 0,
  //       }
  //     : {
  //         maxBuy: Number(fromWei(result.result?.[1])) - Number(fromWei(result.result?.[2])),
  //         tokenBought: Number(fromWei(result.result?.[2])),
  //       }
  // }, [result])
}

export function useTokenEthPrice(poolAddress: string): BigNumber {
  const idoContract = useIDOContract(poolAddress);

  const result = useSingleCallResult(idoContract, 'getRateNative');
  return useMemo(() => {
    return result.loading || !result.result?.[0]
      ? BigNumber.from(toWei('0'))
      : BigNumber.from(result?.result?.[0]);
  }, [result]);
}

// export function useWhiteListedUser(poolAddress, address) {
//   const idoContract = useIDOContract(poolAddress)
//   const result = useSingleCallResult(idoContract, 'userInfoMapping', [address])
//   return useMemo(() => {
//     return result.loading || !result.result?.[3] ? false : result.result?.[3]
//   }, [result])
// }
