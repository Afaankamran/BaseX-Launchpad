import {
  useMultipleCallMultipleResult,
  useMultipleContractSingleData,
  useSingleCallResult,
} from '../state/multicall/hooks'
import { Interface } from '@ethersproject/abi'
import { useMemo } from 'react'
import { useDexIDOContract, useIDOContract, useLaunchPadFactory } from './useContract'
import DEX_IDO_ABI from '../constants/abis/ido-dex.json'
import moment from 'moment-timezone'
import useActiveWeb3React from './useActiveWeb3React'
import { BigNumber } from '@ethersproject/bignumber'
export function useLaunchpadPools() {
  const launchpadFactoryContract = useLaunchPadFactory()
  const result = useSingleCallResult(launchpadFactoryContract, 'getAllIdos')
  return result.loading ? [] : Array.isArray(result.result?.[0]) ? result.result?.[0] : []
}
const IDOInterface = new Interface(DEX_IDO_ABI)
export function useDexLaunchpads() {
  const pools = useLaunchpadPools()
  const poolAddress = pools.map((pool) => pool[0])
  const startTimeResults = useMultipleContractSingleData(poolAddress, IDOInterface, 'startTime')
  const endTimeResult = useMultipleContractSingleData(poolAddress, IDOInterface, 'getEndTime')
  const isCanceledResult = useMultipleContractSingleData(poolAddress, IDOInterface, 'isCanceled')
  return useMemo(() => {
    return startTimeResults.length <= 0 || endTimeResult.length <= 0 || isCanceledResult.length <= 0
      ? []
      : pools.map((pool, i) => {
        return {
          address: pool[0],
          ipfsHash: pool[1],
          startTime: moment.unix(Number(startTimeResults[i].result)).utc(),
          endTime: moment.unix(Number(endTimeResult[i].result)).utc(),
          isCanceled: isCanceledResult[i].result?.[0],
        }
      })
  }, [startTimeResults, endTimeResult])
}
const dexIDOCalls = [
  {
    methodName: 'rate',
    callInputs: [],
  },
  {
    methodName: 'tokensForSale',
    callInputs: [],
  },
  {
    methodName: 'startTime',
    callInputs: [],
  },
  {
    methodName: 'getEndTime',
    callInputs: [],
  },
  {
    methodName: 'fcfsDuration',
    callInputs: [],
  },
  {
    methodName: 'whitelistEnabled',
    callInputs: [],
  },
  {
    methodName: 'levelsEnabled',
    callInputs: [],
  },
  {
    methodName: 'getParticipants',
    callInputs: [],
  },
  {
    methodName: 'tokensSold',
    callInputs: [],
  },
  {
    methodName: 'getRateNative',
    callInputs: [],
  },
  {
    methodName: 'getNativePriceUSD',
    callInputs: [],
  },
  {
    methodName: 'minSell',
    callInputs: [],
  },
  {
    methodName: 'maxSell',
    callInputs: [],
  },
  {
    methodName: 'isLive',
    callInputs: [],
  },
  {
    methodName: 'isFcfsTime',
    callInputs: [],
  },
  {
    methodName: 'getNativePriceUSD',
    callInputs: [],
  },
  {
    methodName: 'raised',
    callInputs: [],
  },
  {
    methodName: 'dataUri',
    callInputs: [],
  },
]

export function useDexSinglePoolData(poolAddress: string) {
  const dexIDOContract = useDexIDOContract(poolAddress)
  const results = useMultipleCallMultipleResult(dexIDOContract, dexIDOCalls)
  return useMemo(() => {
    return !results || results.length <= 0 || results.some((result) => result.loading)
      ? undefined
      : dexIDOCalls.reduce((acc, curr, i) => {
        if (curr.methodName === 'getParticipants') {
          acc[curr.methodName] = results[i].result
        } else acc[curr.methodName] = results[i].result?.[0]
        return acc
      }, {} as any)
  }, [results])
}

export function useIsDexUserWhiteListed(poolAddress: string) {
  const { account } = useActiveWeb3React()
  const dexIDOContract = useDexIDOContract(poolAddress)
  const result = useSingleCallResult(account ? dexIDOContract : null, 'whitelisted', account ? [account] : [])
  return result.loading ? false : result.result?.[0]
}

export function useDexUserRemainingAllocation(poolAddress: string, buyingPower: string) {
  const { account } = useActiveWeb3React()
  const dexIDOContract = useDexIDOContract(poolAddress)
  const result = useSingleCallResult(account ? dexIDOContract : null, 'getUserLevelState', account ? [buyingPower] : [])
  const balanceResult = useSingleCallResult(account ? dexIDOContract : null, 'balances', account ? [account] : [])
  // result.loading ||
  // !result.result?.[0] ||
  return result.loading || !result.result?.[0] || balanceResult.loading || !balanceResult.result?.[0]
    ? {
      balance: BigNumber.from(0),
      maxAllocation: BigNumber.from(0),
    }
    : {
      maxAllocation: result.result?.[1],
      // result.result?.[0]
      balance: balanceResult.result?.[0],
    }
}
