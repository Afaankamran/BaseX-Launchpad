import { formatNumber, formatPercent } from '../functions/format'

import { BigNumber } from '@ethersproject/bignumber'
import { getUSDString } from '../functions/kashi'

export enum Direction {
  DOWN = -1,
  FLAT = 0,
  UP = 1,
}

interface Line {
  name: string
  from: string
  to: string
  direction: Direction
}
