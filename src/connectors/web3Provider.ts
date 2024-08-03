import RPC from "@/config/rpc";
import { ChainId } from "@devdot/basex-sdk";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import type { Chain } from '@web3modal/scaffold-utils/ethers';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b74c1200732b4da8f98f29cf935c2263";

const cryptoData: Chain[] = [
  {
    rpcUrl: RPC[ChainId.BaseSepolia],
    explorerUrl: "https://basescan.org/",
    currency: "ETH",
    name: "Ethereum",
    chainId: 8453,
  },
  {
    rpcUrl: RPC[ChainId.BaseSepolia],
    explorerUrl: "https://sepolia.basescan.org/",
    currency: "ETH",
    name: "Ethereum",
    chainId: 84532,
  }
];

const metadata = {
  name: "BaseX",
  description: "BaseX DEX",
  url: "BaseX.io",
  icons: ["https://avatars.mywebsite.com/"],
};



createWeb3Modal({
  ethersConfig: { ...defaultConfig({ metadata }) },
  chains: cryptoData,
  defaultChain: cryptoData[1],
  projectId: projectId,
});
export function Web3ModalProvider({ children }) {
  return children;
}
