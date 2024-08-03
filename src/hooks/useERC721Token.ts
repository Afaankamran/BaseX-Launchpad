import { Token } from '@devdot/basex-sdk'
import { useMultipleCallMultipleResult, useMultipleContractSingleData } from '../state/multicall/hooks'
import { useMemo } from 'react'
import useActiveWeb3React from './useActiveWeb3React'
import { useERC721Contract } from './useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { Interface } from '@ethersproject/abi'
import ERC721_ABI from '../constants/abis/erc721.json'
// export default function userERC721Token(address: string): { token: Token; maxSupply: BigNumber } | null {
//   const { chainId } = useActiveWeb3React()
//   const tokenContract = useERC721Contract(address)
//   const tokenCalls = [
//     {
//       methodName: 'name',
//       callInputs: [],
//     },
//     {
//       methodName: 'symbol',
//       callInputs: [],
//     },
//     {
//       methodName: 'decimals',
//       callInputs: [],
//     },
//     {
//       methodName: 'maxSupply',
//       callInputs: [],
//     },
//   ]
//   const results = useMultipleCallMultipleResult(tokenContract, tokenCalls)

//   const tokenDetails = useMemo(() => {
//     return !results || results.length <= 0 || results.some((result) => result.loading)
//       ? undefined
//       : tokenCalls.reduce((acc, curr, i) => {
//           acc[curr.methodName] = results[i].result?.[0]
//           return acc
//         }, {} as any)
//   }, [results])

//   return tokenDetails
//     ? {
//         token: new Token(chainId, address, tokenDetails.decimals, tokenDetails.symbol, tokenDetails.name),
//         maxSupply: tokenDetails.maxSupply,
//       }
//     : null
// }

const ERC721Interface = new Interface(ERC721_ABI)
export type ERC721_Token = {
  name: string
  symbol: string
  maxSupply: BigNumber
}
export function useERC721Tokens(addresses: string[]): ERC721_Token[] {
  const { chainId } = useActiveWeb3React()
  const nameResults = useMultipleContractSingleData(addresses, ERC721Interface, 'name')
  const symbolResults = useMultipleContractSingleData(addresses, ERC721Interface, 'symbol')
  const maxSupplyResults = useMultipleContractSingleData(addresses, ERC721Interface, 'maxSupply')
  return useMemo(() => {
    if (
      nameResults.some((result) => result.loading) ||
      symbolResults.some((result) => result.loading) ||
      maxSupplyResults.some((result) => result.loading)
    ) {
      return []
    }
    return addresses.map((address, i) => {
      const name = nameResults[i].result?.[0]
      const symbol = symbolResults[i].result?.[0]
      const maxSupply = maxSupplyResults[i].result?.[0]
      return { name, symbol, maxSupply }
    })
  }, [chainId, addresses, nameResults, symbolResults])
}
