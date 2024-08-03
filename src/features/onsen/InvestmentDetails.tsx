import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Image from '../../components/Image'
import React, { useState } from 'react'
// import { useKashiPair } from '../kashi/context'
import { useActiveWeb3React } from '../../hooks'
import { CurrencyAmount, JSBI, Token, USDC, ZERO } from '@devdot/basex-sdk'
import { getAddress } from '@ethersproject/address'
import { Chef, PairType } from './enum'
import { usePendingSushi, useUserInfo } from './hooks'
import { easyAmount, formatNumber } from '../../functions'
import { BigNumber } from '@ethersproject/bignumber'
import usePendingReward from './usePendingReward'
import CurrencyLogo from '../../components/CurrencyLogo'
import useMasterChef from './useMasterChef'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import { useCurrency } from '../../hooks/Tokens'
import Typography from '../../components/Typography'
import { Box } from '@mui/material'

const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()


  const { harvest, withdraw } = useMasterChef(farm.chef, farm)

  const router = useRouter()

  const addTransaction = useTransactionAdder()

  // const kashiPair = useKashiPair(farm.pair.id)
  const kashiPair = null

  const [pendingTx, setPendingTx] = useState(false)

  const token0 = useCurrency(farm?.pair?.token0?.id)
  const token1 = useCurrency(farm?.pair?.token1?.id)
  const token = useCurrency(farm?.pair?.token?.address)
  const isStaticFarm = farm.chef == Chef.MASTERCHEF_STATIC
  const isNFTStake = farm.chef == Chef.MASTERCHEF_ARRAY_NFT
  const isPairNft = farm.chef == Chef.MASTERCHEF_PAIR_NFT

  const liquidityToken =
    isStaticFarm || isNFTStake
      ? farm.pair.token
      : new Token(
        chainId,
        getAddress(farm.pair.id),
        farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
        farm.pair.symbol ?? farm.pair.type === PairType.KASHI ? 'KMP' : 'BaseX LP',
        farm.pair.name
      )

  const { stakedAmount, unlockTime, isUnlocked, rewardDebted } = useUserInfo(farm, liquidityToken)




  const kashiAssetAmount =
    kashiPair &&
    stakedAmount &&
    easyAmount(
      BigNumber.from(stakedAmount?.quotient?.toString()).mulDiv(
        kashiPair.currentAllAssets.value,
        kashiPair.totalAsset.base
      ),
      kashiPair.asset
    )

  const pendingReward = usePendingReward(farm)
  const pendingSushi = usePendingSushi(farm)
  const positionFiatValue = CurrencyAmount.fromRawAmount(
    USDC[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiAssetAmount?.usdValue?.toString() ?? ZERO
      : JSBI.BigInt(
        ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
          .toFixed(USDC[chainId].decimals)
          .toBigNumber(USDC[chainId].decimals)
      )
  )

  console.log({ farmReward: farm })


  const rewardValue =
    (farm?.rewards?.[0]?.rewardPrice ?? 0) * Number(pendingSushi?.toExact() ?? 0) +
    (farm?.rewards?.[1]?.rewardPrice ?? 0) * Number(pendingReward ?? 0)

  async function onHarvest() {
    setPendingTx(true)
    try {
      const tx = await harvest(farm.id)
      addTransaction(tx, {
        summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1.name}`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }
  async function onWithdraw() {
    setPendingTx(true)
    try {
      let tx = await withdraw(farm.id, BigNumber.from(0))
      addTransaction(tx, {
        summary:
          isStaticFarm || isNFTStake
            ? i18n._(t`Withdraw ${liquidityToken.name}`)
            : i18n._(t`Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between font-bold">
          <div className="text-lg cursor-pointer">{i18n._(t`Your Deposits`)}:</div>

          <Typography className="font-bold">
            {formatNumber(stakedAmount?.toSignificant(6) ?? 0)} &nbsp;
            {isStaticFarm || isNFTStake ? (
              token.symbol
            ) : (
              <>
                {farm.pair.token0.symbol}-{farm.pair.token1.symbol} &nbsp; {liquidityToken.symbol}
              </>
            )}
          </Typography>
        </div>
        <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        {!isStaticFarm && !isNFTStake && (
          <div className="flex justify-between">
            <div className="flex flex-col justify-center space-y-2">
              <div className="flex items-center space-x-2">
                <CurrencyLogo currency={token0} size="30px" />
                {farm.pair.type === PairType.KASHI && (
                  <Typography>
                    {formatNumber(kashiAssetAmount?.value.toFixed(kashiPair.asset.tokenInfo.decimals) ?? 0)}
                  </Typography>
                )}
                {farm.pair.type === PairType.SWAP && (
                  <Typography>
                    {formatNumber((farm.pair.reserve0 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                  </Typography>
                )}
                <Typography>{token0?.symbol}</Typography>
              </div>
              {farm.pair.type === PairType.SWAP && (
                <div className="flex items-center space-x-2">
                  <CurrencyLogo currency={token1} size="30px" />
                  <Typography>
                    {formatNumber((farm.pair.reserve1 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                  </Typography>
                  <Typography>{token1?.symbol}</Typography>
                </div>
              )}
            </div>
            <Typography>{formatNumber(positionFiatValue?.toSignificant(6) ?? 0, true)}</Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between">
          <div className='flex justify-between items-center w-full'>

            <div className="text-lg font-bold cursor-pointer">{i18n._(t`Total Rewards`)}:</div>
            <Typography>{formatNumber(rewardValue, true)}</Typography>
          </div>
          {((pendingSushi && pendingSushi.greaterThan(ZERO)) || (pendingReward && Number(pendingReward) > 0)) &&
            farm.chef !== Chef.MASTERCHEF_STATIC &&
            !isNFTStake &&
            !isPairNft && (
              <button
                className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
                disabled={pendingTx}
                onClick={onHarvest}
              >
                {i18n._(t`Harvest Rewards`)}
              </button>
            )}
        </div>
        <div className="w-full bg-transparent border border-b-0 border-transparent rounded h-0font-bold text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="">
          {!isNFTStake && !isPairNft ? (
            <div className="flex flex-col space-y-2">
              {farm?.rewards?.map((reward, i) => {

                const arrayReward = formatNumber((farm?.rewards?.rewardPrice * Number(pendingSushi?.toExact() ?? 0)), true);
                const tokenReward = formatNumber((farm?.rewards?.rewardPrice * Number(pendingReward ?? 0)), true);
                return <div key={i} className="flex items-center justify-between space-x-2">
                  <div className='flex items-center space-x-2'>

                    <Image
                      src={reward.icon}
                      width="30px"
                      height="30px"
                      className="rounded-md"
                      layout="fixed"
                      alt={reward.token}
                    />
                    {i === 0 && <Typography>{formatNumber(pendingSushi?.toSignificant(6) ?? 0)}</Typography>}
                    {i === 1 && <Typography>{formatNumber(pendingReward)}</Typography>}
                    <Typography>{reward.token}</Typography>
                  </div>

                  <Typography>{i === 0 ? arrayReward : i === 1 ? tokenReward : 0}</Typography>

                </div>
              })}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {farm.nftRewards.map((reward) => {
                return (
                  <div className="flex items-center space-x-2">
                    {rewardDebted && <Typography>{rewardDebted?.toString()}</Typography>}
                    <Typography>{reward?.symbol}</Typography>
                  </div>
                )
              })}
            </div>
          )}

          {/* <Typography>{formatNumber(rewardValue, true)}</Typography> */}
        </div>
      </div>
      {(farm.chef === Chef.MASTERCHEF_STATIC || isNFTStake || isPairNft) &&
        stakedAmount?.greaterThan(ZERO) &&
        unlockTime && (
          <div className="flex flex-col w-full space-y-4">
            <div className="flex items-end justify-between">
              <div className="text-lg font-bold cursor-pointer">{i18n._(t`Unlock Time`)}:</div>
              <div>{new Date(unlockTime).toLocaleString()}</div>
              <button
                className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
                disabled={pendingTx || isUnlocked}
                onClick={onWithdraw}
              >
                {isUnlocked ? <>{i18n._(t`Locked`)}</> : <>{i18n._(t`Withdraw`)}</>}
              </button>
            </div>
            <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
            <div className="flex justify-between"></div>
          </div>
        )}
      {farm.pair.type === PairType.KASHI && (
        <Button
          size="sm"
          className="font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
          onClick={() => router.push(`/lend/${farm.pair.id}`)}
        >
          {i18n._(t`View Details on Kashi`)}
        </Button>
      )}
    </div>
  )
}

export default InvestmentDetails
