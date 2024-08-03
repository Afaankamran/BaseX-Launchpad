import { CurrencyAmount, Token } from '@devdot/basex-sdk';

type TokenAddress = string;

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>;
