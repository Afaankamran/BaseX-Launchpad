import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { abi as IArrayV1PairABI } from '@array.inc/v1-core/build/IArrayV1Pair.json'
import { isAddress } from '../functions'
import { useContract } from './useContract'

const usePool = (poolAddress: string | undefined) => {
  const [poolData, setPoolData] = useState<any>({})
  const address = isAddress(poolAddress)
  const poolContract = useContract(address || undefined, IArrayV1PairABI, false)

  const fetchPoolData = useCallback(async () => {
    const [reserves, token0, token1, totalSupply] = await Promise.all([
      poolContract?.getReserves(),
      poolContract?.token0(),
      poolContract?.token1(),
      poolContract?.totalSupply(),
    ])

    setPoolData({
      reserves,
      token0,
      token1,
      totalSupply,
    })
  }, [poolAddress])

  useEffect(() => {
    if (poolAddress) {
      fetchPoolData()
    }
  }, [poolAddress])

  return poolData
}

export default usePool
