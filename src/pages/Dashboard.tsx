import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SiteHeader from '../components/SiteHeader'
import { ChartTooltipBox } from '../components/charts/ChartShell'
import { makeLatexTick } from '../components/charts/latex'
import { useChartColors } from '../theme/useChartColors'
import {
  fetchTelemetry,
  type ClientEntry,
  type RunTelemetry,
  SAMPLE_TELEMETRY,
} from '../data/telemetry'
import SupplyPanel from '../components/dashboard/SupplyPanel'
import ProgramsPanel from '../components/dashboard/ProgramsPanel'
import MarketPanel from '../components/dashboard/MarketPanel'
import { useChainFacts } from '../data/useChainFacts'
import { LEVI } from '../data/levi'

const fmt = (n: number) => n.toLocaleString('en-US')
const short = (s: string) =>
  s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s

function Tile({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <div className="rounded-[20px] border border-black/12 bg-white px-5 py-5 flex flex-col gap-1.5 min-h-[112px]">
      <span className="text-[13px] text-black/45">{label}</span>
      <span className="text-[28px] sm:text-[32px] tabular-nums tracking-tight leading-none text-black">
        {value}
      </span>
      {note ? (
        <span className="text-[12px] text-black/40 leading-snug">{note}</span>
      ) : null}
    </div>
  )
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; payload: { slashed: number } }[]
  label?: string
}) {
  const colors = useChartColors()
  if (!active || !payload?.length) return null
  const row = payload[0]
  return (
    <ChartTooltipBox
      label={String(label ?? '')}
      rows={[
        {
          name: 'Earned',
          value: fmt(row.value),
          swatch: row.payload.slashed > 0 ? colors.faint : colors.ink,
        },
        {
          name: 'Slashed',
          value: fmt(row.payload.slashed),
          muted: row.payload.slashed === 0,
        },
      ]}
    />
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-[20px] border border-black/10 bg-black/[0.03] animate-pulse ${className}`}
    />
  )
}

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<RunTelemetry>(SAMPLE_TELEMETRY)
  const [live, setLive] = useState(false)
  const [fixture, setFixture] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const colors = useChartColors()
  const tick = makeLatexTick(colors.tick)

  const load = useCallback(() => {
    return fetchTelemetry().then(({ data, live: isLive, fixture: isFixture, error: err }) => {
      setTelemetry(data)
      setLive(isLive)
      setFixture(isFixture)
      setError(err)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = () => {
      load().then(() => {
        if (cancelled) return
      })
    }
    run()
    const timer = setInterval(run, 15000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [load])

  const chartData = useMemo(
    () =>
      telemetry.leaderboard.map((client) => ({
        name: short(client.signer),
        full: client.signer,
        earned: client.earned,
        slashed: client.slashed,
      })),
    [telemetry.leaderboard],
  )

  const chain = useChainFacts()

  const security = telemetry.security
  const secure = security?.economically_secure ?? false
  const emptyBoard = !loading && telemetry.leaderboard.length === 0

  const statusLabel = loading
    ? 'loading'
    : fixture
      ? 'sample'
      : live
        ? 'live'
        : 'offline'

  const statusTone =
    statusLabel === 'live'
      ? 'bg-black text-white border-black'
      : statusLabel === 'sample'
        ? 'border-black/20 text-black/60'
        : 'border-black/15 text-black/45'

  return (
    <div className="min-h-screen bg-white text-black font-manrope">
      <SiteHeader variant="sticky" />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <p className="text-[13px] tracking-[0.08em] text-black/40">
              Network
            </p>
            <span
              className={`inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium ${statusTone}`}
            >
              {statusLabel}
            </span>
            {fixture ? (
              <span className="text-[12px] text-black/40">
                Demo fixture · not chain-live
              </span>
            ) : null}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-italiana text-[36px] sm:text-[44px] md:text-[52px] leading-[1.06] tracking-tight mb-3">
                Network dashboard
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-relaxed text-black/60 max-w-[40rem]">
                Coordinator state for run{' '}
                <span className="font-mono text-[15px] text-black/80">
                  {telemetry.run_id}
                </span>
                . Earned and slashed are on-chain proof of gradient points.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLoading(true)
                  load()
                }}
                className="inline-flex h-10 items-center rounded-full border border-black px-4 text-[14px] font-medium hover:bg-black hover:text-white transition-colors"
              >
                Refresh
              </button>
              <Link
                to="/docs/protocol/economics"
                className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/70 hover:border-black hover:text-black transition-colors"
              >
                Economics
              </Link>
              <Link
                to="/docs/protocol/committee-vote"
                className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/70 hover:border-black hover:text-black transition-colors"
              >
                Committee vote
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <MetaChip label="State" value={telemetry.run_state} />
            <MetaChip label="Epoch" value={String(telemetry.epoch)} />
            <MetaChip label="Step" value={String(telemetry.step)} />
            <MetaChip
              label="p"
              value={String(telemetry.audit_probability)}
            />
            <RunIdChip runId={telemetry.run_id} />
          </div>

          {error ? (
            <div className="mt-4 rounded-[18px] border border-black/15 bg-black/[0.03] px-4 py-3 text-[13px] text-black/60">
              Live fetch failed ({error}). Showing bundled sample telemetry.
            </div>
          ) : null}
          {fixture && !error ? (
            <div className="mt-4 rounded-[18px] border border-black/12 bg-black/[0.03] px-4 py-3 text-[13px] leading-relaxed text-black/55">
              Numbers below are from the repo fixture (
              <CodeLite>public/telemetry.json</CodeLite>
              ). Wire{' '}
              <CodeLite>VITE_TELEMETRY_URL</CodeLite> or overwrite that file
              with <CodeLite>leviathan-indexer</CodeLite> output for chain-live
              data.
            </div>
          ) : null}
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-[112px]" />
              ))}
            </div>
            <SkeletonBlock className="h-[200px]" />
            <SkeletonBlock className="h-[320px]" />
            <SkeletonBlock className="h-[240px]" />
          </div>
        ) : (
          <>
            <section className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-3">
              <Tile
                label="Registered"
                value={fmt(telemetry.registered_clients)}
                note="participants on the run"
              />
              <Tile
                label="Active this epoch"
                value={fmt(telemetry.active_clients)}
              />
              <Tile
                label="Convicted"
                value={fmt(telemetry.convicted_clients)}
                note="ejected by a slash"
              />
              <Tile
                label="Total earned"
                value={fmt(telemetry.total_earned)}
                note="proof of gradient points"
              />
              <Tile
                label="Total slashed"
                value={fmt(telemetry.total_slashed)}
                note="forfeited to the vault"
              />
              <Tile
                label="Verification"
                value={`${telemetry.verification_percent}%`}
                note={
                  telemetry.expected_rounds_to_catch
                    ? `~${Math.round(telemetry.expected_rounds_to_catch)} rounds to catch`
                    : undefined
                }
              />
            </section>

            <MarketPanel market={chain.market} loading={chain.loading} />

            <SupplyPanel
              mint={chain.mint}
              breakdown={chain.supply}
              loading={chain.loading}
            />

            <ProgramsPanel
              programs={chain.programs}
              cluster="devnet"
              multisig={LEVI.squads}
              loading={chain.loading}
            />

            {security ? (
              <section className="mb-8 rounded-[24px] border border-black bg-white overflow-hidden">
                <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
                      Economic security
                    </p>
                    <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
                      Is cheating expected-negative?
                    </h2>
                  </div>
                  <span
                    className={[
                      'inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium',
                      secure
                        ? 'bg-black text-white'
                        : 'border border-black/20 text-black/60',
                    ].join(' ')}
                  >
                    {secure ? 'secure' : 'not secure'}
                  </span>
                </div>
                <div className="px-5 sm:px-6 py-5">
                  <p className="text-[14px] sm:text-[15px] leading-relaxed text-black/55 max-w-[40rem] mb-5">
                    Expected value of cheating for one round should be at most
                    zero. Effective penalty is the smaller of slash and cheater
                    bond. Sample uses the published floors (break-even $2.91 vs
                    verifier-aware effective $10.55).
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MiniStat
                      label="Break-even penalty"
                      value={
                        security.break_even_penalty === null
                          ? 'n/a'
                          : security.break_even_penalty.toFixed(2)
                      }
                    />
                    <MiniStat
                      label="Effective penalty"
                      value={security.effective_penalty.toFixed(2)}
                    />
                    <MiniStat
                      label="Expected fraud value"
                      value={security.expected_fraud_value_per_round.toFixed(3)}
                    />
                    <MiniStat
                      label="Audit probability"
                      value={String(security.audit_probability)}
                    />
                  </div>
                  <p className="mt-4 text-[13px] text-black/45">
                    Bond floors explained in{' '}
                    <Link
                      to="/docs/protocol/economics"
                      className="underline underline-offset-2 decoration-black/25 hover:decoration-black"
                    >
                      Economics
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/blog/bond-was-too-low"
                      className="underline underline-offset-2 decoration-black/25 hover:decoration-black"
                    >
                      the bond correction note
                    </Link>
                    .
                  </p>
                </div>
              </section>
            ) : null}

            <section className="mb-8 rounded-[24px] border border-black bg-white overflow-hidden">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
                    Distribution
                  </p>
                  <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
                    Rewards by participant
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3 text-[12px] text-black/50">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-black" />
                    Earned (healthy)
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-black/25 border border-black/20" />
                    Earned (slashed peer)
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-5 chart-latex">
                {emptyBoard ? (
                  <div className="h-[280px] flex items-center justify-center text-[15px] text-black/45">
                    No participants in this telemetry snapshot.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
                    >
                      <CartesianGrid
                        stroke={colors.grid}
                        vertical={false}
                        strokeDasharray="3 6"
                      />
                      <XAxis
                        dataKey="name"
                        tick={tick}
                        tickLine={false}
                        axisLine={{ stroke: colors.ink, strokeOpacity: 0.12 }}
                      />
                      <YAxis
                        tick={tick}
                        tickLine={false}
                        axisLine={false}
                        width={48}
                      />
                      <Tooltip
                        content={<ChartTip />}
                        cursor={{ fill: colors.grid }}
                        isAnimationActive={false}
                      />
                      <Bar dataKey="earned" name="earned" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              entry.slashed > 0 ? colors.faint : colors.ink
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="mb-10 rounded-[24px] border border-black bg-white overflow-hidden">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10">
                <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
                  Ranking
                </p>
                <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
                  Leaderboard
                </h2>
              </div>
              {emptyBoard ? (
                <div className="px-5 py-12 text-center text-[15px] text-black/45">
                  No leaderboard rows yet.
                </div>
              ) : (
                <>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[520px] text-[14px] sm:text-[15px]">
                      <thead>
                        <tr className="border-b border-black/10 bg-black/[0.02] text-black/45">
                          <th className="px-5 py-3 text-left font-medium">
                            Participant
                          </th>
                          <th className="px-5 py-3 text-right font-medium">
                            Earned
                          </th>
                          <th className="px-5 py-3 text-right font-medium">
                            Slashed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {telemetry.leaderboard.map((client) => (
                          <LeaderRow key={client.signer} client={client} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:hidden divide-y divide-black/10">
                    {telemetry.leaderboard.map((client) => (
                      <div
                        key={client.signer}
                        className={[
                          'px-5 py-4',
                          client.slashed > 0 ? 'opacity-50' : '',
                        ].join(' ')}
                      >
                        <p className="font-mono text-[13px] text-black/80 break-all mb-2">
                          {short(client.signer)}
                        </p>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-black/45">Earned</span>
                          <span className="tabular-nums">
                            {fmt(client.earned)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[13px] mt-1">
                          <span className="text-black/45">Slashed</span>
                          <span className="tabular-nums">
                            {fmt(client.slashed)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="border-t border-black/10 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12px] text-black/40">
                <p>
                  {telemetry.generated_at
                    ? `Snapshot ${telemetry.generated_at}`
                    : 'No generated_at in payload'}
                  . Refresh every 15s.
                </p>
                <p>
                  Fed by{' '}
                  <span className="font-mono text-black/55">
                    leviathan-indexer
                  </span>
                  .
                </p>
              </div>
            </section>

            <footer className="border-t border-black/10 pt-6 pb-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-black/45">
              <Link
                to="/docs/developer/run-a-node"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Run a node
              </Link>
              <Link
                to="/blog/bond-can-actually-be-posted"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Bond CLI
              </Link>
              <Link
                to="/docs/protocol/committee-vote"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Committee vote
              </Link>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-black/[0.02] pl-2.5 pr-3 py-1.5 text-[12px]">
      <span className="text-black/40">{label}</span>
      <span className="font-mono text-black/80">{value}</span>
    </span>
  )
}

function RunIdChip({ runId }: { runId: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(runId)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {
          setCopied(false)
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-black/[0.02] pl-2.5 pr-3 py-1.5 text-[12px] hover:border-black transition-colors"
      title="Copy run id"
    >
      <span className="text-black/40">Run</span>
      <span className="font-mono text-black/80 max-w-[140px] truncate">
        {runId}
      </span>
      <span className="text-black/35">{copied ? 'copied' : 'copy'}</span>
    </button>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-black/10 bg-black/[0.02] px-3.5 py-3">
      <p className="text-[12px] text-black/40 mb-1">{label}</p>
      <p className="text-[20px] tabular-nums tracking-tight">{value}</p>
    </div>
  )
}

function LeaderRow({ client }: { client: ClientEntry }) {
  const slashed = client.slashed > 0
  return (
    <tr
      className={[
        'border-b border-black/8 last:border-0',
        slashed ? 'opacity-45' : '',
      ].join(' ')}
    >
      <td className="px-5 py-3 font-mono text-[13px] text-black/80">
        {short(client.signer)}
      </td>
      <td className="px-5 py-3 text-right tabular-nums">
        {fmt(client.earned)}
      </td>
      <td
        className={[
          'px-5 py-3 text-right tabular-nums',
          slashed ? 'text-black' : 'text-black/30',
        ].join(' ')}
      >
        {fmt(client.slashed)}
      </td>
    </tr>
  )
}

function CodeLite({ children }: { children: string }) {
  return (
    <code className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[12px] font-mono text-black">
      {children}
    </code>
  )
}
