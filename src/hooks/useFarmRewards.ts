import { Chef, PairType } from '../features/onsen/enum'
import {
  useAverageBlockTime,
  useBlock,
  useEthPrice,
  useFarms,
  useKashiPairs,
  useMasterChefV1SushiPerBlock,
  useMasterChefV1TotalAllocPoint,
  useMaticPrice,
  useMayPrice,
  useNativePrice,
  useOnePrice,
  useStakePrice,
  useSushiPairs,
  useSushiPrice,
} from '../services/graph'

import { ChainId } from '@devdot/basex-sdk'
import { getAddress } from '@ethersproject/address'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'
import { usePositions } from '../features/onsen/hooks'
import { aprToApy } from '../functions/convert/apyApr'
import { BSAEX } from '../config/tokens'
import { formatUnits } from '@ethersproject/units'
import { ConstructionOutlined, Summarize } from '@mui/icons-material'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  const positions = usePositions(chainId)

  const block1w = useBlock({ daysAgo: 1, chainId })

  const farms = useFarms({ chainId })

  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])
  const swapPairs = useSushiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })
  const swapPairs1w = useSushiPairs({
    subset: farmAddresses,
    block: block1w,
    shouldFetch: !!block1w && !!farmAddresses,
    chainId,
  })
  const kashiPairs = useKashiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })

  const averageBlockTime = useAverageBlockTime()
  const masterChefV1TotalAllocPoint = useMasterChefV1TotalAllocPoint()
  const masterChefV1SushiPerBlock = useMasterChefV1SushiPerBlock()

  const [sushiPrice, ethPrice, maticPrice, stakePrice, onePrice, mayPrice] = [
    useSushiPrice(),
    useEthPrice(),
    useMaticPrice(),
    useStakePrice(),
    useOnePrice(),
    useMayPrice()
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const map = (pool) => {

    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
    const swapPair1w = swapPairs1w?.find((pair) => pair.id === pool.pair)
    const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)
    const arrayToken =
      BSAEX[chainId] && getAddress(BSAEX[chainId]?.address) == getAddress(pool.pair) ? BSAEX[chainId] : null
    const pair = swapPair || kashiPair
    const pair1w = swapPair1w
    const type = swapPair || arrayToken ? PairType.SWAP : PairType.KASHI



    const blocksPerHour = 3600 / averageBlockTime

    function getRewards() {
      // TODO: Some subgraphs give arrayPerBlock & sushiPerSecond, and mcv2 gives nothing
      const arrayPerBlock =
        pool?.owner?.arrayPerBlock / 1e18 ||
        (pool?.owner?.sushiPerSecond / 1e18) * averageBlockTime ||
        masterChefV1SushiPerBlock

      const rewardPerBlock = (pool.allocPoint / pool.owner.totalAllocPoint) * (arrayPerBlock ?? 0)
      const defaultReward = {
        token: 'BSAEX',
        icon: '',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: sushiPrice,
        // rewardPrice: 0,
      }

      let rewards = [defaultReward]

      if (pool.chef === Chef.MASTERCHEF_V2) {
        const defaultReward = {
          token: ' BaseX',
          icon: '',
          rewardPerBlock,
          rewardPerDay: rewardPerBlock * blocksPerDay,
          rewardPrice: sushiPrice,
          // rewardPrice: 0,
        }
        rewards[0] = defaultReward
        const rewarderPerBlock = Number(formatUnits(pool.rewarder.rewardPerBlock))
        const reward = {
          token: pool.rewarder.symbol,
          icon: "https://res.cloudinary.com/arrayinc/image/fetch/f_auto,w_32/https://res.cloudinary.com/dgsb5totw/image/upload/v1684940849/u3sxwnqfdxnrajk6brri.png",
          // icon: `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/avalanche/assets/${getAddress(
          //   pool.rewarder.rewardToken
          // )}/logo.png`,
          rewardPerBlock: rewarderPerBlock,
          rewardPerDay: rewarderPerBlock * blocksPerDay,
          rewardPrice: mayPrice,
        }
        rewards[1] = reward

        // override for mcv2...
        // pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint
        // const icon = ['0', '3', '4', '8'].includes(pool.id)
        //   ? `https://raw.githubusercontent.com/sushiswap/icons/master/token/${pool.rewardToken.symbol.toLowerCase()}.jpg`
        //   : `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${getAddress(
        //       pool.rewarder.rewardToken
        //     )}/logo.png`
        // const decimals = 10 ** pool.rewardToken.decimals
        // const rewardPerBlock =
        //   pool.rewardToken.symbol === 'ALCX'
        //     ? pool.rewarder.rewardPerSecond / decimals
        //     : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime
        // const rewardPerDay =
        //   pool.rewardToken.symbol === 'ALCX'
        //     ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
        //     : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay
        // const reward = {
        //   token: pool.rewardToken.symbol,
        //   icon: icon,
        //   rewardPerBlock: rewardPerBlock,
        //   rewardPerDay: rewardPerDay,
        //   rewardPrice: pool.rewardToken.derivedETH * ethPrice,
        // }
        // rewards[1] = reward
      } else if (pool.chef === Chef.MINICHEF) {
        const sushiPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const arrayPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = arrayPerBlock * blocksPerDay
        const rewardPerSecond =
          ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18
        const rewardPerBlock = rewardPerSecond * averageBlockTime
        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.MATIC]: {
            token: 'MATIC',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg',
            rewardPrice: maticPrice,
            rewardPerBlock,
            rewardPerDay,
          },
          [ChainId.XDAI]: {
            token: 'STAKE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/stake.jpg',
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: stakePrice,
          },
          [ChainId.HARMONY]: {
            token: 'ONE',
            icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg',
            rewardPrice: onePrice,
          },
        }

        rewards[0] = {
          ...defaultReward,
          rewardPerBlock: arrayPerBlock,
          rewardPerDay: sushiPerDay,
        }

        if (chainId in reward) {
          rewards[1] = reward[chainId]
        }
      } else if (pool.chef === Chef.MASTERCHEF_STATIC) {
        const rewardPerBlock = ((pool.rewardAPY / 100) * pool.balance) / pool.durationOfPool / blocksPerDay / 1e18

        rewards[0] = {
          ...defaultReward,
          rewardPerBlock,
          rewardPerDay: rewardPerBlock * blocksPerDay,
        }
      }

      return rewards
    }

    const rewards = getRewards()

    const balance =
      swapPair || arrayToken ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals

    const tvl = swapPair ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD) : balance * 0.25

    let feeApyPerYear =
      swapPair && pool.chef !== Chef.MASTERCHEF_STATIC
        ? aprToApy((((((pair?.volumeUSD - pair1w?.volumeUSD) * 0.0025) / 7) * 365) / pair?.reserveUSD) * 100, 3650) /
        100
        : 0

    if (isNaN(feeApyPerYear)) feeApyPerYear = 0

    const feeApyPerMonth = feeApyPerYear / 12
    const feeApyPerDay = feeApyPerMonth / 30
    const feeApyPerHour = feeApyPerDay / blocksPerHour

    const roiPerBlock =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
      }, 0) / tvl

    const rewardAprPerHour = roiPerBlock * blocksPerHour
    const rewardAprPerDay = rewardAprPerHour * 24
    const rewardAprPerMonth = rewardAprPerDay * 30
    const rewardAprPerYear = rewardAprPerMonth * 12

    const roiPerHour = rewardAprPerHour + feeApyPerHour
    const roiPerMonth = rewardAprPerMonth + feeApyPerMonth
    const roiPerDay = rewardAprPerDay + feeApyPerDay
    const roiPerYear = rewardAprPerYear + feeApyPerYear

    const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)

    return {
      ...pool,
      ...position,
      pair: {
        ...pair,
        decimals: pair?.type === PairType.KASHI ? Number(pair.asset.tokenInfo.decimals) : 18,
        type,
        token: arrayToken,
      },
      balance,
      feeApyPerHour,
      feeApyPerDay,
      feeApyPerMonth,
      feeApyPerYear,
      rewardAprPerHour,
      rewardAprPerDay,
      rewardAprPerMonth,
      rewardAprPerYear,
      roiPerBlock,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
    }
  }

  const allFarms = farms
    .filter((farm) => {
      return (
        (swapPairs && swapPairs.find((pair) => pair.id === farm.pair)) ||
        (kashiPairs && kashiPairs.find((pair) => pair.id === farm.pair)) ||
        (BSAEX[chainId]?.address && getAddress(farm.pair) === getAddress(BSAEX[chainId]?.address))
      )
    })


  const farmsData = useMemo(() => {
    return allFarms.map(map);
  }, [allFarms]);

  const totalTVL = useMemo(() => {
    return farmsData.reduce((accumulator, farm) => {
      return accumulator + farm.tvl;
    }, 0);
  }, [farmsData]);



  return { farmsData, totalTVL }
}
