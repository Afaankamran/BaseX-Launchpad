import { useMemo } from 'react'
import { fromWei } from '../functions'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useIDOContract } from './useContract'

export function useTotalSoldTokens(poolAddress: string): number {
  const idoContract = useIDOContract(poolAddress)
  const result = useSingleCallResult(idoContract, 'totalTokenBought')
  return useMemo(() => {
    return result.loading || !result.result?.[0] ? 0 : Number(fromWei(result.result[0]))
  }, [result])
}
