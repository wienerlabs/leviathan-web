import { formatBytes, type FleetSummary } from '../../data/fleet'
import { Badge, EmptyRow, MiniStat, Panel, formatCount } from './Primitives'

export default function FleetPanel({
  fleet,
  absent,
  loading,
}: {
  fleet: FleetSummary | null
  absent: boolean
  loading: boolean
}) {
  const footer = (
    <>
      Self-reported and unverified. Nothing in the protocol records hardware, so
      this cannot come from the chain: it is folded from node reports by{' '}
      <span className="font-mono text-black/70">leviathan-fleet summarize</span>,
      which keeps the counts and drops the reports. Per-node hardware is
      deliberately never published. The committee lottery is seeded from{' '}
      <span className="font-mono text-black/70">random_seed</span>, which is
      public, so the verifier seats for a round are already computable by anyone.
      Naming the machine behind each identity would turn that list into a list of
      boxes to attack, and the audit only works while a cheat cannot predict
      which verifiers to silence.
    </>
  )

  if (loading) {
    return (
      <Panel eyebrow="Hardware" title="What the network runs on" footer={footer}>
        <EmptyRow>Reading the fleet summary.</EmptyRow>
      </Panel>
    )
  }

  if (absent || !fleet || fleet.nodes_reporting === 0) {
    return (
      <Panel
        eyebrow="Hardware"
        title="What the network runs on"
        badge={<Badge>no fleet published</Badge>}
        footer={footer}
      >
        <div className="px-5 sm:px-6 py-8">
          <p className="text-[15px] text-black/55 leading-relaxed max-w-[46rem]">
            No fleet has been published yet. The devnet runs so far were single
            operator, so there was no fleet to summarize. This fills in when the
            genesis run brings up rented capacity and each node reports its own
            inventory.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[16px] border border-black/10 bg-black/[0.02] px-4 py-3.5 text-[12px] font-mono text-black/70">
{`leviathan-fleet report --out node-01.json
leviathan-fleet summarize node-*.json --out fleet.json`}
          </pre>
        </div>
      </Panel>
    )
  }

  const peak = fleet.gpus.reduce((max, gpu) => Math.max(max, gpu.count), 0)

  return (
    <Panel
      eyebrow="Hardware"
      title="What the network runs on"
      badge={<Badge tone="solid">{fleet.nodes_reporting} nodes reporting</Badge>}
      footer={footer}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 sm:px-6 py-5 border-b border-black/[0.06]">
        <MiniStat label="Accelerators" value={formatCount(fleet.total_gpus)} />
        <MiniStat
          label="Total VRAM"
          value={formatBytes(fleet.total_vram_bytes)}
        />
        <MiniStat label="Distinct models" value={formatCount(fleet.gpus.length)} />
        <MiniStat
          label="CPU cores"
          value={formatCount(fleet.total_cpu_cores)}
        />
      </div>

      {fleet.gpus.length === 0 ? (
        <EmptyRow>Every reporting node is CPU only.</EmptyRow>
      ) : (
        <div className="divide-y divide-black/[0.06]">
          {fleet.gpus.map((gpu) => (
            <div
              key={`${gpu.name}-${gpu.memory_bytes}-${gpu.compute_capability}`}
              className="px-5 sm:px-6 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              <span className="text-[14px] min-w-0 flex-1">{gpu.name}</span>
              <span className="text-[13px] text-black/45 tabular-nums shrink-0">
                {formatBytes(gpu.memory_bytes)}
              </span>
              {gpu.compute_capability ? (
                <span className="text-[13px] text-black/40 shrink-0">
                  sm {gpu.compute_capability}
                </span>
              ) : null}
              <div className="w-full sm:w-32 order-last sm:order-none">
                <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${peak > 0 ? (gpu.count / peak) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-[15px] tabular-nums shrink-0 w-10 text-right">
                {formatCount(gpu.count)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 sm:px-6 py-5 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-5">
        <VersionColumn label="Driver" entries={fleet.driver_versions} />
        <VersionColumn label="CUDA" entries={fleet.cuda_versions} />
        <VersionColumn label="Operating system" entries={fleet.operating_systems} />
      </div>
    </Panel>
  )
}

function VersionColumn({
  label,
  entries,
}: {
  label: string
  entries: { value: string; nodes: number }[]
}) {
  return (
    <div>
      <p className="text-[12px] text-black/40 mb-2">{label}</p>
      {entries.length === 0 ? (
        <p className="text-[13px] text-black/35">not reported</p>
      ) : (
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li
              key={entry.value}
              className="flex items-baseline justify-between gap-3 text-[13px]"
            >
              <span className="font-mono text-black/70 truncate">
                {entry.value}
              </span>
              <span className="tabular-nums text-black/40 shrink-0">
                {entry.nodes}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
