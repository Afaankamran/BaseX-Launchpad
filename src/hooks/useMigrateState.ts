import { useCallback, useEffect, useState } from 'react'
import useLPTokensState, { LPTokensState } from './useLPTokensState'
import usearrayRoll from './useAlphaRoll'
import { useActiveWeb3React } from '../hooks'
import { useIsTransactionPending, useTransactionAdder } from '../state/transactions/hooks'
import { parseUnits } from '@ethersproject/units'

export type MigrateMode = 'permit' | 'approve'

export interface MigrateState extends LPTokensState {
  amount: string
  setAmount: (amount: string) => void
  mode?: MigrateMode
  setMode: (_mode?: MigrateMode) => void
  onMigrate: () => Promise<void>
  pendingMigrationHash: string | null
  isMigrationPending: boolean
}

const useMigrateState: () => MigrateState = () => {
  const { library, account } = useActiveWeb3React()
  const state = useLPTokensState()
  const { migrate, migrateWithPermit } = usearrayRoll()
  const [mode, setMode] = useState<MigrateMode>()
  const [amount, setAmount] = useState('')
  const addTransaction = useTransactionAdder()
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

  useEffect(() => {
    state.setSelectedLPToken(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const onMigrate = useCallback(async () => {
    if (mode && state.selectedLPToken && account && library) {
      const units = parseUnits(amount || '0', state.selectedLPToken.decimals)
      const func = mode === 'approve' ? migrate : migrateWithPermit
      const tx = await func(state.selectedLPToken, units)

      addTransaction(tx, { summary: `Migrate Solarbeam ${state.selectedLPToken.symbol} liquidity to BaseX` })
      setPendingMigrationHash(tx.hash)

      await tx.wait()
      state.setSelectedLPToken(undefined)
      await state.updateLPTokens()
    }
  }, [mode, state, account, library, amount, migrate, migrateWithPermit, addTransaction])

  return {
    ...state,
    amount,
    setAmount,
    mode,
    setMode,
    onMigrate,
    pendingMigrationHash,
    isMigrationPending,
  }
}
export default useMigrateState
