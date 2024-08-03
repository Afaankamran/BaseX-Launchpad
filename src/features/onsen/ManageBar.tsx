import React, { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Button, { ButtonError } from '../../components/Button'
import { classNames, fromWei, getUSDValue, tryParseAmount } from '../../functions'
import CurrencyInputPanel from './CurrencyInputPanel'
import Web3Connect from '../../components/Web3Connect'
import { ApprovalState, useActiveWeb3React, useApproveCallback } from '../../hooks'
import Dots from '../../components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import useMasterChef from './useMasterChef'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {
  ChainId,
  CurrencyAmount,
  JSBI,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  STATIC_FARM_ADDRESS,
  // MASTERCHEF_V2_ADDRESS,
  // MINICHEF_ADDRESS,
  Token,
  USDC,
  ZERO,
} from '@devdot/basex-sdk'
import { getAddress } from '@ethersproject/address'
import { Chef, PairType } from './enum'
// import { useKashiPair } from '../kashi/context'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useUserInfo } from './hooks'
import { LP_STAKING_NFT_ADDRESS, ARRAY_STAKING_ADDRESS } from '../../config'

const ManageBar = ({ farm }) => {
  const { account, chainId } = useActiveWeb3React()

  const [toggle, setToggle] = useState(true)

  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const { deposit, withdraw } = useMasterChef(farm.chef, farm)

  const addTransaction = useTransactionAdder()
  const isStaticFarm = farm.chef == Chef.MASTERCHEF_STATIC
  const isNFTStake = farm.chef == Chef.MASTERCHEF_ARRAY_NFT
  const isPairNft = farm.chef == Chef.MASTERCHEF_PAIR_NFT
  const nftMax = farm?.nftRewards?.[0]?.maxSupply ? Number(farm?.nftRewards[0]?.maxSupply) : 0
  const rewardDebted = farm?.pool?.rewardDebted ? Number(farm?.pool?.rewardDebted) : 0

  const liquidityToken =
    isStaticFarm || isNFTStake
      ? farm.pair.token
      : new Token(
        chainId,
        getAddress(farm.pair.id),
        farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
        farm.pair.type === PairType.KASHI ? 'KMP' : 'array LP'
      )
  const isExcedingNftMax =
    isNFTStake || isPairNft
      ? farm.tiers
        ? Number(
          farm.tiers.find(
            (tier) =>
              (tier?.minAmount && liquidityToken ? fromWei(tier?.minAmount, liquidityToken.decimals) : 0) ==
              depositValue && depositValue !== '0'
          )?.nfts ?? 0
        ) +
        rewardDebted >
        nftMax
        : false
      : false

  // const kashiPair = useKashiPair(farm.pair.id)
  const kashiPair = null

  const balance = useCurrencyBalance(account, liquidityToken)

  const { stakedAmount, isUnlocked } = useUserInfo(farm, liquidityToken)

  const balanceFiatValue = CurrencyAmount.fromRawAmount(
    USDC[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiPair && balance
        ? getUSDValue(
          BigNumber.from(balance.quotient.toString()).mulDiv(
            kashiPair.currentAllAssets.value,
            kashiPair.totalAsset.base
          ),
          kashiPair.asset
        ).toString()
        : ZERO
      : JSBI.BigInt(
        ((Number(balance?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
          .toFixed(USDC[chainId]?.decimals || 6)
          .toBigNumber(USDC[chainId]?.decimals || 6)
      )
  )

  const stakedAmountFiatValue = CurrencyAmount.fromRawAmount(
    USDC[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiPair && stakedAmount
        ? getUSDValue(
          BigNumber.from(stakedAmount.quotient.toString()).mulDiv(
            kashiPair.currentAllAssets.value,
            kashiPair.totalAsset.base
          ),
          kashiPair.asset
        ).toString()
        : ZERO
      : JSBI.BigInt(
        ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
          .toFixed(USDC[chainId]?.decimals || 6)
          .toBigNumber(USDC[chainId]?.decimals || 6)
      )
  )

  const parsedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const parsedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF]: {
      [ChainId.MOONRIVER]: MASTERCHEF_ADDRESS[ChainId.MOONRIVER],
      [ChainId.MOONBEAM]: MASTERCHEF_ADDRESS[ChainId.MOONBEAM],
      [ChainId.AVALANCHE_TESTNET]: MASTERCHEF_ADDRESS[ChainId.AVALANCHE_TESTNET],
      [ChainId.AVALANCHE]: MASTERCHEF_ADDRESS[ChainId.AVALANCHE],
      [ChainId.ARBITRUM_TESTNET]: MASTERCHEF_ADDRESS[ChainId.ARBITRUM_TESTNET],
      [ChainId.ARBITRUM]: MASTERCHEF_ADDRESS[ChainId.ARBITRUM],
    },
    [Chef.MASTERCHEF_STATIC]: {
      [ChainId.ROPSTEN]: STATIC_FARM_ADDRESS[ChainId.ROPSTEN],
      [ChainId.MOONRIVER]: STATIC_FARM_ADDRESS[ChainId.MOONRIVER],
    },
    [Chef.MASTERCHEF_V2]: {
      [ChainId.RINKEBY]: MASTERCHEF_V2_ADDRESS[ChainId.RINKEBY],
      [ChainId.MOONRIVER]: MASTERCHEF_V2_ADDRESS[ChainId.MOONRIVER],
      [ChainId.AVALANCHE_TESTNET]: MASTERCHEF_ADDRESS[ChainId.AVALANCHE_TESTNET],
      [ChainId.AVALANCHE]: MASTERCHEF_ADDRESS[ChainId.AVALANCHE],
      [ChainId.ARBITRUM]: MASTERCHEF_ADDRESS[ChainId.ARBITRUM],
      [ChainId.ARBITRUM_TESTNET]: MASTERCHEF_ADDRESS[ChainId.ARBITRUM_TESTNET],
    },
    [Chef.MASTERCHEF_ARRAY_NFT]: {
      [ChainId.RINKEBY]: ARRAY_STAKING_ADDRESS[ChainId.RINKEBY],
    },
    [Chef.MASTERCHEF_PAIR_NFT]: {
      [ChainId.RINKEBY]: LP_STAKING_NFT_ADDRESS[ChainId.RINKEBY],
    },
    // [Chef.MINICHEF]: {
    //   [ChainId.MATIC]: MINICHEF_ADDRESS[ChainId.MATIC],
    //   [ChainId.XDAI]: MINICHEF_ADDRESS[ChainId.XDAI],
    //   [ChainId.HARMONY]: MINICHEF_ADDRESS[ChainId.HARMONY],
    //   [ChainId.ARBITRUM]: MINICHEF_ADDRESS[ChainId.ARBITRUM],
    // },
  }

  const [approvalState, approve] = useApproveCallback(parsedDepositValue, APPROVAL_ADDRESSES[farm.chef][chainId])
  const depositError = !parsedDepositValue
    ? 'Enter an amount'
    : balance?.lessThan(parsedDepositValue)
      ? 'Insufficient balance'
      : undefined

  const isDepositValid = !depositError

  const withdrawError = !parsedWithdrawValue
    ? 'Enter an amount'
    : stakedAmount.lessThan(parsedWithdrawValue)
      ? 'Insufficient balance'
      : undefined

  const isWithdrawValid = !withdrawError
  const isLockedAmount = stakedAmount?.greaterThan(ZERO) && !isUnlocked && farm.chef == Chef.MASTERCHEF_STATIC
  const isStakedForNft = stakedAmount?.greaterThan(ZERO) && farm.chef == Chef.MASTERCHEF_ARRAY_NFT
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between pb-2">
        <Switch.Group>
          {!isStaticFarm && !isNFTStake && !isPairNft && (
            <div className="flex items-center">
              <Switch
                checked={toggle}
                onChange={() => setToggle(!toggle)}
                className={`${toggle ? 'bg-dark-blue' : 'bg-[#000] '
                  } bg-opacity-60   relative inline-flex items-center h-[32px] rounded-full w-[70px] transition-colors focus:outline-none`}
              >
                <span
                  className={`${toggle ? 'translate-x-[1px] text-blue' : 'translate-x-[39px] text-pink'
                    } inline-block w-7 h-7 transform bg-gradient-to-r from-opaque-blue to-opaque-pink rounded-full transition-transform`}
                >
                  {/* {toggle ? <PlusIcon /> : <MinusIcon />} */}
                </span>
              </Switch>
              <Switch.Label className="ml-3">{toggle ? i18n._(t`Deposit`) : i18n._(t`Withdraw`)}</Switch.Label>
            </div>
          )}
        </Switch.Group>
        {(!isStaticFarm || toggle) && !isNFTStake && !isPairNft && (
          <div className="flex justify-end space-x-4">
            {['25', '50', '75', '100'].map((multipler, i) => (
              <Button
                variant="outlined"
                size="xs"
                color={toggle ? 'blue' : 'pink'}
                key={i}
                onClick={() => {
                  toggle
                    ? setDepositValue(balance.multiply(multipler).divide(100).toExact())
                    : setWithdrawValue(stakedAmount.multiply(multipler).divide(100).toExact())
                }}
                className={classNames(
                  'text-md border border-opacity-50',
                  toggle ? 'focus:ring-blue border-blue' : 'focus:ring-pink border-pink',
                  multipler === '25' || multipler === '75' ? 'hidden sm:block' : ''
                )}
              >
                {multipler === '100' ? 'MAX' : multipler + '%'}
              </Button>
            ))}
          </div>
        )}
      </div>
      {toggle ? (
        <div className="flex flex-col space-y-4">
          {!isNFTStake && !isPairNft ? (
            <CurrencyInputPanel
              value={depositValue}
              currency={liquidityToken}
              id="add-liquidity-input-tokenb"
              hideIcon
              onUserInput={(value) => setDepositValue(value)}
              currencyBalance={balance}
              fiatValue={balanceFiatValue}
              showMaxButton={false}
            />
          ) : (
            <div className="flex justify-between flex-wrap w-full mb-10">
              {farm?.tiers.map((tier) => {
                return (
                  <Button
                    variant="outlined"
                    size="lg"
                    color="blue"
                    onClick={() => {
                      setDepositValue(
                        tier?.minAmount && liquidityToken ? fromWei(tier?.minAmount, liquidityToken.decimals) : '0'
                      )
                    }}
                    className={classNames(
                      'text-md m-4  border border-opacity-50',
                      'focus:ring-pink border-pink',
                      depositValue ===
                        (tier?.minAmount && liquidityToken ? fromWei(tier?.minAmount, liquidityToken.decimals) : '0') &&
                        depositValue !== '0'
                        ? 'border-opacity-100 bg-opacity-40'
                        : ''
                    )}
                  >
                    <h1 className="uppercase">{tier?.[0]}</h1>
                    <p>
                      Amount:{' '}
                      {tier?.minAmount && liquidityToken ? fromWei(tier?.minAmount, liquidityToken.decimals) : 0}{' '}
                      {liquidityToken?.symbol}
                    </p>
                    <p>Reward {tier?.nfts.toString()}</p>
                  </Button>
                )
              })}
            </div>
          )}
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : isDepositValid &&
            (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
            <Button
              color="gradient"
              size="lg"
              onClick={approve}
              disabled={approvalState !== ApprovalState.NOT_APPROVED}
            >
              {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)}</Dots> : i18n._(t`Approve`)}
            </Button>
          ) : (
            <ButtonError
              onClick={async () => {
                try {
                  // KMP decimals depend on asset, array LP is always 18
                  const tx = await deposit(farm.id, BigNumber.from(parsedDepositValue.quotient.toString()))
                  addTransaction(tx, {
                    summary:
                      isStaticFarm || isNFTStake
                        ? `Deposit ${liquidityToken.name}`
                        : `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
              disabled={!isDepositValid || isLockedAmount || isStakedForNft || isExcedingNftMax}
              error={!isDepositValid && !!parsedDepositValue}
            >
              {isExcedingNftMax && <>Pool Filled. Cannot Stake for this tier.</>}
              {!isExcedingNftMax && (
                <>{isStakedForNft ? 'You have already staked' : <>{depositError || i18n._(t`Confirm Deposit`)}</>}</>
              )}
            </ButtonError>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {(!isStaticFarm || !isNFTStake || !isPairNft) && (
            <CurrencyInputPanel
              value={withdrawValue}
              currency={liquidityToken}
              id="add-liquidity-input-tokenb"
              hideIcon
              onUserInput={(value) => setWithdrawValue(value)}
              currencyBalance={stakedAmount}
              fiatValue={stakedAmountFiatValue}
              showMaxButton={false}
            />
          )}
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : (
            <ButtonError
              onClick={async () => {
                try {
                  // KMP decimals depend on asset, array LP is always 18
                  const tx = await withdraw(farm.id, BigNumber.from(parsedWithdrawValue.quotient.toString()))
                  addTransaction(tx, {
                    summary:
                      isStaticFarm || isNFTStake
                        ? `Withdraw ${liquidityToken.name}`
                        : `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
              disabled={!isWithdrawValid || isLockedAmount}
              error={!isWithdrawValid && !!parsedWithdrawValue}
            >
              {withdrawError || i18n._(t`Confirm Withdraw`)}
            </ButtonError>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageBar
