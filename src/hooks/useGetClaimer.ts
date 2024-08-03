import { claimerContractAddress } from '@/constants';
import CLAIMER_ABI from '@/constants/abis/claimer1.json';
import { useContract } from './useContract';
import { useCallback } from 'react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { useSingleCallResult } from '@/state/multicall/hooks';
import useSWR from 'swr';




const useGetClaimer = (startBlock) => {
  const storage = new ThirdwebStorage();
  const claimerContract = useContract(claimerContractAddress, CLAIMER_ABI, true);
  const { result: dataUri } = useSingleCallResult(claimerContract, "dataUri", [])
  const { data: claims } = useSWR(
    `claims/${dataUri}`,
    async () => {
      if (!dataUri || !dataUri?.[0]) return null;
      const queryData = await storage.downloadJSON(dataUri?.[0]);
      return queryData;
    }
  );
  const filterFrom = claimerContract.filters.Initialize();
  const getClaims = useCallback(async () => {
    try {
      const logs = await claimerContract.queryFilter(filterFrom, startBlock);
      let claims = []
      if (logs && logs.length > 0) {
        const decoded = claimerContract.interface.decodeEventLog(
          'Initialize',
          logs[0].data
        );
        claims = decoded.claims;
      }

      return claims;
    } catch (error) {
      console.error('s', error);
      return null;
    }
  }, [claimerContract, filterFrom]);


  return { getClaims, claimerContract, claims };
};

export default useGetClaimer;
