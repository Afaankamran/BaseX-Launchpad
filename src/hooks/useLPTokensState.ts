import { useDashboard2Contract, useDashboardContract, useUniV2FactoryContract } from './useContract'
import { UNI_FACTORY_ADDRESSES, useActiveWeb3React } from '.'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { Currency, CurrencyAmount, Token, ChainId, Pair } from '@devdot/basex-sdk'

let LP_TOKENS_LIMIT = 100
export interface LPToken {
  id?: number
  address: string
  tokenA: Token
  tokenB: Token
  totalSupply: ethers.BigNumber
  balance: CurrencyAmount<Currency>
  name?: string
  symbol?: string
  decimals?: number
  pair?: Pair
  liquidityValueA?: CurrencyAmount<Token>
  liquidityValueB?: CurrencyAmount<Token>
  uniTokenA?: Token
  uniTokenB?: Token
}

export interface LPTokensState {
  updateLPTokens: () => Promise<void>
  lpTokens: LPToken[]
  selectedLPToken?: LPToken
  setSelectedLPToken: (token?: LPToken) => void
  selectedLPTokenAllowed: boolean
  setSelectedLPTokenAllowed: (allowed: boolean) => void
  loading: boolean
  updatingLPTokens: boolean
}

const useLPTokensState = () => {
  const { account, chainId } = useActiveWeb3React()
  const factoryContract = useUniV2FactoryContract(chainId)
  const dashboardContract = useDashboardContract()
  const dashboard2Contract = useDashboard2Contract()
  const [lpTokens, setLPTokens] = useState<LPToken[]>([])
  const [selectedLPToken, setSelectedLPToken] = useState<LPToken>()
  const [selectedLPTokenAllowed, setSelectedLPTokenAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const updatingLPTokens = useRef(false)

  const updateLPTokens = useCallback(async () => {
    updatingLPTokens.current = false
    try {
      if (chainId === ChainId.MATIC) {
        LP_TOKENS_LIMIT = 1000
      }
      const length = await factoryContract?.allPairsLength()
      const pages: number[] = []
      for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i)

      const userLP = (
        await Promise.all(
          pages.map((page) =>
            dashboardContract?.findPairs(
              account,
              UNI_FACTORY_ADDRESSES[chainId],
              page,
              Math.min(page + LP_TOKENS_LIMIT, length.toNumber())
            )
          )
        )
      ).flat()
      const tokenDetails = (
        await dashboardContract?.getTokenInfo(
          Array.from(new Set(userLP.reduce((a: any, b: any) => a.push(b.token, b.token0, b.token1) && a, [])))
        )
      ).reduce((acc: any, cur: any) => {
        acc[cur[0]] = cur
        return acc
      }, {})

      const balances = (
        await dashboardContract?.findBalances(
          account,
          userLP.map((pair) => pair.token)
        )
      ).map((el: any) => el.balance)
      const userLPDetails = (
        await dashboard2Contract?.getPairsFull(
          account,
          userLP.map((pair) => pair.token)
        )
      ).reduce((acc: any, cur: any) => {
        acc[cur[0]] = cur
        return acc
      }, {})

      const data = await Promise.all(
        userLP.map(async (pair, index) => {
          const { totalSupply } = userLPDetails[pair.token]
          const token = new Token(
            chainId as ChainId,
            tokenDetails[pair.token].token,
            tokenDetails[pair.token].decimals.toNumber(),
            tokenDetails[pair.token].symbol,
            tokenDetails[pair.token].name
          )
          const t0 = tokenDetails[pair.token0],
            tokenA = new Token(chainId as ChainId, t0.token, t0.decimals.toNumber(), t0.symbol, t0.name)
          const t1 = tokenDetails[pair.token1],
            tokenB = new Token(chainId as ChainId, t1.token, t1.decimals.toNumber(), t1.symbol, t1.name)
          const LiquidityPair = new Pair(
            CurrencyAmount.fromRawAmount(tokenA as any, userLPDetails[pair.token].reserve0.toString()),
            CurrencyAmount.fromRawAmount(tokenB as any, userLPDetails[pair.token].reserve1.toString())
          )
          const userLiquidity = CurrencyAmount.fromRawAmount(LiquidityPair.liquidityToken as Token, balances[index])

          return {
            pair: LiquidityPair,
            address: pair.token,
            decimals: token.decimals,
            name: `${tokenA.symbol}-${tokenB.symbol} LP Token`,
            symbol: `${tokenA.symbol}-${tokenB.symbol}`,
            balance: CurrencyAmount.fromRawAmount(
              new Token(
                chainId as ChainId,
                tokenDetails[pair.token].token,
                tokenDetails[pair.token].decimals.toNumber(),
                tokenDetails[pair.token].symbol,
                tokenDetails[pair.token].name
              ),
              balances[index]
            ),
            totalSupply,
            tokenA: new Token(chainId as ChainId, t0.token, t0.decimals.toNumber(), t0.symbol, t0.name),
            tokenB: new Token(chainId as ChainId, t1.token, t1.decimals.toNumber(), t1.symbol, t1.name),
            uniTokenA: tokenA,
            uniTokenB: tokenB,
            liquidityValueA: CurrencyAmount.fromRawAmount(
              tokenA,
              LiquidityPair.getLiquidityValue(
                tokenA,
                CurrencyAmount.fromRawAmount(LiquidityPair.liquidityToken as Token, totalSupply),
                userLiquidity,
                false
              ).quotient
            ),
            liquidityValueB: CurrencyAmount.fromRawAmount(
              tokenB,
              LiquidityPair.getLiquidityValue(
                tokenB,
                CurrencyAmount.fromRawAmount(LiquidityPair.liquidityToken as Token, totalSupply),
                userLiquidity,
                false
              ).quotient
            ),
          } as LPToken
        })
      )
      if (data) setLPTokens(data)
    } finally {
      setLoading(false)
      updatingLPTokens.current = false
    }
  }, [factoryContract, dashboardContract, account, dashboard2Contract, chainId])

  useEffect(() => {
    if (account && factoryContract && dashboard2Contract && dashboardContract && chainId && !updatingLPTokens.current) {
      updateLPTokens()
    }
  }, [account, dashboard2Contract, dashboardContract, factoryContract, chainId, updateLPTokens])

  return {
    updateLPTokens,
    lpTokens,
    selectedLPToken,
    setSelectedLPToken,
    selectedLPTokenAllowed,
    setSelectedLPTokenAllowed,
    loading,
    updatingLPTokens: updatingLPTokens.current,
  }
}

export default useLPTokensState
