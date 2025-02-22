import { Currency, CurrencyAmount, Pair, Percent, Token } from '@devdot/basex-sdk'
import React, { ReactNode, useCallback, useState } from 'react'
import { classNames, formatCurrencyAmount } from '../../functions'

import { ChevronDownIcon } from '@heroicons/react/outline'
import CurrencySearchModal from '../../modals/SearchModal/CurrencySearchModal'
import Lottie from 'lottie-react'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react' 
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import CurrencyLogo from '../../components/CurrencyLogo'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { FiatValue } from '../../components/CurrencyInputPanel/FiatValue'
import { useUSDCValue } from '../../hooks/useUSDCPrice'

interface CurrencyInputPanelProps {
  value?: string
  onUserInput?: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  currencyBalance: CurrencyAmount<Currency> | null
  fiatValue?: CurrencyAmount<Token> | null
  currency?: Currency | null
  hideBalance?: boolean
  hideInput?: boolean
  hideIcon?: boolean
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  currency,
  id,
  currencyBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  hideInput = false,
  hideIcon = false,
}: CurrencyInputPanelProps) {
  const { i18n } = useLingui()

  return (
    <div id={id} className={classNames(hideInput ? 'p-2' : 'p-3', 'rounded bg-[#02020333]')}>
      <div className="flex space-y-2 flex-col justify-center items-center ">
        {!hideIcon && (
          <div className="flex">
            {currency ? (
              <div className="flex items-center">
                <CurrencyLogo currency={currency} size={'30px'} />
                <h3 className="font-bold text-[20px] ml-3">{currency.symbol}</h3>
              </div>
            ) : (
              <div className="rounded bg-dark-700" style={{ maxWidth: 54, maxHeight: 54 }}>
                <div style={{ width: 54, height: 54 }} className='flex justify-center items-center w-full h-full'>
                  <BsCoin size={"40px"} />
                </div>
              </div>
            )}
          </div>
        )}

        {!hideInput && (
          <div className={'flex flex-grow items-center w-full space-x-3 rounded focus:bg-dark-700 p-3 bg-[#446cfd0d]'}>
            <>
              {showMaxButton && currencyBalance && (
                <Button
                  onClick={onMax}
                  size="xs"
                  className="text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap w-auto order-1 ml-2"
                >
                  {i18n._(t`Max`)}
                </Button>
              )}
              <Input.Numeric
                id="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {!hideBalance && currency && currencyBalance ? (
                <div className="flex flex-col">
                  <div onClick={onMax} className="text-xs font-medium text-right cursor-pointer text-low-emphesis">
                    {formatCurrencyAmount(currencyBalance, 4)} {currency?.symbol}
                  </div>
                  <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
                </div>
              ) : null}
            </>
          </div>
        )}
      </div>
    </div>
  )
}
