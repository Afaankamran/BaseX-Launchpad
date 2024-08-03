import useSWR from 'swr';
import useActiveWeb3React from './useActiveWeb3React';

export enum KYCSTATUS {
  INCOMPLETE = 'incomplete',
  WAITING = 'waiting',
  INREVIEW = 'inreview',
  APPROVED = 'approved',
  RESUBMIT = 'resubmit',
  BLOCKED = 'blocked',
  SUBMIT = 'submit',
}
export function useKYC() {
  const { account } = useActiveWeb3React();
  const { data: kyc } = useSWR(`kyc/${account}`, async () => {
    if (!account) return null;
    return fetch(
      `https://kyc.blockpass.org/kyc/1.0/connect/${process.env.NEXT_PUBLIC_KYC_CLIENT_ID}/refId/${account}`,
      {
        headers: new Headers({
          Authorization: process.env.NEXT_PUBLIC_KYC_API_KEY,
        }),
      },
    ).then((res) => res.json());
  });

  return !kyc || (kyc && kyc?.data?.code == 404)
    ? {
        status: KYCSTATUS.SUBMIT,
      }
    : kyc.data;
}
