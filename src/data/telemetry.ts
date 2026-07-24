// Mirrors leviathan-indexer's RunTelemetry (tools/rust-tools/leviathan-indexer).
// The live binary (leviathan-indexer --features live) reads the coordinator
// account and emits exactly this shape; an ops job writes it to the URL below.

export type ClientEntry = {
  signer: string
  earned: number
  slashed: number
}

export type SecurityAssessment = {
  audit_probability: number
  break_even_penalty: number | null
  effective_penalty: number
  expected_fraud_value_per_round: number
  economically_secure: boolean
}

export type RunTelemetry = {
  run_id: string
  run_state: string
  epoch: number
  step: number
  registered_clients: number
  active_clients: number
  total_earned: number
  total_slashed: number
  convicted_clients: number
  verification_percent: number
  audit_probability: number
  expected_rounds_to_catch: number | null
  leaderboard: ClientEntry[]
  security?: SecurityAssessment | null
  generated_at?: string
}

export const SAMPLE_TELEMETRY: RunTelemetry = {
  run_id: 'leviathan-devnet',
  run_state: 'RoundTrain',
  epoch: 3,
  step: 42,
  registered_clients: 6,
  active_clients: 5,
  total_earned: 12000,
  total_slashed: 200,
  convicted_clients: 1,
  verification_percent: 67,
  audit_probability: 0.1,
  expected_rounds_to_catch: 10,
  leaderboard: [
    { signer: '9n7v7um3LyvqnDRmB9JmyWgjwqAG3ZU3cLhvZRT6R5s4', earned: 3200, slashed: 0 },
    { signer: '6fecea42d851553f2ac3353f4eb6b0bcfa5add9e984c6', earned: 3000, slashed: 0 },
    { signer: '05bd4152ace63b1b2ac3353f4eb6b0bcfa5add9e984c6', earned: 2800, slashed: 0 },
    { signer: '2cWcT87bC3q3ToWtiYqAxD4DQxhqxNB7dHuk4HNBPZcw', earned: 2000, slashed: 0 },
    { signer: '3REF8LzdzijJLaT6PQb646MU1npVzTpn8KWCfnzxMYQ1', earned: 1000, slashed: 0 },
    { signer: 'b1e23a6bd851553f2ac3353f4eb6b0bcfa5add9e984c6', earned: 0, slashed: 200 },
  ],
  security: {
    audit_probability: 0.1,
    break_even_penalty: 2.91,
    effective_penalty: 10.55,
    expected_fraud_value_per_round: -0.76,
    economically_secure: true,
  },
  generated_at: '2026-07-24T00:00:00Z',
}

const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL ?? '/telemetry.json'

export async function fetchTelemetry(): Promise<{ data: RunTelemetry; live: boolean }> {
  try {
    const response = await fetch(TELEMETRY_URL, { cache: 'no-store' })
    if (!response.ok) throw new Error(`telemetry ${response.status}`)
    const data = (await response.json()) as RunTelemetry
    return { data, live: true }
  } catch {
    return { data: SAMPLE_TELEMETRY, live: false }
  }
}
