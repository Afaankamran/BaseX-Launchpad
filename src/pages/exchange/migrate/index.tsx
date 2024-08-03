import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Container from '../../../components/Container'
import Head from 'next/head'
import DoubleGlowShadow from '../../../components/DoubleGlowShadow'
import { AutoColumn } from '../../../components/Column'
import { AutoRow } from '../../../components/Row'
import QuestionHelper from '../../../components/QuestionHelper'
import Back from '../../../components/Back'
import Typography from '../../../components/Typography'
import Web3Connect from '../../../components/Web3Connect'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import Dots from '../../../components/Dots'
import useMigrateState, { MigrateState } from '../../../hooks/useMigrateState'
import FixedHeightRow, { RowFixed } from '../../../components/Row'
import CloseIcon from '../../../components/CloseIcon'
import { ChevronRight } from 'react-feather'
import styled from 'styled-components'
import JSBI from 'jsbi'
import DoubleCurrencyLogo from '../../../components/DoubleLogo'
import { useCallback, useEffect, useState } from 'react'
import { CustomLightSpinner } from '../../../components/CustomLightSpinner'
import { formatUnits, parseUnits } from '@ethersproject/units'
import Input from '../../../components/Input'
import Button, { ButtonConfirmed } from '../../../components/Button'
import { ApprovalState, useApproveCallback, usearrayRollContract } from '../../../hooks'
import { Currency, CurrencyAmount, Token, Percent, ChainId } from '@devdot/basex-sdk'
import { tryParseAmount } from '../../../functions'
import { LPToken } from '../../../hooks/useLPTokensState'

const Border = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  background-color: ${({ theme }) => theme.bg2};
`
const ZERO = JSBI.BigInt(0)

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export default function Migrate() {
  const { account, chainId } = useActiveWeb3React()
  const state = useMigrateState()

  const { i18n } = useLingui()
  return (
    <Container id="swap-page" className="w-full max-w-lg py-4 space-y-6 md:py-8 lg:py-12">
      <Head>
        <title>{i18n._(t`BaseX`)} | BaseX</title>
        <meta
          key="description"
          name="description"
          content="BaseX allows for swapping of ERC20 compatible tokens across multiple networks"
        />
      </Head>
      <DoubleGlowShadow>
        <div className="p-4 space-y-4 rounded-[15px] border border-border-color bg-dark-900">
          <AutoColumn gap="16px">
            <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
              <Back />
              <Typography component="h1" variant="h3">
                {`Migrate ${chainId === ChainId.MATIC ? 'Quickswap' : 'Solarbeam'} Liquidity`}
              </Typography>
              <QuestionHelper
                text={`Migrate your ${chainId === ChainId.MATIC ? 'Quickswap' : 'Solarbeam'
                  } LP tokens to BaseX LP tokens.`}
              />
            </AutoRow>
          </AutoColumn>

          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : state.loading ? (
            <div className="p-3 mt-3 space-y-4 text-center rounded bg-dark-800 ">
              <Dots>Loading</Dots>
            </div>
          ) : (
            <>
              <MigrateModeSelect state={state} />
              <SolarbeamLiquidityPairs state={state} />
              <AmountInput state={state} />
              <MigrateButtons state={state} />
            </>
          )}
        </div>
      </DoubleGlowShadow>
    </Container>
  )
}

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
  const unsetMode = () => state.setMode(undefined)

  const items = [
    {
      key: 'permit',
      text: 'Non-hardware Wallet',
      description: 'Migration is done in one-click using your signature(permit)',
    },
    { key: 'approve', text: 'Hardware Wallet', description: 'You need to first approve LP tokens and then migrate it' },
  ]

  return (
    <>
      <Typography variant="sm" weight={700} style={{ justifySelf: 'flex-start' }}>
        Your Wallet
      </Typography>
      {items.reduce((acc: any, { key, text, description }: any) => {
        if (state.mode === undefined || key === state.mode)
          acc.push(
            <div className="p-3 space-y-4 text-center rounded cursor-pointer bg-dark-800" key={key}>
              <div className="flex">
                <div className="flex w-full">
                  <AutoRow onClick={() => state.setMode(key)}>
                    <AutoRow marginBottom="2px">
                      <Typography>{text}</Typography>
                    </AutoRow>
                    <AutoRow>
                      <Typography variant="xs" className="text-gray-500">
                        {description}
                      </Typography>
                    </AutoRow>
                  </AutoRow>
                  <div className="flex items-center">
                    {key === state.mode ? <CloseIcon onClick={unsetMode} /> : <ChevronRight onClick={unsetMode} />}
                  </div>
                </div>
              </div>
            </div>
          )
        return acc
      }, [])}
      <Border />
    </>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
      <Typography>{message}</Typography>
    </AutoColumn>
  )
}

const SolarbeamLiquidityPairs = ({ state }: { state: MigrateState }) => {
  const { chainId } = useActiveWeb3React()
  let content: JSX.Element
  const onClick = useCallback(
    (lpToken) => {
      state.setAmount('')
      state.setSelectedLPToken(lpToken)
    },
    [state]
  )

  const onDismiss = useCallback(
    (e) => {
      e.stopPropagation()
      state.setAmount('')
      state.setSelectedLPToken(undefined)
    },
    [state]
  )

  if (!state.mode) {
    content = <span />
  } else if (state.lpTokens.length === 0) {
    content = <EmptyState message="No Liquidity found." />
  } else {
    content = (
      <>
        <Typography style={{ justifySelf: 'flex-start' }}>
          Your {chainId === ChainId.MATIC ? 'Quickswap' : 'Solarbeam'} Liquidity
        </Typography>

        {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
          if (lpToken.balance && JSBI.greaterThan(lpToken.balance.quotient, JSBI.BigInt(0))) {
            acc.push(
              <LPTokenSelect
                lpToken={lpToken}
                key={lpToken.address}
                onClick={onClick}
                onDismiss={onDismiss}
                isSelected={state.selectedLPToken === lpToken}
                updating={state.updatingLPTokens}
              />
            )
          }
          return acc
        }, [])}
        <Border />
      </>
    )
  }

  return <>{content}</>
}

interface PositionCardProps {
  lpToken: LPToken
  onClick: (lpToken: LPToken) => void
  onDismiss: (e: Event) => void
  isSelected: boolean
  updating: boolean
}
const LPTokenSelect = ({ lpToken, onClick, onDismiss, isSelected, updating }: PositionCardProps) => {
  return (
    <div className="p-3 space-y-4 text-center rounded cursor-pointer bg-dark-800 " onClick={() => onClick(lpToken)}>
      <AutoColumn gap="12px">
        <FixedHeightRow className="items-center">
          <RowFixed onClick={() => onClick(lpToken)}>
            <DoubleCurrencyLogo currency0={lpToken.tokenA} currency1={lpToken.tokenB} margin={true} size={20} />
            <Typography className="text-white" weight={700} style={{ marginLeft: '10px' }}>
              {`${lpToken.tokenA.symbol}/${lpToken.tokenB.symbol}`}
            </Typography>
            <p className="px-2 py-1 ml-2 text-xs text-black rounded " style={{ background: '#FFE270' }}>
              V2
            </p>
          </RowFixed>
          <div className="ml-auto">
            {updating ? (
              <CustomLightSpinner src={'/blue-loader.svg'} alt="loader" size="20px" />
            ) : isSelected ? (
              <CloseIcon onClick={onDismiss} />
            ) : (
              <ChevronRight />
            )}
          </div>
        </FixedHeightRow>
      </AutoColumn>
    </div>
  )
}

const AmountInput = ({ state }: { state: MigrateState }) => {
  const { i18n } = useLingui()
  const onPressMax = useCallback(() => {
    if (state.selectedLPToken) {
      let balance = state.selectedLPToken.balance.quotient
      if (state.selectedLPToken.address === ZERO_ADDRESS) {
        // Subtract 0.01 ETH for gas fee
        const fee = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16))
        balance = JSBI.greaterThan(balance, fee) ? JSBI.subtract(balance, fee) : ZERO
      }

      state.setAmount(formatUnits(balance.toString(), state.selectedLPToken.decimals))
    }
  }, [state])

  useEffect(() => {
    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
      state.setAmount('')
    }
  }, [state])

  if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
    return <span />
  }

  return (
    <>
      <Typography style={{ justifySelf: 'flex-start' }}>Amount of Tokens</Typography>
      <div className="p-3 space-y-4 text-center rounded bg-dark-800 ">
        <FixedHeightRow>
          <Input.Numeric value={state.amount} onUserInput={(val) => state.setAmount(val)} />
          <Button
            onClick={onPressMax}
            size="xs"
            className="text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap"
          >
            {i18n._(t`Max`)}
          </Button>
        </FixedHeightRow>
      </div>
      <Border />
    </>
  )
}

interface MetamaskError {
  code?: any
  message?: string
}

const MigrateButtons = ({ state }: { state: MigrateState }) => {
  const { chainId } = useActiveWeb3React()
  const [error, setError] = useState<MetamaskError>({})
  const arrayRollContract = usearrayRollContract()
  const [approval, approve] = useApproveCallback(
    state.selectedLPToken?.balance as CurrencyAmount<Token>,
    arrayRollContract?.address
  )
  const noLiquidityTokens = !!state.selectedLPToken?.balance && state.selectedLPToken?.balance.equalTo(ZERO)
  const isButtonDisabled = !state.amount
  useEffect(() => {
    setError({})
  }, [state.selectedLPToken])

  if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
    return <span />
  }

  const insufficientAmount = JSBI.lessThan(
    state.selectedLPToken.balance.quotient,
    JSBI.BigInt(parseUnits(state.amount || '0', state.selectedLPToken.decimals).toString())
  )
  let percentToRemove: Percent = new Percent('0', '100')
  if (state?.selectedLPToken) {
    const independentAmount = tryParseAmount(state.amount, state?.selectedLPToken?.pair?.liquidityToken as Currency)
    if (
      independentAmount &&
      state?.selectedLPToken?.balance &&
      !independentAmount.greaterThan(state?.selectedLPToken?.balance.quotient)
    ) {
      percentToRemove = new Percent(independentAmount.quotient, state?.selectedLPToken?.balance.quotient)
    }
  }
  const tokenA = state?.selectedLPToken?.uniTokenA,
    tokenB = state?.selectedLPToken?.uniTokenB,
    liquidityValueA = state?.selectedLPToken?.liquidityValueA,
    liquidityValueB = state?.selectedLPToken?.liquidityValueB

  const parsedAmounts: {
    percent: Percent
    liquidityAmount?: CurrencyAmount<Currency>
    currencyAmountA?: CurrencyAmount<Currency>
    currencyAmountB?: CurrencyAmount<Currency>
  } = {
    percent: percentToRemove,
    liquidityAmount:
      state?.selectedLPToken?.balance && percentToRemove && percentToRemove.greaterThan('0')
        ? CurrencyAmount.fromRawAmount(
          state?.selectedLPToken?.pair.liquidityToken as Currency,
          percentToRemove.multiply(state?.selectedLPToken?.balance.quotient).quotient
        )
        : undefined,
    currencyAmountA:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? CurrencyAmount.fromRawAmount(tokenA, percentToRemove.multiply(liquidityValueA.quotient).quotient)
        : undefined,
    currencyAmountB:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? CurrencyAmount.fromRawAmount(tokenB, percentToRemove.multiply(liquidityValueB.quotient).quotient)
        : undefined,
  }
  const onPress = async () => {
    setError({})
    try {
      await state.onMigrate()
    } catch (e) {
      console.log(e)
      setError(e)
    }
  }

  return (
    <AutoColumn gap="20px">
      <div className="p-3 space-y-4 text-center rounded bg-dark-800 ">
        <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Typography>{state.selectedLPToken.symbol}</Typography>
          <Typography>{state.amount}</Typography>
        </AutoRow>
        <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Typography>{state?.selectedLPToken?.tokenA?.symbol}</Typography>
          <Typography>{parsedAmounts?.currencyAmountA?.toSignificant(6)}</Typography>
        </AutoRow>
        <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Typography>{state?.selectedLPToken?.tokenB?.symbol}</Typography>
          <Typography>{parsedAmounts?.currencyAmountB?.toSignificant(6)}</Typography>
        </AutoRow>
        <AutoRow style={{ flex: '1', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Typography>Percent</Typography>
          <Typography>{parsedAmounts?.percent?.toSignificant(6)}%</Typography>
        </AutoRow>
        {insufficientAmount ? (
          <AutoColumn gap="12px" style={{ flex: '1' }}>
            <Typography style={{ textAlign: 'center' }}>Insufficient Balance</Typography>
          </AutoColumn>
        ) : state.loading ? (
          <Dots>Loading</Dots>
        ) : (
          <AutoRow>
            {state.mode === 'approve' && (
              <AutoColumn gap="12px" style={{ flex: '1', marginRight: 12 }}>
                <ButtonConfirmed
                  size="sm"
                  onClick={approve}
                  confirmed={approval === ApprovalState.APPROVED}
                  disabled={approval !== ApprovalState.NOT_APPROVED || isButtonDisabled}
                // altDisabledStyle={approval === ApprovalState.PENDING}
                >
                  {approval === ApprovalState.PENDING ? (
                    <Dots>Approving</Dots>
                  ) : approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                    'Approve'
                  )}
                </ButtonConfirmed>
              </AutoColumn>
            )}
            <AutoColumn gap="12px" style={{ flex: '1' }}>
              <ButtonConfirmed
                size="sm"
                disabled={
                  noLiquidityTokens ||
                  state.isMigrationPending ||
                  (state.mode === 'approve' && approval !== ApprovalState.APPROVED) ||
                  isButtonDisabled
                }
                onClick={onPress}
              >
                {state.isMigrationPending ? <Dots>Migrating</Dots> : 'Migrate'}
              </ButtonConfirmed>
            </AutoColumn>
          </AutoRow>
        )}
        {error.message && error.code !== 4001 && (
          <Typography className="mt-1 text-center text-red-600">{error.message}</Typography>
        )}
      </div>
      <Typography className="text-center">
        {`Your ${chainId === ChainId.MATIC ? 'Quickswap' : 'Solarbeam'} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol
          } liquidity will become BaseX ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol
          } liquidity.`}
      </Typography>
    </AutoColumn>
  )
}
