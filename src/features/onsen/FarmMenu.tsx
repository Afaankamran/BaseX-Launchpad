import { ChainId } from '@devdot/basex-sdk'
import NavLink from '../../components/NavLink'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'

const Menu = ({ positionsLength }) => {
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  return (
    <div className="space-y-4">
      {account ? (
        <NavLink
          exact
          href={`/farm?filter=portfolio`}
          activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            Your Farms
          </a>
        </NavLink>
      ) : (
        <a
          className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer striped-background text-secondary bg-dark-900 hover:bg-dark-800"
          onClick={toggleWalletModal}
        >
          Your Farms
        </a>
      )}

      <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20" />

      <NavLink
        exact
        href="/farm"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          All Farms
        </a>
      </NavLink>
      {(chainId === ChainId.MOONRIVER || chainId === ChainId.ROPSTEN) && (
        <>
          <NavLink
            exact
            href={`/farm?filter=static`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              Static Farms
            </a>
          </NavLink>
          <NavLink
            exact
            href={`/farm?filter=basex`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              BASEX Farms
            </a>
          </NavLink>
        </>
      )}
      {chainId === ChainId.MAINNET && (
        <>
          <NavLink
            exact
            href={`/farm?filter=kashi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              Kashi Farms
            </a>
          </NavLink>
          <NavLink
            exact
            href={`/farm?filter=sushi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              BASEX Farms
            </a>
          </NavLink>
        </>
      )}

      {(chainId === ChainId.MAINNET || chainId === ChainId.MOONRIVER) && (
        <NavLink
          exact
          href={`/farm?filter=2x`}
          activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            BaseX Farms v2
          </a>
        </NavLink>
      )}
    </div>
  )
}

export default Menu
