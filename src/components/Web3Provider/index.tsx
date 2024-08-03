import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useDisconnect,
  useWeb3ModalState,
} from "@web3modal/ethers5/react";

export const EthWalletContext = React.createContext({
  isActive: false,
  address: null,
  balance: 0,
  chainId: 0,
  network: "",
  provider: null,
  connect: (type: any) => { }, // Adjusted to accept a parameter if needed
  disconnect: () => { },
  toggleNetwork: () => { },
  loading: false,
});

export const EthWalletProvider = ({ children }) => {
  const { open } = useWeb3Modal();
  const accountHook = useWeb3ModalAccount();
  const state = useWeb3ModalState();
  const providerHook = useWeb3ModalProvider();
  const disconnectHook = useDisconnect();

  const [isActive, setIsActive] = useState(false);
  const [address, setaddress] = useState(null);

  useEffect(() => {
    setIsActive(accountHook?.isConnected);
    setaddress(accountHook?.address || "");
  }, [accountHook?.address, accountHook?.isConnected]);

  useEffect(() => {
    try {
      if (accountHook.chainId && isActive) {
        if (accountHook.chainId !== 56) {
          disconnect();
          alert("This platform supports only BASE. Please switch to that chain!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [isActive, accountHook.chainId]);

  const connect = useCallback(
    async (type) => {
      try {
        await open({ view: "Connect" });
      } catch (error) {
        console.log("error==> ", error);
      }
    },
    [open]
  );

  const disconnect = useCallback(async () => {
    try {
      setaddress(null);
      setIsActive(false);
      await disconnectHook.disconnect();
    } catch (error) {
      console.error("error==> ", error);
    }
  }, [disconnectHook]);

  const toggleNetwork = useCallback(() => {
    // Implement toggle network functionality
  }, []);

  const values = useMemo(
    () => ({
      isActive,
      address,
      setaddress,
      connect,
      disconnect,
      toggleNetwork,
      provider: providerHook?.walletProvider || null,
      chainId: accountHook.chainId || 0,
      network: "", // Placeholder for network information
      balance: 0, // Placeholder for balance information
      loading: state.open,
    }),
    [
      isActive,
      address,
      setaddress,
      connect,
      disconnect,
      toggleNetwork,
      providerHook,
      accountHook,
      state.open,
    ]
  );

  return (
    <EthWalletContext.Provider value={values}>
      {children}
    </EthWalletContext.Provider>
  );
};
