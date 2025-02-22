import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    console.error(error)
    console.log({ listeningAddress: address })
    invariant(false, `${address} is not a valid address.`)
  }
}
