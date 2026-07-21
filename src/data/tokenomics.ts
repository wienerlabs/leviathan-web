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
    purpose: 'Build and operate (1y cliff, 3y linear)',
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
    purpose: 'Tooling, relays, research',
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
    purpose: 'CEX/DEX depth if pursued',
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

export const PRESET_ECONOMICS: PresetEconomics[] = [
  {
    key: '125m',
    label: '125M proof',
    short: '125M',
    roundCostUsd: 0.01198902210024556,
    roundRewardUsd: 0.014386826520294672,
    bondAtP10Usd: 0.12948143868265205,
    fill: '#d4d4d4',
  },
  {
    key: '1b',
    label: '1B genesis',
    short: '1B',
    roundCostUsd: 0.2397804420049112,
    roundRewardUsd: 0.2877365304058934,
    bondAtP10Usd: 2.589628773653041,
    fill: '#737373',
  },
  {
    key: '7b',
    label: '7B scale',
    short: '7B',
    roundCostUsd: 3.356926188068757,
    roundRewardUsd: 4.028311425682508,
    bondAtP10Usd: 36.25480283114257,
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
  burnShareOfRewards: 0.09166666666666667,
}

export const burnShareData = AUDIT_PS.map((p) => ({
  p,
  pLabel: `${Math.round(p * 100)}%`,
  burnShare: Number(((p * 1.1) / 1.2).toFixed(4)),
  burnPct: Number((((p * 1.1) / 1.2) * 100).toFixed(2)),
}))

export const GENESIS_OP = {
  auditProbability: 0.1,
  toleranceBand: 0.05,
  roundRewardUsd: 0.2877365304058934,
  bondUsd: 2.589628773653041,
  bondRoundsOfReward: 9,
  expectedCatchRounds: 10,
  auditBurnShare: 0.09166666666666669,
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
    hint: 'From 15% (+10pp from rewards)',
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
