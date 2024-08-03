import { ChainId, Currency, Token, currencyEquals } from '@devdot/basex-sdk'

import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import Button from '../../components/Button'
import { COMMON_BASES } from '../../config/routing'
import CurrencyLogo from '../../components/CurrencyLogo'
import QuestionHelper from '../../components/QuestionHelper'
import React from 'react'
import Typography from '../../components/Typography'
import { currencyId } from '../../functions'

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []

  return (
    <div className="flex flex-col space-y-2 bg-dark-blue p-3 border border-border-color rounded-[10px]">
      <div className="flex flex-row items-center">
        Common Bases
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </div>
      <div className="flex flex-wrap">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency)
          return (
            <Button
              variant="empty"
              type="button"
              onClick={() => !isSelected && onSelect(currency)}
              disabled={isSelected}
              key={currencyId(currency)}
              className="flex items-center justify-between px-2 py-1 m-1 space-x-2 rounded-[6px] bg-gradient-to-r from-opaque-blue to-opaque-pink hover:bg-dark-700 disabled:bg-dark-1000 disabled:cursor-not-allowed"
            >
              <div className="flex-shrink-0  rounded-full">
                <CurrencyLogo currency={currency} />
              </div>
              <Typography variant="sm" className="font-semibold">
                {currency.symbol}
              </Typography>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
