import { useEffect, useState } from 'react'

/**
 * The aggregate hardware view.
 *
 * Nothing in the protocol records hardware, so this cannot come from the chain.
 * It is produced by `leviathan-fleet summarize` in leviathan-net, which folds
 * node self-reports into counts and drops the per-node reports. That is a
 * deliberate limit, not an oversight: the committee lottery is seeded from
 * `Round.random_seed`, which is public, so the verifier seats for a round are
 * already computable by anyone. Attaching hardware to identities would turn
 * that public list into a list of machines to attack.
 */
export type GpuModel = {
  name: string
  count: number
  memory_bytes: number
  compute_capability: string | null
}

export type VersionCount = {
  value: string
  nodes: number
}

export type FleetSummary = {
  nodes_reporting: number
  total_gpus: number
  total_vram_bytes: number
  total_cpu_cores: number
  gpus: GpuModel[]
  driver_versions: VersionCount[]
  cuda_versions: VersionCount[]
  operating_systems: VersionCount[]
  generated_at?: string
}

const FLEET_URL = import.meta.env.VITE_FLEET_URL ?? '/fleet.json'

export type FleetState = {
  fleet: FleetSummary | null
  loading: boolean
  /** True when no fleet has been published yet, which is not an error. */
  absent: boolean
}

export function useFleet(): FleetState {
  const [fleet, setFleet] = useState<FleetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [absent, setAbsent] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(FLEET_URL, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status))
        const data = (await response.json()) as FleetSummary
        if (typeof data.nodes_reporting !== 'number') {
          throw new Error('not a fleet summary')
        }
        setFleet(data)
        setAbsent(data.nodes_reporting === 0)
      })
      .catch(() => {
        if (!controller.signal.aborted) setAbsent(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { fleet, loading, absent }
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** index
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[index]}`
}
