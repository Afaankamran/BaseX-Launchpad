import { Contract } from "@ethersproject/contracts";
import ERC20_ABI from "../constants/abis/erc20.json";
import { ChainId, MULTICALL2_ADDRESS } from "@devdot/basex-sdk";
import {
  // NEXT_PUBLIC_STAKING_TOKEN_ZKSYNC_ADDRESS,
  BRIDGE_ADDRESS,
  FACTORY_ADDRESS,
  STAKING_ADDRESS,
  TOKEN_ADDRESS,
} from "@/config";
import FACTORY_ABI from "@/constants/abis/factory.json";
import { useMemo } from "react";
import BRIDGE_ABI from "../constants/abis/bridge.json";
import IDO_ABI from "../constants/abis/ido.json";
import DEX_IDO_ABI from "../constants/abis/ido-dex.json";
import MULTICALL2_ABI from "../constants/abis/multicall2.json";
import STAKING_ABI from "../constants/abis/stake.json";
import { getContract } from "../functions/contract";
import { useActiveWeb3React } from "./useActiveWeb3React";

import {
  // BAR_ADDRESS,
  BENTOBOX_ADDRESS,
  // BORING_HELPER_ADDRESS,
  // CHAINLINK_ORACLE_ADDRESS,
  ENS_REGISTRAR_ADDRESS,
  FACTORY_ADDRESS as DEX_FACTORY_ADDRESS,
  // KASHI_ADDRESS,
  // MAKER_ADDRESS,
  MASTERCHEF_ADDRESS,
  // MASTERCHEF_V2_ADDRESS,
  // MERKLE_DISTRIBUTOR_ADDRESS,
  // MINICHEF_ADDRESS,
  MULTICALL2_ADDRESS as DEX_MULTICALL2_ADDRESS,
  ROUTER_ADDRESS,
  STOP_LIMIT_ORDER_ADDRESS,
  BASEX_ADDRESS,
  // TIMELOCK_ADDRESS,
  WNATIVE_ADDRESS,
  STATIC_FARM_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
} from '@devdot/basex-sdk'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector'

import ARCHER_ROUTER_ABI from '../constants/abis/archer-router.json'
import BAR_ABI from '../constants/abis/bar.json'
import BENTOBOX_ABI from '../constants/abis/bentobox.json'
import BORING_HELPER_ABI from '../constants/abis/boring-helper.json'
import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import CLONE_REWARDER_ABI from '../constants/abis/clone-rewarder.json'
import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json'
import EIP_2612_ABI from '../constants/abis/eip-2612.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import DEX_FACTORY_ABI from '../constants/abis/factory-dex.json'
import INARI_ABI from '../constants/abis/inari.json'
import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json'
import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from '../constants/abis/limit-order-helper.json'
import MAKER_ABI from '../constants/abis/maker.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import MASTERCHEF_V2_ABI from '../constants/abis/masterchef-v2.json'
import MEOWSHI_ABI from '../constants/abis/meowshi.json'
import MERKLE_DISTRIBUTOR_ABI from '../constants/abis/merkle-distributor.json'
import MINICHEF_ABI from '../constants/abis/minichef-v2.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SUSHI_ABI from '../constants/abis/sushi.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'
import UNI_FACTORY_ABI from '../constants/abis/uniswap-v2-factory.json'
import WETH9_ABI from '../constants/abis/weth.json'
import ZENKO_ABI from '../constants/abis/zenko.json'
import SATIC_FARMS_ABI from '../constants/abis/static-farm.json'
import { array_ROLL_CONRACT } from '../constants'
import arrayROLL_ABI from '../constants/abis/alpharoll.json'
const UNI_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
import DASHBOARD_ABI from '../constants/abis/dashboard.json'
import DASHBOARD2_ABI from '../constants/abis/dashboard2.json'
import ARRAY_STAKING_ABI from '../constants/abis/roarstaking.json'
import LP_STAKING_NFT_ABI from '../constants/abis/lpstakingnft.json'
import ERC721_ABI from '../constants/abis/erc721.json'
import LAUNCHPAD_FACTORY_ABI from '../constants/abis/launchpad-factory.json'
import { LAUNCHPAD_FACTORY_ADDRESS, LP_STAKING_NFT_ADDRESS, ARRAY_STAKING_ADDRESS } from '../config'

// returns null on errors
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

// export const MULTICALL2_ADDRESS = {
//   1: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
//   3: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
//   4: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
//   42: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
//   [ChainId.ARBITRUM_TESTNET]: "0xDC25bF9D9adfB443d4DbDe462c8D86C49F13De86",
//   [ChainId.AVALANCHE_TESTNET]: "0xA6577666FE76BA7561d2B5edd72152125d8C2891",
//   [ChainId.ARBITRUM]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
//   // TODO: need to add zksync chainId in @sdk/ChainId
//   324: "0x204107BA66207BE69c1C1969C6A1fab7525A56a8",
//   // [ChainId.ZKSYNC]: "0x41B24e5abFfc7bfBdFA2DcE05b3134700FbC95a3",
// };
export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL2_ADDRESS[chainId],
    MULTICALL2_ABI,
    false
  );
}
export function useIDOContract(poolAddress: string) {
  return useContract(poolAddress, IDO_ABI.abi, true);
}
export function useFactoryContract() {
  const { chainId } = useActiveWeb3React();

  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, true);
}

export function useStakingContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(STAKING_ADDRESS[chainId], STAKING_ABI, true);
}

export function useERC20Contract(address: string): Contract | null {
  return useContract(address, ERC20_ABI, false);
}

export function useBridgeContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(BRIDGE_ADDRESS[chainId], BRIDGE_ABI, true);
}

export function useZkSyncBridgeContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(BRIDGE_ADDRESS[chainId], BRIDGE_ABI, true);
}

export function useArrayContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(TOKEN_ADDRESS[chainId], ERC20_ABI);
}

// should be removed and replaced with useArrayContract on both blockchains
export function useZksyncArrayContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(TOKEN_ADDRESS[chainId], ERC20_ABI);

}



// Dex Code 






export const UNI_FACTORY_ADDRESSES = {
  [ChainId.MAINNET]: UNI_FACTORY_ADDRESS,
  [ChainId.ROPSTEN]: UNI_FACTORY_ADDRESS,
  [ChainId.MOONRIVER]: '0x049581aEB6Fe262727f290165C29BDAB065a1B68',
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

// returns null on errors
// export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
//   const { library, account } = useActiveWeb3React()

//   return useMemo(() => {
//     if (!address || !ABI || !library) return null
//     try {
//       return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
//     } catch (error) {
//       console.error('Failed to get contract', error)
//       return null
//     }
//   }, [address, ABI, library, withSignerIfPossible, account])
// }

// export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
//   return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
// }
export function useERC721Contract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC721_ABI, withSignerIfPossible)
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && WNATIVE_ADDRESS[chainId], WETH9_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENS_REGISTRAR_ADDRESS[chainId], ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

// export function useMerkleDistributorContract(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
// }

// export function useBoringHelperContract(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && BORING_HELPER_ADDRESS[chainId], BORING_HELPER_ABI, false)
// }
// 0xA6577666FE76BA7561d2B5edd72152125d8C2891
export function useDexMulticall2Contract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && DEX_MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BASEX_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible)
}

// export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(
//     chainId && MASTERCHEF_ADDRESS[chainId],
//     [ChainId.MOONRIVER, ChainId.MOONBEAM , ChainId.ARBITRUM , ChainId.ARBITRUM_TESTNET].includes(chainId) ? MASTERCHEF_V2_ABI : MASTERCHEF_ABI,
//     withSignerIfPossible
//   )
// }
export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId && MASTERCHEF_ADDRESS[chainId],
    [ChainId.MOONRIVER, ChainId.MOONBEAM, ChainId.ARBITRUM, ChainId.ARBITRUM_TESTNET].includes(chainId) && MASTERCHEF_ABI,
    withSignerIfPossible
  )
}
const OLD_MASTERCHEF_ADDRESS = {
  [ChainId.MOONBEAM]: '0x4CAF187b7D021279b25532449FA84a8Cfeb1CDC4',
  [ChainId.MOONRIVER]: '0x4d1D8Ee77e9d2d4EA53Ef1DF7E0D32F6B6199954',
}
export function useMasterOldChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && OLD_MASTERCHEF_ADDRESS[chainId], MASTERCHEF_ABI, withSignerIfPossible)
}

export function useStaticFarmsContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && STATIC_FARM_ADDRESS[chainId], SATIC_FARMS_ABI, withSignerIfPossible)
}

export function useMasterChefV2Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_V2_ADDRESS[chainId], MASTERCHEF_V2_ABI, withSignerIfPossible)
}
// export function useMiniChefContract(withSignerIfPossible?: boolean): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && MINICHEF_ADDRESS[chainId], MINICHEF_ABI, withSignerIfPossible)
// }

export function useDexFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && DEX_FACTORY_ADDRESS[chainId], DEX_FACTORY_ABI, false)
}

export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  const address = ROUTER_ADDRESS[chainId]
  const abi = ROUTER_ABI

  return useContract(address, abi, withSignerIfPossible)
}

export function useArrayStakingContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ARRAY_STAKING_ADDRESS[chainId], ARRAY_STAKING_ABI, true)
}

export function useLPStakingNFTContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LP_STAKING_NFT_ADDRESS[chainId], LP_STAKING_NFT_ABI, true)
}

// export function useSushiBarContract(withSignerIfPossible?: boolean): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && BAR_ADDRESS[chainId], BAR_ABI, withSignerIfPossible)
// }

// export function useMakerContract(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && MAKER_ADDRESS[chainId], MAKER_ABI, false)
// }

// export function useTimelockContract(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
// }

export function useBentoBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BENTOBOX_ADDRESS[chainId], BENTOBOX_ABI, withSignerIfPossible)
}

// export function useChainlinkOracle(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && CHAINLINK_ORACLE_ADDRESS[chainId], CHAINLINK_ORACLE_ABI, false)
// }

export function useUniV2FactoryContract(chainId: number): Contract | null {
  return useContract(UNI_FACTORY_ADDRESSES[chainId], UNI_FACTORY_ABI, false)
}

export function useComplexRewarderContract(address, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

export function useCloneRewarderContract(address, withSignerIfPossibe?: boolean): Contract | null {
  return useContract(address, CLONE_REWARDER_ABI, withSignerIfPossibe)
}

export function useMeowshiContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', MEOWSHI_ABI, withSignerIfPossible)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(STOP_LIMIT_ORDER_ADDRESS[chainId], LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12', LIMIT_ORDER_HELPER_ABI, withSignerIfPossible)
}

export function useInariContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x195E8262AA81Ba560478EC6Ca4dA73745547073f', INARI_ABI, withSignerIfPossible)
}

export function useZenkoContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xa8f676c49f91655ab3b7c3ea2b73bb3088b2bc1f', ZENKO_ABI, withSignerIfPossible)
}

export function usearrayRollContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    address = array_ROLL_CONRACT[chainId]
  }
  return useContract(address, arrayROLL_ABI, true)
}

export function useDashboardContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MOONRIVER:
        address = '0x65dFb73F6FF8cba6B07585E4fA79f6a8Eb027dc1'
        break
      case ChainId.ROPSTEN:
        address = '0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35'
        break
    }
  }

  const dashboardContract = useContract(address, DASHBOARD_ABI, false)
  return dashboardContract
}

export function useDashboard2Contract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MOONRIVER:
        address = '0xC9a8733034D24A492168A835a3Bf730aF87eee5A'
        break
      case ChainId.ROPSTEN:
        address = '0xbB7091524A6a42228E396480C9C43f1C4f6c50e2'
        break
    }
  }
  return useContract(address, DASHBOARD2_ABI, false)
}

export function useDexIDOContract(poolAddress: string) {
  return useContract(poolAddress, DEX_IDO_ABI, true)
}

export function useLaunchPadFactory() {
  const { chainId } = useActiveWeb3React()
  return useContract(LAUNCHPAD_FACTORY_ADDRESS[chainId], LAUNCHPAD_FACTORY_ABI, true)
}
