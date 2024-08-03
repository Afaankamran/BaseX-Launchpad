import { Tier } from "@/features/launchpad/types";
import { ChainId, JSBI, Percent } from "@devdot/basex-sdk";

export const NetworkContextName = "NETWORK";
// export const ZERO = JSBI.BigInt(0);
export const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;
export const claimerContractAddress =
  "0x2bf56a4B0aad0de22c6f1EBDeced2d9253391174"; //  arbitrum-one
export const arrayPoolContract = "0x36F9D8Bc85Ee530Ec868D78c6509E7DAbe8ABDcB";
export const RewardBlockNumber = 27695426;
export const defaultNewtork = ChainId.BaseSepolia; // goerli-arbitrum

export const TIERS: Tier[] = [
  {
    tier: "Tier 1",
    minTokens: 1000,
    weight: 1,
  },
  {
    tier: "Tier 2",
    minTokens: 5000,
    weight: 2.5,
  },
  {
    tier: "Tier 3",
    minTokens: 10000,
    weight: 5.0,
  },
  {
    tier: "Tier 4",
    minTokens: 25000,
    weight: 10,
  },
];

export const POOL_DENY = ["14", "29", "45", "30"];

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13;
// Subdctiption

export const MERKLE_ROOT =
  "https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-19/merkle-10959148-11824101.json";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 ETH

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
);

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",
  "0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b",
  "0x901bb9583b24D97e995513C6778dc6888AB6870e",
  "0xA7e5d5A720f06526557c513402f2e6B5fA20b008",
];

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  [ChainId.MOONRIVER]: "https://info.array.io",
  [ChainId.AVALANCHE_TESTNET]: "https://info.array.inc",
};

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  [ChainId.ROPSTEN]: 10499401,
  [ChainId.GOERLI]: 5062605,
  [ChainId.RINKEBY]: 8897988,
};
export const array_ROLL_CONRACT: { [chainId in ChainId]?: string } = {
  [ChainId.MOONRIVER]: "0xde5ACb410b574Bd98f4B6aFa6Fa535655Ff7a6df",
};
