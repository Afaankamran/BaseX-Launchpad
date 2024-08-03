import { useActiveWeb3React, useSushiContract } from '../../hooks'

import { BigNumber } from '@ethersproject/bignumber'
import { Chef } from './enum'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useChefContract } from './hooks'

export default function useMasterChef(chef: Chef, farm) {
  const { account } = useActiveWeb3React()

  const sushi = useSushiContract()

  const contract = useChefContract(chef)
  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx
        if (chef === Chef.MASTERCHEF || chef == Chef.MASTERCHEF_V2 || chef === Chef.MASTERCHEF_STATIC) {
          tx = await contract?.deposit(pid, amount, account)
        } else if (chef === Chef.MASTERCHEF_ARRAY_NFT || chef === Chef.MASTERCHEF_PAIR_NFT) {
          const tier = farm.tiers.findIndex((tier) => amount.eq(tier.minAmount))

          tx = await contract?.deposit(pid, tier)
        } else {
          tx = await contract?.deposit(pid, amount)
        }

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx

        if (chef === Chef.MASTERCHEF || chef == Chef.MASTERCHEF_V2) {
          tx = await contract?.withdraw(pid, amount, account)
        } else if (
          chef === Chef.MASTERCHEF_STATIC ||
          chef === Chef.MASTERCHEF_ARRAY_NFT ||
          chef === Chef.MASTERCHEF_PAIR_NFT
        ) {
          tx = await contract?.withdraw(pid)
        } else {
          tx = await contract?.withdraw(pid, amount, account)
        }

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  const harvest = useCallback(
    async (pid: number) => {
      try {
        let tx
        tx = await contract?.harvest(pid, account)
        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract, sushi]
  )

  return { deposit, withdraw, harvest }
}
