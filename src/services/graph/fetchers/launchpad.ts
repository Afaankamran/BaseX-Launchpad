import { ChainId } from '@devdot/basex-sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'
import { launchpadPoolsQuery } from '../queries/launchpad'

export const LAUNCHPAD = {
  [ChainId.KOVAN]: 'muhammadwajidshahid/launchpadfactory',
}

export const launchpad = async (query, chainId = ChainId.MOONRIVER, variables = undefined) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${LAUNCHPAD[chainId]}`, query, variables)

export const getLaunchpadPools = async (variables = undefined) => {
  const { pools } = await launchpad(launchpadPoolsQuery, undefined, variables)
  return pools
}
