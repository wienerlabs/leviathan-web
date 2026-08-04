import { useMemo, useState } from 'react'
import type { JoinedRun } from '../../data/useProtocol'
import type { CoordinatorView, LedgerClient } from '../../data/coordinator'
import {
  AddressLink,
  Badge,
  EmptyRow,
  Meter,
  MiniStat,
  NONE,
  Panel,
  formatCount,
  formatDuration,
  shortAddress,
} from './Primitives'

const ACTIVE_STATES = new Set(['Warmup', 'Round train', 'Round witness'])

export function RunSelector({
  runs,
  selected,
  onSelect,
}: {
  runs: JoinedRun[]
  selected: string | null
  onSelect: (address: string) => void
}) {
  const [query, setQuery] = useState('')
  const [onlyActive, setOnlyActive] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return runs.filter((run) => {
      if (onlyActive && run.coordinator.ledger.length === 0) return false
      if (!needle) return true
      return (
        run.coordinator.runId.toLowerCase().includes(needle) ||
        run.coordinator.address.toLowerCase().includes(needle)
      )
    })
  }, [runs, query, onlyActive])

  return (
    <Panel
      eyebrow="Runs"
      title={`${runs.length} runs on devnet`}
      badge={
        <Badge tone={visible.length === runs.length ? 'quiet' : 'solid'}>
          {visible.length === runs.length
            ? 'all shown'
            : `${visible.length} shown`}
        </Badge>
      }
      footer="Every run the coordinator program has ever opened, newest activity first. Selecting one drives every panel below it."
    >
      <div className="px-5 sm:px-6 py-4 border-b border-black/10 flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by run id or account"
          className="flex-1 h-10 rounded-full border border-black/15 px-4 text-[14px] outline-none focus:border-black transition-colors"
        />
        <button
          type="button"
          onClick={() => setOnlyActive((value) => !value)}
          className={[
            'h-10 rounded-full px-4 text-[14px] border transition-colors shrink-0',
            onlyActive
              ? 'bg-black text-white border-black'
              : 'border-black/15 text-black/70 hover:border-black',
          ].join(' ')}
        >
          Had participants
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyRow>No run matches that filter.</EmptyRow>
      ) : (
        <div className="max-h-[420px] overflow-y-auto divide-y divide-black/[0.06]">
          {visible.map((run) => {
            const isSelected = run.coordinator.address === selected
            const convicted = run.coordinator.convicted
            return (
              <button
                key={run.coordinator.address}
                type="button"
                onClick={() => onSelect(run.coordinator.address)}
                className={[
                  'w-full text-left px-5 sm:px-6 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 transition-colors',
                  isSelected ? 'bg-black/[0.04]' : 'hover:bg-black/[0.02]',
                ].join(' ')}
              >
                <span className="font-mono text-[13px] text-black min-w-0 flex-1 truncate">
                  {run.coordinator.runId || shortAddress(run.coordinator.address)}
                </span>
                <span
                  className={[
                    'text-[12px] rounded-full px-2.5 py-1 shrink-0',
                    ACTIVE_STATES.has(run.coordinator.runState)
                      ? 'bg-black text-white'
                      : 'border border-black/12 text-black/50',
                  ].join(' ')}
                >
                  {run.coordinator.runState}
                </span>
                <span className="text-[12px] text-black/45 tabular-nums shrink-0">
                  {run.coordinator.ledger.length} participants
                </span>
                {convicted > 0 ? (
                  <span className="text-[12px] text-black shrink-0">
                    {convicted} convicted
                  </span>
                ) : null}
                {run.treasury ? (
                  <span className="text-[12px] text-black/40 shrink-0">
                    bonded
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

export function RunOverview({ run }: { run: JoinedRun }) {
  const { coordinator } = run
  const config = coordinator.config
  const step = coordinator.lastStep
  const total = config.totalSteps

  return (
    <Panel
      eyebrow="Run"
      title={coordinator.runId || 'Unnamed run'}
      badge={
        <Badge tone={ACTIVE_STATES.has(coordinator.runState) ? 'solid' : 'quiet'}>
          {coordinator.runState}
        </Badge>
      }
      footer={
        <>
          Coordinator account <AddressLink address={coordinator.address} />
          {run.instance ? (
            <>
              {' '}
              · instance <AddressLink address={run.instance.address} />
            </>
          ) : null}
          {' '}· client build{' '}
          <span className="font-mono text-black/70">
            {coordinator.clientVersion || 'unset'}
          </span>
        </>
      }
    >
      <div className="px-5 sm:px-6 py-5">
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[13px] text-black/45">Training progress</span>
            <span className="text-[14px] tabular-nums">
              {formatCount(step)} of {formatCount(total)} steps
            </span>
          </div>
          <Meter
            value={step}
            max={total}
            label={
              total > 0
                ? `${((step / total) * 100).toFixed(total > 1000 ? 2 : 1)}% complete`
                : 'no step target set'
            }
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat
            label="Round"
            value={coordinator.head ? formatCount(coordinator.head.height) : NONE}
            note={
              coordinator.head
                ? `${coordinator.head.clientsLen} in the draw`
                : 'no active round'
            }
          />
          <MiniStat
            label="Roster"
            value={formatCount(coordinator.epochClients.length)}
            note={`${coordinator.exitedClients.length} exited`}
          />
          <MiniStat
            label="Verification"
            value={`${config.verificationPercent}%`}
            note="of free nodes audit"
          />
          <MiniStat
            label="Witnesses"
            value={
              config.witnessNodes === 0
                ? 'default'
                : formatCount(config.witnessNodes)
            }
            note="per round"
          />
          <MiniStat
            label="Minimum clients"
            value={formatCount(config.minClients)}
            note={`${config.initMinClients} to start`}
          />
          <MiniStat
            label="Batch size"
            value={`${formatCount(config.globalBatchSizeStart)} to ${formatCount(config.globalBatchSizeEnd)}`}
          />
          <MiniStat
            label="Round budget"
            value={formatDuration(config.maxRoundTrainTime)}
            note={`witness ${formatDuration(config.roundWitnessTime)}`}
          />
          <MiniStat
            label="Epoch"
            value={formatDuration(config.epochTime)}
            note={`warmup ${formatDuration(config.warmupTime)}`}
          />
        </div>
      </div>
    </Panel>
  )
}

export function LedgerPanel({ coordinator }: { coordinator: CoordinatorView }) {
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(
    () =>
      [...coordinator.ledger].sort((a, b) => {
        if (a.slashed !== b.slashed) return a.slashed > b.slashed ? 1 : -1
        return b.earned > a.earned ? 1 : b.earned < a.earned ? -1 : 0
      }),
    [coordinator.ledger],
  )

  const visible = showAll ? sorted : sorted.slice(0, 12)
  const peak = sorted.reduce(
    (max, entry) => (entry.earned > max ? entry.earned : max),
    0n,
  )

  return (
    <Panel
      eyebrow="Ledger"
      title="Earned and forfeited"
      badge={
        coordinator.convicted > 0 ? (
          <Badge tone="solid">{coordinator.convicted} convicted</Badge>
        ) : (
          <Badge>no convictions</Badge>
        )
      }
      footer="Points are the coordinator's own ledger, separate from the epoch roster. A convicted participant keeps its row here, which is how the forfeiture is settled at epoch end."
    >
      {sorted.length === 0 ? (
        <EmptyRow>Nobody has joined this run yet.</EmptyRow>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 sm:px-6 py-5 border-b border-black/[0.06]">
            <MiniStat
              label="Total earned"
              value={formatCount(coordinator.totalEarned)}
            />
            <MiniStat
              label="Total forfeited"
              value={formatCount(coordinator.totalSlashed)}
            />
            <MiniStat
              label="Participants"
              value={formatCount(sorted.length)}
            />
          </div>
          <div className="divide-y divide-black/[0.06]">
            {visible.map((entry) => (
              <LedgerRow key={entry.signer} entry={entry} peak={peak} />
            ))}
          </div>
          {sorted.length > 12 ? (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="w-full px-5 sm:px-6 py-3 text-[13px] text-black/55 hover:text-black border-t border-black/[0.06] transition-colors"
            >
              {showAll
                ? 'Show fewer'
                : `Show all ${sorted.length} participants`}
            </button>
          ) : null}
        </>
      )}
    </Panel>
  )
}

function LedgerRow({ entry, peak }: { entry: LedgerClient; peak: bigint }) {
  const slashed = entry.slashed > 0n
  const share = peak > 0n ? Number((entry.earned * 100n) / peak) : 0

  return (
    <div
      className={[
        'px-5 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2',
        slashed ? 'bg-black/[0.02]' : '',
      ].join(' ')}
    >
      <div className="min-w-0 flex-1 flex items-center gap-3">
        <AddressLink address={entry.signer} edge={6} />
        {slashed ? (
          <span className="text-[11px] rounded-full bg-black text-white px-2 py-0.5 shrink-0">
            convicted
          </span>
        ) : null}
      </div>
      <div className="w-full sm:w-40 order-3 sm:order-2">
        <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full ${slashed ? 'bg-black/25' : 'bg-black'}`}
            style={{ width: `${share}%` }}
          />
        </div>
      </div>
      <div className="order-2 sm:order-3 flex items-center gap-5 tabular-nums text-[14px] shrink-0">
        <span title="earned">{formatCount(entry.earned)}</span>
        <span
          className={slashed ? 'text-black' : 'text-black/25'}
          title="forfeited"
        >
          {formatCount(entry.slashed)}
        </span>
      </div>
    </div>
  )
}

export function RosterPanel({ coordinator }: { coordinator: CoordinatorView }) {
  const roster = coordinator.epochClients
  const exited = coordinator.exitedClients

  if (roster.length === 0 && exited.length === 0) {
    return (
      <Panel
        eyebrow="Roster"
        title="Who is in the epoch"
        footer="The epoch roster is zeroed at the start of every epoch, so an empty roster on a finished run is expected."
      >
        <EmptyRow>This epoch has no roster.</EmptyRow>
      </Panel>
    )
  }

  return (
    <Panel
      eyebrow="Roster"
      title="Who is in the epoch"
      badge={<Badge>{roster.length} active</Badge>}
      footer="The roster is the list the committee lottery draws from. Exited rows carry the round height they left at, which is what the epoch-end settlement matches on."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-[14px]">
          <thead>
            <tr className="text-left text-[12px] text-black/40">
              <th className="px-5 sm:px-6 py-3 font-normal">Participant</th>
              <th className="px-3 py-3 font-normal">State</th>
              <th className="px-3 py-3 font-normal">Index</th>
              <th className="px-5 sm:px-6 py-3 font-normal text-right">
                Exited at
              </th>
            </tr>
          </thead>
          <tbody>
            {roster.map((client, index) => (
              <tr
                key={`active-${client.signer}`}
                className="border-t border-black/[0.06]"
              >
                <td className="px-5 sm:px-6 py-3">
                  <AddressLink address={client.signer} edge={6} />
                </td>
                <td className="px-3 py-3">{client.state}</td>
                <td className="px-3 py-3 tabular-nums text-black/50">{index}</td>
                <td className="px-5 sm:px-6 py-3 text-right tabular-nums text-black/40">
                  {NONE}
                </td>
              </tr>
            ))}
            {exited.map((client) => (
              <tr
                key={`exited-${client.signer}`}
                className="border-t border-black/[0.06] bg-black/[0.02]"
              >
                <td className="px-5 sm:px-6 py-3">
                  <AddressLink address={client.signer} edge={6} />
                </td>
                <td className="px-3 py-3 text-black/55">{client.state}</td>
                <td className="px-3 py-3 tabular-nums text-black/40">exited</td>
                <td className="px-5 sm:px-6 py-3 text-right tabular-nums text-black/55">
                  {formatCount(client.exitedHeight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
