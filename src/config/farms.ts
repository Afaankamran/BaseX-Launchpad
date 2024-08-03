import { Movr, ChainId, Token, GLMR, USDC, Ether, Avalanche, Arbitrum } from '@devdot/basex-sdk'

const farmsV1 = {
  [ChainId.AVALANCHE_TESTNET]: [
    // {
    //   pid: 0,
    //   pairAddress: '0x5ba5b535f39ef8c5910d74bf0baced4fcde0a038',
    //   token0: Avalanche.onChain(ChainId.MOONRIVER),
    //   token1: new Token(
    //     ChainId.AVALANCHE_TESTNET,
    //     '0x5ba5b535f39ef8c5910d74bf0baced4fcde0a038',
    //     18,
    //     'akitax',
    //     'akitax'
    //   ),
    //   qouteToken: Avalanche.onChain(ChainId.AVALANCHE_TESTNET),
    // },
  ],
  [ChainId.ARBITRUM_TESTNET]: [ // TODO: need to add pair for arbitrum network
    {
      pid: 0,
      pairAddress: '0xb34e7f741923f1792c420237bf4542109b234121',
      token0: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x816c7eadeecaa03930babdf49e34eaeea0734a7d',
        18,
        'TTN',
        'TestToken'
      ),
      token1: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0xe39ab88f8a4777030a534146a9ca3b52bd5d43a3',
        18,
        'WETH',
        'WETH'
      ),
      qouteToken: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x816c7eadeecaa03930babdf49e34eaeea0734a7d',
        18,
        'TTN',
        'TestToken'
      ),
    },
    {
      pid: 1,
      pairAddress: '0x4916a9c239f9d84941a777F1E17D6bEf3482DB15',
      token0: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
        18,
        'USDC',
        'USD Coin'
      ),
      token1: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0xe39ab88f8a4777030a534146a9ca3b52bd5d43a3',
        18,
        'WETH',
        'WETH'
      ),
      qouteToken: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
        18,
        'USDC',
        'USD Coin'
      ),
    },
  ],
}

export const farmsV2 = {
  [ChainId.AVALANCHE_TESTNET]: [],
  [ChainId.ARBITRUM_TESTNET]: [ // TODO: need to add pair for arbitrum network
    {
      pid: 0,
      pairAddress: '0xb34e7f741923f1792c420237bf4542109b234121',
      token0: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x816c7eadeecaa03930babdf49e34eaeea0734a7d',
        18,
        'TTN',
        'TestToken'
      ),
      token1: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0xe39ab88f8a4777030a534146a9ca3b52bd5d43a3',
        18,
        'WETH',
        'WETH'
      ),
      qouteToken: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x816c7eadeecaa03930babdf49e34eaeea0734a7d',
        18,
        'TTN',
        'TestToken'
      ),
    },
    {
      pid: 1,
      pairAddress: '0x4916a9c239f9d84941a777F1E17D6bEf3482DB15',
      token0: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
        18,
        'USDC',
        'USD Coin'
      ),
      token1: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0xe39ab88f8a4777030a534146a9ca3b52bd5d43a3',
        18,
        'WETH',
        'WETH'
      ),
      qouteToken: new Token(
        ChainId.ARBITRUM_TESTNET,
        '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
        18,
        'USDC',
        'USD Coin'
      ),
    },
  ],
}
export default farmsV1
