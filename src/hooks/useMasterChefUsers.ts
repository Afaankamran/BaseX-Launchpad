import { MasterChefInfo } from '../features/launchpad/types';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { BigNumber } from '@ethersproject/bignumber';
import { useERC20Contract, useStakingContract } from './useContract';

export function useMasterChefUser(): MasterChefInfo {
  const masterchefContract = useStakingContract();
  const result = useSingleCallResult(
    masterchefContract,
    'getAllPoolUserInfos',
    [],
  );
  return result?.loading
    ? {
        users: [],
        amounts: [],
      }
    : {
        users: result?.result?.[0],
        amounts: result?.result?.[1],
      };
}

export function useMasterChefTokenBalance() {
  const masterchefContract = useStakingContract();
  const result = useSingleCallResult(masterchefContract, 'poolInfo', [0]);
  const lpAddress = result?.loading ? null : result?.result?.[0];
  const lpContract = useERC20Contract(lpAddress);
  const balanceResult = useSingleCallResult(
    lpAddress ? lpContract : null,
    'balanceOf',
    [masterchefContract.address],
  );
  return balanceResult?.loading
    ? BigNumber.from(0)
    : balanceResult?.result?.[0];
}
