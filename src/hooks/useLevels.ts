import { useSingleCallResult } from '@/state/multicall/hooks';
import useActiveWeb3React from './useActiveWeb3React';
import { useIDOContract, useStakingContract } from './useContract';

export function useUsersLevel() {
  const { account } = useActiveWeb3React();
  const levelsContract = useStakingContract();
  const result = useSingleCallResult(levelsContract, 'getUserTier', [account]);
  return result.loading ? null : result.result?.[0];
}
export function useUsersPoolRegisterLevel(poolAddress: string) {
  const { account } = useActiveWeb3React();
  const idoContract = useIDOContract(poolAddress);
  const result = useSingleCallResult(idoContract, 'userLevel', [account]);
  return result.loading ? null : result.result?.[0];
}
