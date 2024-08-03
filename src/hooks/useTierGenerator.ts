import { MasterChefInfo, Tier, User } from '../features/launchpad/types';
import {
  calculateUserBuyingPower,
  generateMerkleTree,
  getUserTier,
} from '../features/utils';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { fromWei } from '@/functions';

export function useTierGenerator(users: MasterChefInfo): User[] {
  const tierUsers: User[] = [];
  users.users.map((user, i) => {
    const userAmount = users.amounts[i];
    const tier: Tier = getUserTier(Number(fromWei(userAmount)));
    if (tier.tier != 'None')
      tierUsers.push({
        account: user,
        amount: Number(userAmount),
        tier,
      });
  });
  return tierUsers;
}

export function useUsersBuyingPower(
  totaltokensToSell: BigNumber,
  users: User[],
) {
  const userBuying = calculateUserBuyingPower(
    Number(formatUnits(totaltokensToSell)),
    users,
  );
  const { root, mappedData } = generateMerkleTree(userBuying);
  return { userBuying, root, mappedData };
}
