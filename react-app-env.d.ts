declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: true;
      on?: (...args: any[]) => void;
      removeListener?: (...args: any[]) => void;
      autoRefreshOnNetworkChange?: boolean;
      send?: (...args) => void;
    };
    web3?: Record<string, unknown>;
  }
}
