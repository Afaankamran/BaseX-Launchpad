import gql from 'graphql-tag'

export const staticPoolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      id
      pair
      durationOfPool
      rewardAPY
      balance
      userCount
      owner {
        id
      }
    }
  }
`

export const masterChefStaticPairAddressesQuery = gql`
  query masterChefStaticPairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      durationOfPool
      rewardAPY
      pair {
        id
      }
    }
  }
`
