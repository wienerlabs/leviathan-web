import raw from './phase0-results.json'

type ScenarioResult = {
  scenario: {
    key: string
    label: string
  }
  val_losses: number[]
  final_val_loss: number
  caught_rounds: Record<string, number>
  malicious_selection_rate: number | null
  honest_fpr: number
}

type EconomyRow = {
  preset: string
  audit_probability: number
  break_even_bond_usd: number
  expected_rounds_to_catch: number
  round_reward_usd: number
}

type ResultsFile = {
  config: {
    rounds: number
    workers: number
    model_parameters: number
  }
  scenarios: Record<string, ScenarioResult>
  economy_calibration: EconomyRow[]
}

const data = raw as ResultsFile

export const PHASE0_CONFIG = data.config

export type LossSeriesKey =
  | 'honest'
  | 'signflipMean'
  | 'signflipClip'
  | 'alieClip'
  | 'alieAudit'
  | 'honestNonIid'

export const LOSS_SERIES: {
  key: LossSeriesKey
  source: string
  label: string
  short: string
  role: 'baseline' | 'failure' | 'defense' | 'stealth' | 'robust'
  strokeWidth: number
  dash?: string
  opacity: number
}[] = [
  {
    key: 'honest',
    source: 'honest-mean-iid',
    label: 'Honest swarm, mean',
    short: 'Honest',
    role: 'baseline',
    strokeWidth: 2.75,
    opacity: 1,
  },
  {
    key: 'signflipMean',
    source: 'signflip-mean-iid',
    label: 'Sign flip vs mean',
    short: 'Flip / mean',
    role: 'failure',
    strokeWidth: 1.75,
    dash: '2 5',
    opacity: 0.28,
  },
  {
    key: 'signflipClip',
    source: 'signflip-clip-iid',
    label: 'Sign flip vs clip',
    short: 'Flip / clip',
    role: 'defense',
    strokeWidth: 2.25,
    dash: '7 4',
    opacity: 0.78,
  },
  {
    key: 'alieClip',
    source: 'alie-clip-iid',
    label: 'ALIE vs clip',
    short: 'ALIE / clip',
    role: 'stealth',
    strokeWidth: 2,
    dash: '1.5 3.5',
    opacity: 0.5,
  },
  {
    key: 'alieAudit',
    source: 'alie-clip-audit-iid',
    label: 'ALIE vs clip + audit',
    short: 'ALIE / audit',
    role: 'robust',
    strokeWidth: 2.75,
    opacity: 1,
  },
  {
    key: 'honestNonIid',
    source: 'honest-clip-noniid',
    label: 'Honest non-IID, clip',
    short: 'Non-IID',
    role: 'baseline',
    strokeWidth: 1.75,
    dash: '10 4 2 4',
    opacity: 0.4,
  },
]

export const lossChartData = Array.from(
  { length: PHASE0_CONFIG.rounds },
  (_, i) => {
    const row: Record<string, number> = { round: i + 1 }
    for (const series of LOSS_SERIES) {
      const losses = data.scenarios[series.source]?.val_losses
      if (losses) row[series.key] = Number(losses[i].toFixed(4))
    }
    return row
  },
)

export const lossFinals = LOSS_SERIES.map((series) => {
  const sc = data.scenarios[series.source]
  return {
    key: series.key,
    label: series.label,
    short: series.short,
    role: series.role,
    final: sc?.final_val_loss ?? 0,
    maliciousRate: sc?.malicious_selection_rate,
    honestFpr: sc?.honest_fpr ?? 0,
  }
})

export const HONEST_FINAL =
  data.scenarios['honest-mean-iid']?.final_val_loss ?? 2.175

const caught = data.scenarios['alie-clip-audit-iid']?.caught_rounds ?? {}
const catchValues = Object.values(caught)

export const AUDIT_CATCH = {
  theoretical: 10,
  observedMean:
    catchValues.length > 0
      ? catchValues.reduce((a, b) => a + b, 0) / catchValues.length
      : 0,
  perWorker: Object.entries(caught)
    .map(([id, round]) => ({
      worker: `M${Number(id) + 1}`,
      id: Number(id),
      round,
    }))
    .sort((a, b) => a.round - b.round),
}

export const economyByPreset = (() => {
  const map = new Map<string, EconomyRow[]>()
  for (const row of data.economy_calibration) {
    const list = map.get(row.preset) ?? []
    list.push(row)
    map.set(row.preset, list)
  }
  return map
})()

export const bondChartData = [0.02, 0.05, 0.1, 0.2, 0.3].map((p) => {
  const row: Record<string, number | string> = {
    pLabel: `${Math.round(p * 100)}%`,
    p,
  }
  for (const [preset, rows] of economyByPreset) {
    const hit = rows.find((r) => r.audit_probability === p)
    if (!hit) continue
    const short = preset.startsWith('125M')
      ? 'proof125M'
      : preset.startsWith('1B')
        ? 'genesis1B'
        : 'scale7B'
    row[short] = Number(hit.break_even_bond_usd.toFixed(4))
    row.expectedCatch = hit.expected_rounds_to_catch
  }
  return row
})

export const BOND_SERIES = [
  {
    key: 'proof125M' as const,
    label: '125M proof',
    fill: '#d4d4d4',
    stroke: '#000',
  },
  {
    key: 'genesis1B' as const,
    label: '1B genesis',
    fill: '#737373',
    stroke: '#000',
  },
  {
    key: 'scale7B' as const,
    label: '7B scale',
    fill: '#000000',
    stroke: '#000',
  },
]

export const bondAtP10 = BOND_SERIES.map((s) => {
  const row = bondChartData.find((r) => r.p === 0.1)
  return {
    key: s.key,
    label: s.label,
    bond: Number(row?.[s.key] ?? 0),
    fill: s.fill,
  }
})

export const PHASE0_KPIS = [
  {
    label: 'Honest final loss',
    value: HONEST_FINAL.toFixed(3),
    hint: 'Reference baseline',
  },
  {
    label: 'Clip holds sign-flip',
    value: (
      data.scenarios['signflip-clip-iid']?.final_val_loss ?? 0
    ).toFixed(3),
    hint: 'vs mean diverged at 12.0',
  },
  {
    label: 'Audit catch mean',
    value: `${AUDIT_CATCH.observedMean.toFixed(1)}r`,
    hint: `Theory 1/p = ${AUDIT_CATCH.theoretical}r`,
  },
  {
    label: 'Honest FPR',
    value: '0%',
    hint: 'Non-IID clip run',
  },
]
