import Button, { ButtonProps } from '../Button';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

import { Activity } from 'react-feather';
import React from 'react';
import { useWalletModalToggle } from '../../state/application/hooks';
import { Box } from '@mui/material';

export default function Web3Connect({
  color = 'gray',
  size = 'sm',
  className = '',
  ...rest
}: ButtonProps) {
  const toggleWalletModal = useWalletModalToggle();
  const { error } = useWeb3React();
  return error ? (
    <div
      className=" p-2 text-white bg-red w-full w-40 flex items-center  rounded cursor-pointer"
      onClick={toggleWalletModal}
      style={{ fontSize: '.8rem', cursor: 'pointer' }}
    >
      <div className="mr-1 ">
        <Activity className="w-4 h-4" />
      </div>
      {error instanceof UnsupportedChainIdError
        ? `You are on the wrong network`
        : `Error`}
    </div>
  ) : (
    <button
      className="mt-0"
      type="button"
      id="btn-connect"
      onClick={toggleWalletModal}
    >
      <Box
        sx={{ background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)' }}
        className=" p-2 rounded-lg font-bold text-white whitespace-nowrap"
      >
        Connect Wallet
      </Box>
    </button>
  );
}
