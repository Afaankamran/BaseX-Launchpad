import {
  ChainId,
  CurrencyAmount,
  JSBI,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  // MASTERCHEF_V2_ADDRESS, MINICHEF_ADDRESS
} from '@devdot/basex-sdk'
import { Chef } from './enum'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import {
  useMasterChefContract,
  useStaticFarmsContract,
  useMasterOldChefContract,
  useMasterChefV2Contract,
  useArrayStakingContract,
  useLPStakingNFTContract,
} from '../../hooks/useContract'

import { Contract } from '@ethersproject/contracts'
import { ARRAY } from '../../config/tokens'
import { Zero } from '@ethersproject/constants'
import concat from 'lodash/concat'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import zip from 'lodash/zip'
import { useBlockNumber } from '../../state/application/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import moment from 'moment-timezone'

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  const masterChefStaticContract = useStaticFarmsContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const arrayStaking = useArrayStakingContract()
  const lpStakingContract = useLPStakingNFTContract()
  // const miniChefContract = useMiniChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_STATIC]: masterChefStaticContract,
      [Chef.MASTERCHEF_V2]: masterChefContract,
      [Chef.MASTERCHEF_ARRAY_NFT]: arrayStaking,
      [Chef.MASTERCHEF_PAIR_NFT]: lpStakingContract,
      // [Chef.MINICHEF]: miniChefContract,
    }),
    [
      masterChefContract,
      masterChefStaticContract,
      masterChefV2Contract,
      arrayStaking,
      lpStakingContract,
      //  miniChefContract
    ]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

const CHEFS = {
  [ChainId.MAINNET]: [Chef.MASTERCHEF, Chef.MASTERCHEF_V2],
  [ChainId.MATIC]: [Chef.MINICHEF],
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  // const miniChefContract = useMiniChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      // [Chef.MINICHEF]: miniChefContract,
    }),
    [
      masterChefContract,
      masterChefV2Contract,
      //  miniChefContract
    ]
  )
  return chefs.map((chef) => contracts[chef])
}

export function useUserInfo(farm, token) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)
  const oldContract = useMasterOldChefContract()
  const isNFTStake = farm.chef == Chef.MASTERCHEF_ARRAY_NFT
  const isPairStake = farm.chef == Chef.MASTERCHEF_PAIR_NFT

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  const oldresult = useSingleCallResult(args && oldContract ? oldContract : null, 'userInfo', args)?.result
  const unlockTimeResult = useSingleCallResult(
    args && (isNFTStake || isPairStake) ? contract : null,
    'getUserUnlockTime',
    args
  )?.result
  const value = result?.[0]
  const isMigrated = result?.migrated
  const oldValue = oldresult?.[0]
  const oldAmount = oldValue ? JSBI.BigInt(oldValue.toString()) : undefined
  let amount = value ? JSBI.BigInt(value.toString()) : undefined
  if (
    !isMigrated &&
    oldAmount &&
    Number(oldAmount.toString()) > 0 &&
    [ChainId.MOONRIVER, ChainId.MOONBEAM].includes(chainId) &&
    farm.chef == Chef.MASTERCHEF
  ) {
    amount = oldAmount
  }

  const stakedAmount = amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
  let unlockTime = result?.unlockTime ? result?.unlockTime * 1000 : undefined
  if (unlockTimeResult) {
    unlockTime = unlockTimeResult?.[0] ? unlockTimeResult?.[0] * 1000 : undefined
  }
  let withdrawn = result?.withdrawn ? result?.withdrawn : undefined
  if (unlockTimeResult) {
    withdrawn = moment.unix(unlockTimeResult?.[0]).isBefore(moment()) ? false : true
  }
  const rewardDebted = result?.rewardDebt ? result?.rewardDebt : undefined
  return { stakedAmount, unlockTime, isUnlocked: withdrawn, rewardDebted }
}

export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])
  const isStaticFarm = farm.chef == Chef.MASTERCHEF_STATIC
  const isPairStake = farm.chef == Chef.MASTERCHEF_PAIR_NFT
  const isNFTStake = farm.chef == Chef.MASTERCHEF_ARRAY_NFT

  const result = useSingleCallResult(
    args && !isNFTStake && !isPairStake ? contract : null,
    isStaticFarm ? 'pendingArray' : 'pendingArray',
    args
  )?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(ARRAY[ChainId.ARBITRUM], amount) : undefined // TODO: imp need to update to arbitrum
}

export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    args.map((arg) => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSushi = useSingleContractMultipleData(args ? contract : null, 'pendingArray', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    if (MASTERCHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF
    } else if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V2
    }
    // else if (MINICHEF_ADDRESS[chainId] === contract.address) {
    //   return Chef.MINICHEF
    // }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingSushi || !userInfo) {
      return []
    }
    return zip(pendingSushi, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSushi: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingSushi, amount }) => {
        return (pendingSushi && !pendingSushi.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingSushi, userInfo])
}

export function usePositions(chainId = undefined) {
  const [
    masterChefV1Positions,
    masterChefV2Positions,
    // , miniChefPositions
  ] = [
      useChefPositions(useMasterChefContract(), undefined, chainId),
      useChefPositions(useMasterChefV2Contract(), undefined, chainId),
      // useChefPositions(useMiniChefContract(), undefined, chainId),
    ]
  return concat(
    masterChefV1Positions,
    masterChefV2Positions
    //  miniChefPositions
  )
}

/*
  Currently expensive to render farm list item. The infinite scroll is used to
  to minimize this impact. This hook pairs with it, keeping track of visible
  items and passes this to <InfiniteScroll> component.
*/
export function useInfiniteScroll(items: any[]): [number, Dispatch<number>] {
  const [itemsDisplayed, setItemsDisplayed] = useState(10)
  useEffect(() => setItemsDisplayed(10), [items.length])
  return [itemsDisplayed, setItemsDisplayed]
}
