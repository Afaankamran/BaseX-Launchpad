import { ChainId } from '@devdot/basex-sdk'

const explorers = {
  etherscan: (
    link: string,
    data: string,
    type: "transaction" | "token" | "address" | "block"
  ) => {
    switch (type) {
      case "transaction":
        return `${link}/tx/${data}`;
      default:
        return `${link}/${type}/${data}`;
    }
  },

  blockscout: (
    link: string,
    data: string,
    type: "transaction" | "token" | "address" | "block"
  ) => {
    switch (type) {
      case "transaction":
        return `${link}/tx/${data}`;
      case "token":
        return `${link}/tokens/${data}`;
      default:
        return `${link}/${type}/${data}`;
    }
  },

  harmony: (
    link: string,
    data: string,
    type: "transaction" | "token" | "address" | "block"
  ) => {
    switch (type) {
      case "transaction":
        return `${link}/tx/${data}`;
      case "token":
        return `${link}/address/${data}`;
      default:
        return `${link}/${type}/${data}`;
    }
  },

  okex: (
    link: string,
    data: string,
    type: "transaction" | "token" | "address" | "block"
  ) => {
    switch (type) {
      case "transaction":
        return `${link}/tx/${data}`;
      case "token":
        return `${link}/tokenAddr/${data}`;
      default:
        return `${link}/${type}/${data}`;
    }
  },
};
interface ChainObject {
  [chainId: number]: {
    link: string;
    builder: (
      chainName: string,
      data: string,
      type: "transaction" | "token" | "address" | "block"
    ) => string;
  };
}

const chains: ChainObject = {
  [ChainId.MAINNET]: {
    link: 'https://etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.BaseSepolia]: {
    link: 'https://sepolia.basescan.org',
    builder: explorers.etherscan,
  },
  [ChainId.ROPSTEN]: {
    link: 'https://ropsten.etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.RINKEBY]: {
    link: 'https://rinkeby.etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.GOERLI]: {
    link: 'https://goerli.etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.KOVAN]: {
    link: 'https://kovan.etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.MATIC]: {
    link: 'https://polygonscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.MATIC_TESTNET]: {
    link: 'https://mumbai.polygonscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.FANTOM]: {
    link: 'https://ftmscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.FANTOM_TESTNET]: {
    link: 'https://testnet.ftmscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.XDAI]: {
    link: 'https://blockscout.com/xdai/mainnet',
    builder: explorers.blockscout,
  },
  [ChainId.BSC]: {
    link: 'https://bscscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.BSC_TESTNET]: {
    link: 'https://testnet.bscscan.com',
    builder: explorers.etherscan,
  },
  [ChainId.ARBITRUM]: {
    link: 'https://arbiscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.MOONBEAM_TESTNET]: {
    link: 'https://moonbase.moonscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.MOONBEAM]: {
    link: 'https://moonscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.AVALANCHE]: {
    link: 'https://cchain.explorer.avax.network',
    builder: explorers.blockscout,
  },
  [ChainId.AVALANCHE_TESTNET]: {
    link: 'https://cchain.explorer.avax-test.network',
    builder: explorers.etherscan,
  },
  [ChainId.HECO]: {
    link: 'https://hecoinfo.com',
    builder: explorers.etherscan,
  },
  [ChainId.HECO_TESTNET]: {
    link: 'https://testnet.hecoinfo.com',
    builder: explorers.etherscan,
  },
  [ChainId.HARMONY]: {
    link: 'https://beta.explorer.harmony.one/#',
    builder: explorers.harmony,
  },
  [ChainId.HARMONY_TESTNET]: {
    link: 'https://explorer.pops.one/#',
    builder: explorers.harmony,
  },
  [ChainId.OKEX]: {
    link: 'https://www.oklink.com/okexchain',
    builder: explorers.okex,
  },
  [ChainId.OKEX_TESTNET]: {
    link: 'https://www.oklink.com/okexchain-test',
    builder: explorers.okex,
  },
  [ChainId.CELO]: {
    link: 'https://explorer.celo.org',
    builder: explorers.blockscout,
  },
  [ChainId.PALM]: {
    link: '', // ??
    builder: explorers.blockscout,
  },
  [ChainId.MOONRIVER]: {
    link: 'https://blockscout.moonriver.moonbeam.network',
    builder: explorers.blockscout,
  },
}



export function getExplorerLink(
  chainId: number,
  data: string,
  type: "transaction" | "token" | "address" | "block"
): string {
  const chain = chains[chainId];
  return chain?.builder(chain.link, data, type);
}
