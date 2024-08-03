import React, { useEffect, useState } from 'react';
import { SUPPORTED_WALLETS, injected } from '../../config/wallets';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  useModalOpen,
  useWalletModalToggle,
} from '../../state/application/hooks';

import { AbstractConnector } from '@web3-react/abstract-connector';
import AccountDetails from '../../components/AccountDetails';
import { ApplicationModal } from '../../state/application/actions';
import { ButtonError } from '../../components/Button';
import ExternalLink from '../../components/ExternalLink';
import ModalHeader from '../../components/ModalHeader';
import { OVERLAY_READY } from '../../entities/FortmaticConnector';
import Option from './Option';
import PendingView from './PendingView';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { isMobile } from 'react-device-detect';
import usePrevious from '../../hooks/usePrevious';
import Modal from '@/components/Modal';
import { Button } from '@mui/material';
import { defaultNewtork } from '@/constants';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[]; // hashes of pending
  confirmedTransactions: string[]; // hashes of confirmed
  ENSName?: string;
}) {



  // console.log({ ENSName })
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error, deactivate } =
    useWeb3React();


  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const switchNetwork = async () => {
    try {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${defaultNewtork.toString(16)}` }],
      })
    } catch (error) {
      console.error(error)
      // Handle error
    }
  };

  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);

  const toggleWalletModal = useWalletModalToggle();

  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (
    connector:
      | (() => Promise<AbstractConnector>)
      | AbstractConnector
      | undefined,
  ) => {
    let name = '';
    let conn = typeof connector === 'function' ? await connector() : connector;

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    setPendingWallet(conn); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      conn instanceof WalletConnectConnector &&
      conn.walletConnectProvider?.wc?.uri
    ) {
      conn.walletConnectProvider = undefined;
    }

    conn &&
      activate(conn, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    if (connector?.constructor?.name === 'FormaticConnector') {
      connector.on(OVERLAY_READY, () => {
        toggleWalletModal();
      });
    }
  }, [toggleWalletModal, connector]);

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.name === 'Portis') {
          return null;
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={'/images/wallets/' + option.iconName}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="/images/wallets/metamask.png"
              />
            );
          } else {
            return null; // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/images/wallets/' + option.iconName}
          />
        )
      );
    });
  }

  function getModalContent() {
    if (error) {
      return (
        <div className="p-4 ">
          <ModalHeader
            title={
              error instanceof UnsupportedChainIdError
                ? `Wrong Network`
                : `Error connecting`
            }
            onClose={toggleWalletModal}
          />
          <div className="text-white ">
            {error instanceof UnsupportedChainIdError ? (
              <h5>{`Please Switch to Base network.`}</h5>
            ) : (
              `Error connecting. Try refreshing the page.`
            )}
            <div style={{ marginTop: '1rem' }} />
            <div className='space-x-3'>

              <Button
                className="btn btn-primary"
                variant="contained"
                size="sm"
                onClick={deactivate}
              >
                {`Disconnect`}
              </Button>
              <Button
                className="btn btn-primary"
                variant="contained"
                size="sm"
                onClick={() => switchNetwork()}
              >
                {`Switch Network`}
              </Button>
            </div>

          </div>
        </div>
      );
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      );
    }
    return (
      <div className="flex flex-col p-4 space-y-4  shadow-xl">
        <ModalHeader title="Chose a Wallet to Connect" onClose={toggleWalletModal} />
        <div className="flex flex-col space-y-6">
          {/* {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : ( */}
          <div className="flex flex-col space-y-5 overflow-y-auto">
            {getOptions()}
          </div>
          {/* )} */}
        </div>
      </div>
    );
  }

  return (
    <Modal
      // centered={true}
      // contentClassName="bg-dark p-3"
      isOpen={walletModalOpen}
      onDismiss={toggleWalletModal}
      // minHeight={false}
      maxHeight={90}
    >
      {getModalContent()}
    </Modal>
  );
}
