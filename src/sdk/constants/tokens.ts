import { WETH9_ADDRESS } from './addresses';
import { Token } from '../entities/Token';
import { TokenMap } from '../types/TokenMap';
import { ChainId } from '../enums';

export const WETH9: TokenMap = {
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    WETH9_ADDRESS[ChainId.ROPSTEN],
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    WETH9_ADDRESS[ChainId.AVALANCHE],
    18,
    'WAVAX',
    'Wrapped ETH',
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    WETH9_ADDRESS[ChainId.ARBITRUM],
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [ChainId.BaseSepolia]: new Token(
    ChainId.BaseSepolia,
    WETH9_ADDRESS[ChainId.BaseSepolia],
    18,
    'WETH',
    'Wrapped Ether',
  ),
};

export const WNATIVE: TokenMap = {
  [ChainId.ARBITRUM]: WETH9[ChainId.ARBITRUM],
  [ChainId.BaseSepolia]: WETH9[ChainId.BaseSepolia],
  [ChainId.ARBITRUM]: WETH9[ChainId.ARBITRUM],
  [ChainId.AVALANCHE]: WETH9[ChainId.AVALANCHE],
};
