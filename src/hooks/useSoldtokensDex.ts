import { useMemo } from 'react'
import { fromWei } from '../functions'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useDexIDOContract, useIDOContract } from './useContract'

export function useDexTotalSoldTokens(poolAddress: string): number {
  const dexIDOContract = useDexIDOContract(poolAddress)
  const result = useSingleCallResult(dexIDOContract, 'totalTokenBought')
  return useMemo(() => {
    return result.loading || !result.result?.[0] ? 0 : Number(fromWei(result.result[0]))
  }, [result])
}
