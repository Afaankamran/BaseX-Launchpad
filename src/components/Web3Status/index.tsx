import React, { useMemo } from 'react';
import { injected } from '../../config/wallets';
import {
  isTransactionRecent,
  useAllTransactions,
} from '../../state/transactions/hooks';

import { AbstractConnector } from '@web3-react/abstract-connector';
import Image from 'next/image';
import Loader from '../Loader';
import { NetworkContextName } from '../../constants';
import { TransactionDetails } from '../../state/transactions/reducer';
import WalletModal from '../../modals/WalletModal';
import Web3Connect from '../Web3Connect';
import { shortenAddress } from '../../functions/format';
import styled from 'styled-components';
import { useWalletModalToggle } from '../../state/application/hooks';
import { useWeb3React } from '@web3-react/core';
import { Box, Button, Card, Typography } from '@mui/material';
import { useETHBalances } from '@/state/wallet/hooks';
import { NATIVE } from '@devdot/basex-sdk'; // zach: I removed this to use the local version to have zkSync chain added
import Images from '@/public/Assets/Images';

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
);

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return null;
    // <Image
    //   src="/chef.svg"
    //   alt="Injected (MetaMask etc...)"
    //   width={20}
    //   height={20}
    // />
    // return <Identicon />
  } else if (connector.constructor.name === 'WalletConnectConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/wallet-connect.png"
          alt={'Wallet Connect'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'LatticeConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/lattice.png"
          alt={'Lattice'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'WalletLinkConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/coinbase.svg"
          alt={'Coinbase Wallet'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'FortmaticConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/fortmatic.png"
          alt={'Fortmatic'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'PortisConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/portis.png"
          alt={'Portis'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'KeystoneConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/keystone.png"
          alt={'Keystone'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  }
  return null;
}

function Web3StatusInner() {
  const { account, connector, chainId } = useWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ];
  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else {
        return true;
      }
    })
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;

  const toggleWalletModal = useWalletModalToggle();

  if (account) {
    // zach : added to display zkSync in navbar instead of default Arbitrum
    let networkName = 'Base';
    let networkLogo = Images.eth;
    // if (chainId == 324){
    //   networkName = 'zkSync';
    //   networkLogo = Images.zkSync;
    // }


    return (
      <>
        {account && chainId && (
          <>
            <Button
              sx={{
                border: '1px solid',
                borderColor: 'common.border',
                borderRadius: '10px',
                variant: 'outlined',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0.4rem 1rem',
                justifyContent: 'center',
                background: "linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)",
              }}
            >
              <Box
                sx={{
                  flexShrink: '0',
                  display: 'flex',
                  width: '32px'
                }}
              >
                <Image src={networkLogo} />
              </Box>

              <Typography className="pl-2  capitalize" color="text.primary" sx={{
                display: { xs: "none", xl: "block" }
              }}>
                {networkName}
              </Typography>
            </Button>
            <Button
              sx={{
                borderRadius: '10px',
                border: '1px solid ',
                borderColor: 'common.border',
                fontSize: '1.2rem',
                marginLeft: { xs: '0px', lg: '6px' },
                padding: '0.5rem 1rem',
                background: "linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)",
                marginTop: { xs: '6px', sm: '6px', md: '6px', lg: '0' },
              }}
              onClick={toggleWalletModal}
            >
              <Typography className="text-white" color="text.primary">
                {userEthBalance?.toSignificant(4)}{' '}
              </Typography>
              <Typography
                // className="pl-2 "
                color="text.primary"
                fontWeight="bold"
                sx={{
                  marginLeft: '5px',
                }}
              >
                {' '}
                {NATIVE[chainId].symbol}
              </Typography>
            </Button>
          </>
        )}
      </>
    );
  } else {
    return <Web3Connect style={{ paddingTop: '6px', paddingBottom: '6px' }} />;
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
