import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ChainId } from '@devdot/basex-sdk'

export const client = {
  [ChainId.MOONRIVER]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/array-inc/array-exchange',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
}

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/index-node/graphql',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const blockClient = {
  [ChainId.MOONRIVER]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-blocks',
    }),
    cache: new InMemoryCache(),
  }),
}
