import {
  getMasterChefV1Farms,
  getMasterChefV1PairAddreses,
  getMasterChefV1SushiPerBlock,
  getMasterChefV1TotalAllocPoint,
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
  getMiniChefFarms,
  getMiniChefPairAddreses,
  getMasterChefStaticFarms,
} from '../fetchers'
import { useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@devdot/basex-sdk'
import { Chef } from '../../../features/onsen/enum'
import concat from 'lodash/concat'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import {
  useLPStakingNFTContract,
  useMasterChefContract,
  useMasterChefV2Contract,
  useArrayStakingContract,
} from '../../../hooks'
import {
  useMultipleContractSingleData,
  useSingleCallResult,
  useSingleContractMultipleData,
} from '../../../state/multicall/hooks'
import { PAIR_INTERFACE } from '../../../hooks/useV2Pairs'
import farmsV1, { farmsV2 } from '../../../config/farms'
import { useERC721Tokens } from '../../../hooks/useERC721Token'
import { Contract } from '@ethersproject/contracts'
import rewarderAbi from '../../../constants/abis/rewarder.json'
export * from './bentobox'
export * from './blocks'
export * from './exchange'
import { BigNumber, ethers } from 'ethers'
import { Interface } from '@ethersproject/abi'
export const REWARDER_INTERFACE = new Interface(rewarderAbi)
export function useMasterChefV1TotalAllocPoint(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.BSC
  const { data } = useSWR(
    shouldFetch ? 'masterChefV1TotalAllocPoint' : null,
    () => getMasterChefV1TotalAllocPoint(),
    swrConfig
  )
  return data
}

export function useMasterChefV1SushiPerBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.BSC
  const { data } = useSWR(
    shouldFetch ? 'masterChefV1SushiPerBlock' : null,
    () => getMasterChefV1SushiPerBlock(),
    swrConfig
  )
  return data
}

interface useFarmsProps {
  chainId: number
}

function useFetchFarmsData(_, contract): any[] {
  const { chainId, account } = useActiveWeb3React()
  const poolLengthResult = useSingleCallResult(contract, 'poolLength')
  const poolLength = poolLengthResult?.result?.[0] ? Number(poolLengthResult?.result?.[0]) : 0

  const farms = [...Array(poolLength)].map((_, i) => ({ pid: i })).filter(({ pid }) => chainId == ChainId.ARBITRUM ? pid != 1 : true)
  const contractPoolsInfo = useSingleContractMultipleData(
    contract,
    'poolInfo',
    farms.map((farm) => [farm.pid.toString()])
  )
  const poolsInfo = contractPoolsInfo.map((poolInfo) => poolInfo.result)
  const contractLpTokenInfo = useSingleContractMultipleData(
    contract,
    'lpToken',
    farms.map((farm) => [farm.pid.toString()])
  )
  const lpTokenInfo = contractLpTokenInfo.map((lpinfo) => lpinfo.result?.[0])
  const contractRewarderInfo = useSingleContractMultipleData(
    contract,
    'rewarder',
    farms.map((farm) => [farm.pid.toString()])
  )
  const rewarderInfo = contractRewarderInfo.map((rewarderInfo) => rewarderInfo.result?.[0])
  const contractUserInfo = useSingleContractMultipleData(
    contract,
    'userInfo',
    farms.map((farm) => [farm.pid.toString(), account])
  )
  const userInfo = contractUserInfo.map(info => info.result?.[0])

  const poolsBalance = useMultipleContractSingleData(
    lpTokenInfo.map((farm) => farm),
    PAIR_INTERFACE,
    'balanceOf',
    [contract?.address]
  )
  const contractBalances = poolsBalance.map((balance, i) => {
    return [lpTokenInfo[i], balance.result?.[0] || 0]
  })
  // rewarder calls
  const filteredRewarderInfo = rewarderInfo.filter((rewarder) => rewarder !== ethers.constants.AddressZero)
  const rewarderTokenResult = useMultipleContractSingleData(filteredRewarderInfo, REWARDER_INTERFACE, 'rewardToken')
  const rewarderTokens = rewarderTokenResult.map((token, i) => [filteredRewarderInfo, token.result?.[0]])
  const rewarderPerBlockResult = useMultipleContractSingleData(
    filteredRewarderInfo,
    REWARDER_INTERFACE,
    'rewardPerBlock'
  )
  const rewarderPerBlocks = rewarderPerBlockResult.map((token, i) => [filteredRewarderInfo, token.result?.[0]])
  const rewarderTokenSymbolResult = useMultipleContractSingleData(
    rewarderTokens.map((tkn) => tkn[1]),
    PAIR_INTERFACE,
    'symbol'
  )
  const rewarderTokenSymbols = rewarderTokenSymbolResult.map((result, i) => [
    rewarderTokens[i]?.[1],
    result?.result?.[0],
  ])
  const contractKwikPerBlock = useSingleCallResult(contract, 'arrayPerBlock')
  const contractTotalAllocPoint = useSingleCallResult(contract, 'totalAllocPoint')
  return useMemo(() => {
    return contractKwikPerBlock.result && contractTotalAllocPoint.result && chainId
      ? poolsInfo
        .filter((pool) => pool && pool?.allocPoint && pool?.allocPoint > 0)
        .map((pool, i) => {
          const rewardToken =
            rewarderTokens.find((rewarderTkn) => rewarderTkn?.[0] == rewarderInfo[i])?.[1] ||
            ethers.constants.AddressZero
          return {
            ...pool,
            accSushiPerShare: pool?.accArrayPerShare?.toString(),
            allocPoint: pool?.allocPoint?.toString(),
            lastRewardBlock: pool?.lastRewardBlock?.toString(),
            balance: contractBalances?.[i]?.[1].toString() || 0,
            amount: userInfo?.[i] ? BigNumber.from(userInfo?.[i]) : BigNumber.from(0),
            id: farms[i].pid,
            pair: lpTokenInfo[i]?.toLowerCase(),
            owner: {
              id: contract.address,
              arrayPerBlock: contractKwikPerBlock.result.toString(),
              totalAllocPoint: contractTotalAllocPoint.result.toString(),
            },
            rewarder: {
              rewarder: rewarderInfo[i] || ethers.constants.AddressZero,
              rewardToken,
              rewardPerBlock: rewarderPerBlocks.find((rewarderTkn) => rewarderTkn?.[0] == rewarderInfo[i])?.[1] || 0,
              symbol: rewarderTokenSymbols.find((symbol) => symbol?.[0] == rewardToken)?.[1] || '',
            },
          }
        })
      : []
  }, [
    poolsInfo,
    contractBalances,
    rewarderInfo,
    rewarderTokens,
    rewarderTokenSymbols,
    rewarderPerBlocks,
    contractKwikPerBlock,
    contractTotalAllocPoint,
    lpTokenInfo,
    userInfo,
    chainId,
  ])
}

export function useMasterChefV1Farms({ chainId }: useFarmsProps, swrConfig = undefined) {
  const shouldFetch = chainId && chainId === ChainId.MOONRIVER
  // const { data } = useSWR(shouldFetch ? ['masterChefV1Farms'] : null, () => getMasterChefV1Farms(undefined), swrConfig)
  const contract = useMasterChefContract()
  const data = useFetchFarmsData(farmsV1[chainId], contract)
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({
      ...data,
      chef: data.rewarder?.rewarder == ethers.constants.AddressZero ? Chef.MASTERCHEF : Chef.MASTERCHEF_V2,
    }))
  }, [data])
}
export function useMasterChefStaticFarms({ chainId }: useFarmsProps, swrConfig = undefined) {
  const shouldFetch = chainId && chainId === ChainId.MOONRIVER
  const { data } = useSWR(
    shouldFetch ? ['masterChefStaticFarms'] : null,
    () => getMasterChefStaticFarms(undefined),
    swrConfig
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF_STATIC }))
  }, [data])
}

export function useMasterChefV2Farms({ chainId }: useFarmsProps, swrConfig: SWRConfiguration = undefined) {
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  // const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getMasterChefV2Farms(), swrConfig)
  const contract = useMasterChefV2Contract()

  const data = useFetchFarmsData(farmsV2[chainId], contract)
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF_V2 }))
  }, [data])
}

export function useMiniChefFarms({ chainId }: useFarmsProps, swrConfig: SWRConfiguration = undefined) {
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY, ChainId.ARBITRUM].includes(chainId)
  const { data } = useSWR(
    shouldFetch ? ['miniChefFarms', chainId] : null,
    (_, chainId) => getMiniChefFarms(chainId),
    swrConfig
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MINICHEF }))
  }, [data])
}

export function useFarms({ chainId }: useFarmsProps, swrConfig: SWRConfiguration = undefined) {
  const masterChefV1Farms = useMasterChefV1Farms({ chainId }) // this handles both v1 and v2 farms.
  const masterChefStaticFarms = useMasterChefStaticFarms({ chainId })
  const masterChefV2Farms = useMasterChefV2Farms({ chainId })


  // const miniChefFarms = useMiniChefFarms({ chainId })
  // useEffect(() => {
  //   console.log('debug', { masterChefV1Farms, masterChefV2Farms, miniChefFarms })
  // }, [masterChefV1Farms, masterChefV2Farms, miniChefFarms])
  return useMemo(
    () => concat(masterChefV1Farms, masterChefStaticFarms, masterChefV2Farms).filter((pool) => pool && pool.pair),
    [masterChefV1Farms, masterChefStaticFarms]
  )
}

function useFetchNFTStakingStaking(contract: Contract, chef: number) {
  const poolLength = useSingleCallResult(contract, 'poolLength')
  const totalPools = poolLength.loading || !poolLength?.result?.[0] ? 0 : Number(poolLength?.result?.[0])
  const poolsResults = useSingleContractMultipleData(
    contract,
    'poolInfo',
    [...Array(totalPools)].map((_, index) => [index])
  )
  const tierIdsResults = useSingleCallResult(contract, 'getTierIds')
  const tierIds = tierIdsResults.loading || !tierIdsResults?.result?.[0] ? [] : tierIdsResults?.result?.[0]

  const tierResults = useSingleContractMultipleData(
    contract,
    'tiers',
    tierIds.map((_, index) => [index])
  )
  const isPairNft = chef == Chef.MASTERCHEF_PAIR_NFT
  const pools = poolsResults.some((result) => result.loading) ? [] : poolsResults.map((result) => result.result)
  const poolsBalance = useMultipleContractSingleData(
    isPairNft ? pools.map((farm) => farm.lpToken) : [],
    PAIR_INTERFACE,
    'balanceOf',
    [contract?.address]
  )
  const balances = poolsBalance.map((balance, i) => {
    return [pools[i].lpToken, balance.result?.[0] || 0]
  })
  const tiers = tierResults.some((result) => result.loading) ? [] : tierResults.map((result) => result.result)
  const tokens = useERC721Tokens(pools.map((pool) => pool?.rewardToken))

  return useMemo(() => {
    return tokens.length == pools.length
      ? pools.reduce((poolTiers, pool, id) => {
        poolTiers = [
          ...poolTiers,
          {
            id,
            pool,
            tiers: tiers.map((tier, tierId) => ({
              ...tier,
              id: tierId,
            })),
            chef,
            reward: tokens[id],
            balance: isPairNft
              ? balances.find((c) => c[0].toLowerCase() === pool.lpToken.toLowerCase())?.[1]?.toString() || 0
              : pool?.amountStaked?.toString(),
          },
          // ...tiers.map((tier, tierId) => ({
          //   id,
          //   tier: { ...tier, id: tierId },
          //   pool,
          //   chef: Chef.MASTERCHEF_ARRAY_NFT,
          // })
          // ),
        ]
        return poolTiers
      }, [])
      : []
  }, [pools, tiers, tokens])
}

export function useArrayStaking() {
  const contract = useArrayStakingContract()
  const pools = useFetchNFTStakingStaking(contract, Chef.MASTERCHEF_ARRAY_NFT)
  return pools
}
export function useLPNFTStaking() {
  const lpStakingContract = useLPStakingNFTContract()

  const pools = useFetchNFTStakingStaking(lpStakingContract, Chef.MASTERCHEF_PAIR_NFT)
  return pools
}
export function useStakingForNfts() {
  const arrayPools = useArrayStaking()
  const lpPools = useLPNFTStaking()
  return useMemo(() => {
    return concat(arrayPools, lpPools).filter((pool) => !!pool.pool)
  }, [arrayPools, lpPools])
}
export function useMasterChefV1PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.BSC
  const { data } = useSWR(shouldFetch ? ['masterChefV1PairAddresses', chainId] : null, (_) =>
    getMasterChefV1PairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useMasterChefV2PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['masterChefV2PairAddresses', chainId] : null, (_) =>
    getMasterChefV2PairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useMiniChefPairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY, ChainId.ARBITRUM].includes(chainId)
  const { data } = useSWR(shouldFetch ? ['miniChefPairAddresses', chainId] : null, (_, chainId) =>
    getMiniChefPairAddreses(chainId)
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useFarmPairAddresses() {
  const masterChefV1PairAddresses = useMasterChefV1PairAddresses()
  // const masterChefV2PairAddresses = useMasterChefV2PairAddresses()
  // const miniChefPairAddresses = useMiniChefPairAddresses()
  return useMemo(() => concat(masterChefV1PairAddresses), [masterChefV1PairAddresses])
}
