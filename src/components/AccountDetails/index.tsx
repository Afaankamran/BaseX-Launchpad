import React, { FC, useCallback } from 'react';
import { SUPPORTED_WALLETS, injected } from '../../config/wallets';

import { AppDispatch } from '../../state';
import Button from '../Button';
import Copy from './Copy';
import ExternalLink from '../ExternalLink';
import Image from 'next/image';
import { ExternalLink as LinkIcon } from 'react-feather';
import ModalHeader from '../ModalHeader';
import Transaction from './Transaction';
import { clearAllTransactions } from '../../state/transactions/actions';
import { getExplorerLink } from '../../functions/explorer';
import { shortenAddress } from '../../functions';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Typography } from "@mui/material"

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({
  size,
  src,
  alt,
  children,
}) => {
  return (
    <div className="flex flex-row items-end justify-center mr-2 flex-nowrap md:items-center">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  );
};

function renderTransactions(transactions: string[]) {
  return (
    <div className="flex gap-2 flex-column flex-nowrap">
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </div>
  );
}

interface AccountDetailsProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

const AccountDetails: FC<AccountDetailsProps> = ({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return (
      <div className="font-medium text-center lg:text-left text-white text-baseline">
        Connected with {name}
      </div>
    );
  }

  function getStatusIcon() {
    if (connector === injected) {
      return null;
      // return <IconWrapper size={16}>{/* <Identicon /> */}</IconWrapper>
    } else if (connector.constructor.name === 'WalletConnectConnector') {
      return (
        <WalletIcon src="/wallet-connect.png" alt="Wallet Connect" size={16} />
      );
    } else if (connector.constructor.name === 'WalletLinkConnector') {
      return <WalletIcon src="/coinbase.svg" alt="Coinbase" size={16} />;
    } else if (connector.constructor.name === 'FortmaticConnector') {
      return <WalletIcon src="/formatic.png" alt="Fortmatic" size={16} />;
    } else if (connector.constructor.name === 'PortisConnector') {
      return (
        <WalletIcon src="/portnis.png" alt="Portis" size={16}>
          <Button
            onClick={async () => {
              // casting as PortisConnector here defeats the lazyload purpose
              (connector as any).portis.showPortis();
            }}
          >
            Show Portis
          </Button>
        </WalletIcon>
      );
    } else if (connector.constructor.name === 'TorusConnector') {
      return <WalletIcon src="/torus.png" alt="Torus" size={16} />;
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <ModalHeader title="Account" onClose={toggleWalletModal} />
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row items-center justify-end  gap-2 mt-2 space-x-3">
            {chainId && account && (
              <ExternalLink
                color="blue"
                // startIcon={<LinkIcon size={16} color="#fff" />}
                endIcon={<LinkIcon size={16} color="#fff" />}
                href={
                  chainId &&
                  getExplorerLink(chainId, ENSName || account, 'address')
                }
              >
                <Typography fontSize="12px" sx={{ color: "#fff !important" }}>{`View on explorer`}</Typography>
              </ExternalLink>
            )}

          </div>
          <div
            id="web3-account-identifier-row"
            className="flex flex-col justify-center mt-2 space-y-3"
          >
            {ENSName ? (
              <div className="bg-dark-800">
                {getStatusIcon()}
                <Typography>{ENSName}</Typography>
              </div>
            ) : (
              <div className="px-3 py-3 flex justify-between items-center text-white bg-linear-gradient rounded">
                {getStatusIcon()}
                <Typography>{account && shortenAddress(account)}</Typography>
                {account && (
                  <Copy toCopy={account}>
                    <Typography
                      fontSize="12px"
                      className="text-white"
                    >{`Copy Address`}</Typography>
                  </Copy>
                )}
              </div>
            )}

            <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
              {formatConnectorName()}
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-3">
                {connector === injected &&
                  connector.constructor.name !== 'WalletLinkConnector' &&
                  connector.constructor.name !== 'BscConnector' &&
                  connector.constructor.name !== 'KeystoneConnector' && (
                    <button
                      onClick={() => {
                        deactivate();
                        if (
                          (connector as any).close &&
                          typeof (connector as any).close === 'function'
                        ) {
                          (connector as any)?.close();
                        }
                      }}
                      style={{
                        marginRight: '10px',
                        lineHeight: 1,
                        background:
                          'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                        padding: '10px',
                        borderRadius: '5px',
                        fontWeight: '700',
                      }}
                    >
                      {`Disconnect`}
                    </button>
                  )}
                <button
                  className="connect_button btn_sm"
                  onClick={() => {
                    openOptions();
                  }}
                  style={{
                    marginRight: '10px',
                    lineHeight: 1,
                    background:
                      'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                    padding: '10px',
                    borderRadius: '5px',
                    fontWeight: '700',
                  }}
                >
                  {`Change`}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* <div className="my-2">
        <div className="flex items-center justify-between">
          <Typography
            className="text-white"
            weight={700}
          >{`Recent Transactions`}</Typography>
          <div>
            <button
              className="btn btn-sm btn-primary"
              onClick={clearAllTransactionsCallback}
            >
              {`Clear all`}
            </button>
          </div>
        </div>
        {!!pendingTransactions.length || !!confirmedTransactions.length ? (
          <>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </>
        ) : (
          <Typography variant="sm" className="text-secondary">
            {`Your transactions will appear here...`}
          </Typography>
        )}
      </div> */}
    </div>
  );
};

export default AccountDetails;
