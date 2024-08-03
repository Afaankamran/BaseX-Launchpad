import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Settings from '../../components/Settings'
import PoolAddLiquidity from './PoolAddLiquidity'
import PoolRemoveLiquidity from './PoolRemoveLiquidity'
import { useCurrency } from '../../hooks/Tokens'
import { ChainId } from '@devdot/basex-sdk'
import { useActiveWeb3React } from '../../hooks'

const ManageSwapPair = ({ farm }) => {
  const { chainId } = useActiveWeb3React()
  const [toggle, setToggle] = useState(true)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between pb-2">
        <Switch.Group>
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
            <Switch.Label className="ml-3">
              {toggle ? i18n._(t`Add Liquidity`) : i18n._(t`Remove Liquidity`)}
            </Switch.Label>
          </div>
        </Switch.Group>
        <Settings />
      </div>
      {toggle ? (
        <PoolAddLiquidity currencyA={token0} currencyB={token1} />
      ) : (
        <PoolRemoveLiquidity currencyA={token0} currencyB={token1} />
      )}
    </div>
  )
}

export default ManageSwapPair
