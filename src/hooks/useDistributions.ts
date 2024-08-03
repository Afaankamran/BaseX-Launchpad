import { useSingleCallResult } from '@/state/multicall/hooks';
import { useClaimerContract } from './useContract';

export function useDistribution() {
  const claimerContract = useClaimerContract();
  const result = useSingleCallResult(claimerContract, 'getAllDistributions');
  return result.loading ? [] : result.result?.[0];
}

export function useDistributionUserClaims(
  index: string | null,
  amount: string | null,
  account: string | null,
) {
  const claimerContract = useClaimerContract();
  const isDataValid = account && amount && index;
  const result = useSingleCallResult(
    isDataValid ? claimerContract : null,
    'getClaims',
    isDataValid ? [index, amount, account] : [],
  );
  return result.loading || !isDataValid ? [] : result.result;
}
