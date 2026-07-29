export type AllocationKey =
  | 'training'
  | 'audit'
  | 'ecosystem'
  | 'team'
  | 'community'
  | 'liquidity'

export type AllocationSlice = {
  key: AllocationKey
  label: string
  short: string
  share: number
  fill: string
  purpose: string
}

export const ALLOCATION: AllocationSlice[] = [
  {
    key: 'training',
    label: 'Training rewards',
    short: 'Rewards',
    share: 35,
    fill: '#000000',
    purpose: 'Pay accepted PoG work',
  },
  {
    key: 'team',
    label: 'Team',
    short: 'Team',
    share: 25,
    fill: '#404040',
    purpose: 'Build and operate · Streamflow 250M (cliff 29 Jul 2027, then 36 months)',
  },
  {
    key: 'audit',
    label: 'Audit / security',
    short: 'Audit',
    share: 15,
    fill: '#666666',
    purpose: 'Audit fees and red-team bounties',
  },
  {
    key: 'ecosystem',
    label: 'Ecosystem / grants',
    short: 'Ecosystem',
    share: 10,
    fill: '#8c8c8c',
    purpose: 'Tooling, relays, research · Streamflow 100M to treasury (24 months linear)',
  },
  {
    key: 'community',
    label: 'Early / community',
    short: 'Community',
    share: 10,
    fill: '#b3b3b3',
    purpose: 'Genesis participants, bug bounties',
  },
  {
    key: 'liquidity',
    label: 'Liquidity',
    short: 'Liquidity',
    share: 5,
    fill: '#d9d9d9',
    purpose: 'Raydium CPMM · ~8.08% contributed from treasury (LP not locked)',
  },
]

export const ALLOCATION_TOTAL = ALLOCATION.reduce((s, a) => s + a.share, 0)

export const ALLOCATION_PREVIOUS = {
  training: 45,
  team: 15,
} as const

export const rebalanceChartData = [
  {
    label: 'Training rewards',
    previous: ALLOCATION_PREVIOUS.training,
    current: 35,
  },
  {
    label: 'Team',
    previous: ALLOCATION_PREVIOUS.team,
    current: 25,
  },
]

export type PresetEconomics = {
  key: string
  label: string
  short: string
  roundCostUsd: number
  roundRewardUsd: number
  bondAtP10Usd: number
  fill: string
}

export const REWARD_MARGIN = 1.35
export const AUDIT_FEE_MULTIPLIER = 1.1

export const PRESET_ECONOMICS: PresetEconomics[] = [
  {
    key: '125m',
    label: '125M proof',
    short: '125M',
    roundCostUsd: 0.01198902210024556,
    roundRewardUsd: 0.016185179835331506,
    bondAtP10Usd: 0.14566661851798357,
    fill: '#d4d4d4',
  },
  {
    key: '1b',
    label: '1B genesis',
    short: '1B',
    roundCostUsd: 0.2397804420049112,
    roundRewardUsd: 0.3237035967066301,
    bondAtP10Usd: 2.913332370359671,
    fill: '#737373',
  },
  {
    key: '7b',
    label: '7B scale',
    short: '7B',
    roundCostUsd: 3.356926188068757,
    roundRewardUsd: 4.531850353892822,
    bondAtP10Usd: 40.7866531850354,
    fill: '#000000',
  },
]

export const AUDIT_PS = [0.02, 0.05, 0.1, 0.2, 0.3] as const

export function breakEvenBond(reward: number, p: number) {
  return (reward * (1 - p)) / p
}

export const bondCurveData = AUDIT_PS.map((p) => {
  const row: Record<string, number | string> = {
    p,
    pLabel: `${Math.round(p * 100)}%`,
    expectedCatch: 1 / p,
  }
  for (const preset of PRESET_ECONOMICS) {
    row[preset.key] = Number(
      breakEvenBond(preset.roundRewardUsd, p).toFixed(4),
    )
  }
  return row
})

export const BURN_AT_P10 = {
  preset: '1B genesis',
  nWorkers: 100,
  auditProbability: 0.1,
  auditFeeUsd: 0.2637584862054023,
  treasuryBurnPerRoundUsd: 2.637584862054023,
  burnShareOfRewards: 0.08148148148148149,
}

export const burnShareData = AUDIT_PS.map((p) => ({
  p,
  pLabel: `${Math.round(p * 100)}%`,
  burnShare: Number(((p * AUDIT_FEE_MULTIPLIER) / REWARD_MARGIN).toFixed(4)),
  burnPct: Number((((p * AUDIT_FEE_MULTIPLIER) / REWARD_MARGIN) * 100).toFixed(2)),
}))

export const GENESIS_OP = {
  auditProbability: 0.1,
  toleranceBand: 0.05,
  roundRewardUsd: 0.3237035967066301,
  bondUsd: 2.913332370359671,
  bondRoundsOfReward: 9,
  expectedCatchRounds: 10,
  auditBurnShare: 0.08148148148148149,
}

export const SLASH_BOUNTY = {
  reporterBps: 5000,
  reporterShare: 0.5,
  treasuryShare: 0.5,
}

export const bountySplitData = [
  {
    key: 'reporter',
    label: 'Reporter bounty',
    share: SLASH_BOUNTY.reporterShare * 100,
    fill: '#000000',
  },
  {
    key: 'vault',
    label: 'Run vault retained',
    share: SLASH_BOUNTY.treasuryShare * 100,
    fill: '#b3b3b3',
  },
]

export const TOKEN_SYMBOL = 'LEVI'

export const TOKENOMICS_KPIS = [
  {
    label: 'Token',
    value: '$LEVI',
    hint: 'Network reward unit',
  },
  {
    label: 'Training rewards',
    value: '35%',
    hint: 'Largest single bucket',
  },
  {
    label: 'Team',
    value: '25%',
    hint: '250M on Streamflow vest',
  },
  {
    label: 'Genesis bond @ p=0.1',
    value: `$${GENESIS_OP.bondUsd.toFixed(2)}`,
    hint: '9 rounds of reward',
  },
]

export const presetOperatingData = PRESET_ECONOMICS.map((p) => ({
  short: p.short,
  label: p.label,
  cost: Number(p.roundCostUsd.toFixed(4)),
  reward: Number(p.roundRewardUsd.toFixed(4)),
  bond: Number(p.bondAtP10Usd.toFixed(4)),
}))

export type VestCategory = 'team' | 'ecosystem'

export type VestStream = {
  id: string
  category: VestCategory
  label: string
  address: string
  status: 'live' | 'pending'
  amountLabel: string
  shareOfSupply: number
  schedule: string
  unlockCadence?: string
  unlockPerPeriodLabel?: string
  nextUnlockLabel?: string
  recipientLabel: string
  recipientAddress?: string
  immutable: boolean
}

export const SUPPLY_LOCKS = {
  provider: 'Streamflow',
  providerUrl: 'https://app.streamflow.finance',
  summary:
    'Team and ecosystem allocations are vested on Streamflow. Streams are immutable and cannot be cancelled. Trustless. Transparent. On-chain.',
  streams: [
    {
      id: 'team',
      category: 'team' as const,
      label: 'Team lock',
      address: '8imUz6edAWFfPzsyrJqYwvF1UP54rtFTe5asNu1zqyfX',
      status: 'live' as const,
      amountLabel: '250,000,000',
      shareOfSupply: 25,
      schedule: 'No unlock before 29 Jul 2027, then 36 monthly releases',
      unlockCadence: 'Monthly after cliff',
      unlockPerPeriodLabel: '6,944,444 LEVI / month',
      nextUnlockLabel: 'First unlock 29 Jul 2027',
      recipientLabel: 'Team recipient',
      recipientAddress: 'GvS6K2HCyW42Lgtg3a4Te53uM3EMXwAwyb4m6ftPBC6K',
      immutable: true,
    },
    {
      id: 'ecosystem',
      category: 'ecosystem' as const,
      label: 'Ecosystem and grants lock',
      address: 'J1L8QzmHGChv3YKduRi2DN6bvtmev2tnjL51W7DnmDHZ',
      status: 'live' as const,
      amountLabel: '100,000,000',
      shareOfSupply: 10,
      schedule: 'Linear across 24 months from 29 Jul 2026',
      unlockCadence: 'Monthly',
      unlockPerPeriodLabel: '4.1666M LEVI / month',
      nextUnlockLabel: '29 Aug 2026, 07:09 GMT+3',
      recipientLabel: 'Treasury multisig (not a personal wallet)',
      recipientAddress: 'ALxuDYPT5BYE5jWW5zF4BK8o1KXAwPcrt7SGdUspjNNr',
      immutable: true,
    },
  ] satisfies VestStream[],
} as const

/** @deprecated Use SUPPLY_LOCKS. Kept as alias for the team row only. */
export const TEAM_VEST = {
  provider: SUPPLY_LOCKS.provider,
  providerUrl: SUPPLY_LOCKS.providerUrl,
  amount: 250_000_000,
  amountLabel: '250,000,000',
  shareOfSupply: 25,
  schedule: 'No unlock before 29 Jul 2027, then 36 monthly releases',
  summary:
    '250,000,000 $LEVI (25% team allocation) is locked on Streamflow. Immutable and non-cancellable. Nothing unlocks before 29 July 2027, then monthly for 36 months.',
  streams: SUPPLY_LOCKS.streams.filter((s) => s.category === 'team'),
} as const

export function streamflowContractUrl(address: string): string {
  return `https://app.streamflow.finance/contract/solana/mainnet/${address}`
}

export function vestExplorerUrl(address: string): string {
  return `https://solscan.io/account/${address}`
}

