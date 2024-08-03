import { MerkleUser, Tier, User, UserBuying } from './launchpad/types';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { ethers } from 'ethers';
import { TIERS } from '@/constants';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
export function generateMerkleTree(data: UserBuying[]): {
  root: string;
  mappedData: { [key: string]: MerkleUser };
} {
  const leaves = data.map((x) => {
    return ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [x.account, x.buyingPower.toString()],
    );
  });
  const tree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });
  const root = tree.getHexRoot();
  const mappedData: { [key: string]: MerkleUser } = {};
  data.map((obj, index) => {
    return (mappedData[obj.account] = {
      ...obj,
      proof: tree.getHexProof(leaves[index]),
    });
  });
  return { root, mappedData };
}

export function calculateUserBuyingPower(
  totalTokens: number,
  users: User[],
): UserBuying[] {
  const usersInTier = Object.values(TIERS).map((tier) => {
    const count = users.filter((user) => user.tier.tier === tier.tier).length;
    return { ...tier, userCount: count };
  });
  // console.log(usersInTier.reduce((sum, tier) => {
  //     sum += tier.userCount * tier.weight;
  //     return sum;
  // }, 0).toString(), "userintier")
  const allUsers = usersInTier.reduce((sum, tier) => {
    sum += tier.userCount * tier.weight;
    return sum;
  }, 0);
  const share_amount = allUsers > 0 ? totalTokens / allUsers : 0;

  const tiersAmount: {
    [key: string]: Tier & {
      allocatedAmount: number;
      buyingPower: number;
    };
  } = {};
  //calculate Allocated tokens to each tier
  usersInTier.map((tier) => {
    const allocatedAmount = tier.userCount * share_amount * tier.weight;
    const buyingPower =
      allocatedAmount > 0 ? allocatedAmount / tier.userCount : 0;
    tiersAmount[tier.tier] = { ...tier, allocatedAmount, buyingPower };
  });

  return users.map((user) => {
    return {
      ...user,
      buyingPower:
        parseUnits(
          tiersAmount[user.tier.tier]?.buyingPower.toString(),
        ).toString() || '0',
    };
  });
}
export function getUserTier(userAmount: number) {
  return [...TIERS].reduce(
    (userTier, tier) => {
      if (userAmount > 0 && userAmount >= tier.minTokens) {
        userTier = tier;
      }
      return userTier;
    },
    {
      tier: 'None',
      minTokens: 0,
      weight: 0,
    },
  );
}
