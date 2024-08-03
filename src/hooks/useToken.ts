import { Token } from '@devdot/basex-sdk';
import { useMultipleCallMultipleResult } from '@/state/multicall/hooks';
import { useMemo } from 'react';
import useActiveWeb3React from './useActiveWeb3React';
import { useTokenContract } from './useContract';

export default function useToken(address: string): Token | null {
  const { chainId } = useActiveWeb3React();
  const tokenContract = useTokenContract(address);
  const tokenCalls = [
    {
      methodName: 'name',
      callInputs: [],
    },
    {
      methodName: 'symbol',
      callInputs: [],
    },
    {
      methodName: 'decimals',
      callInputs: [],
    },
  ];
  const results = useMultipleCallMultipleResult(tokenContract, tokenCalls);

  const tokenDetails = useMemo(() => {
    return !results ||
      results.length <= 0 ||
      results.some((result) => result.loading)
      ? undefined
      : tokenCalls.reduce((acc, curr, i) => {
        acc[curr.methodName] = results[i].result?.[0];
        return acc;
      }, {} as any);
  }, [results]);

  return tokenDetails
    ? new Token(
      chainId,
      address,
      tokenDetails.decimals,
      tokenDetails.symbol,
      tokenDetails.name,
    )
    : null;
}
