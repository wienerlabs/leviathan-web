import raw from './phase0-results.json'

type ScenarioResult = {
  scenario: {
    key: string
    label: string
  }
  val_losses: number[]
  final_val_loss: number
  caught_rounds: Record<string, number>
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

export const LOSS_SERIES = [
  {
    key: 'honest',
    source: 'honest-mean-iid',
    label: 'Honest mean',
    stroke: '#000000',
    strokeWidth: 2.5,
    dash: undefined as string | undefined,
    opacity: 1,
  },
  {
    key: 'signflipMean',
    source: 'signflip-mean-iid',
    label: 'Sign flip vs mean',
    stroke: '#000000',
    strokeWidth: 1.75,
    dash: '2 4',
    opacity: 0.35,
  },
  {
    key: 'signflipClip',
    source: 'signflip-clip-iid',
    label: 'Sign flip vs clip',
    stroke: '#000000',
    strokeWidth: 2,
    dash: '8 4',
    opacity: 0.75,
  },
  {
    key: 'alieClip',
    source: 'alie-clip-iid',
    label: 'ALIE vs clip',
    stroke: '#000000',
    strokeWidth: 2,
    dash: '1 3',
    opacity: 0.55,
  },
  {
    key: 'alieAudit',
    source: 'alie-clip-audit-iid',
    label: 'ALIE vs clip + audit',
    stroke: '#000000',
    strokeWidth: 2.75,
    dash: undefined as string | undefined,
    opacity: 1,
  },
  {
    key: 'honestNonIid',
    source: 'honest-clip-noniid',
    label: 'Honest non-IID clip',
    stroke: '#000000',
    strokeWidth: 1.5,
    dash: '12 4 2 4',
    opacity: 0.45,
  },
] as const

export const lossChartData = Array.from({ length: PHASE0_CONFIG.rounds }, (_, i) => {
  const row: Record<string, number> = { round: i + 1 }
  for (const series of LOSS_SERIES) {
    const losses = data.scenarios[series.source]?.val_losses
    if (losses) row[series.key] = Number(losses[i].toFixed(4))
  }
  return row
})

export const lossFinals = LOSS_SERIES.map((series) => ({
  key: series.key,
  label: series.label,
  final: data.scenarios[series.source]?.final_val_loss ?? 0,
}))

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
    const short =
      preset.startsWith('125M')
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
  { key: 'proof125M', label: '125M proof', opacity: 0.35 },
  { key: 'genesis1B', label: '1B genesis', opacity: 0.65 },
  { key: 'scale7B', label: '7B scale', opacity: 1 },
] as const

export const bondAtP10 = BOND_SERIES.map((s) => {
  const row = bondChartData.find((r) => r.p === 0.1)
  return {
    key: s.key,
    label: s.label,
    bond: Number(row?.[s.key] ?? 0),
  }
})
