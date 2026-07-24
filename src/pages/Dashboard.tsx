import { useEffect, useMemo, useState } from 'react'
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
import { useChartColors } from '../theme/useChartColors'
import {
  fetchTelemetry,
  type RunTelemetry,
  SAMPLE_TELEMETRY,
} from '../data/telemetry'

const fmt = (n: number) => n.toLocaleString('en-US')
const short = (s: string) => (s.length > 12 ? `${s.slice(0, 6)}...${s.slice(-4)}` : s)

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-5"
      style={{ border: '1px solid var(--line)', background: 'var(--canvas)' }}
    >
      <span style={{ color: 'var(--ink-muted)' }} className="text-sm">
        {label}
      </span>
      <span style={{ color: 'var(--ink)' }} className="text-3xl">
        {value}
      </span>
      {note && (
        <span style={{ color: 'var(--ink-faint)' }} className="text-xs">
          {note}
        </span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<RunTelemetry>(SAMPLE_TELEMETRY)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const colors = useChartColors()

  useEffect(() => {
    let cancelled = false
    const load = () =>
      fetchTelemetry().then(({ data, live }) => {
        if (cancelled) return
        setTelemetry(data)
        setLive(live)
        setLoading(false)
      })
    load()
    const timer = setInterval(load, 15000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  const chartData = useMemo(
    () =>
      telemetry.leaderboard.map((client) => ({
        name: short(client.signer),
        earned: client.earned,
        slashed: client.slashed,
      })),
    [telemetry.leaderboard],
  )

  const security = telemetry.security
  const secure = security?.economically_secure ?? false

  return (
    <div style={{ background: 'var(--canvas)', color: 'var(--ink)' }} className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl">Network dashboard</h1>
            <span
              className="rounded-full px-3 py-1 text-xs"
              style={{
                border: '1px solid var(--line-strong)',
                color: 'var(--ink)',
              }}
            >
              {live ? 'live' : loading ? 'loading' : 'sample'}
            </span>
          </div>
          <p style={{ color: 'var(--ink-soft)' }} className="max-w-2xl">
            The state of run <span style={{ fontStyle: 'italic' }}>{telemetry.run_id}</span> as
            read from the coordinator account. Rewards and slashing are denominated in on-chain
            proof of gradient points.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
            <span>state: {telemetry.run_state}</span>
            <span>epoch {telemetry.epoch}</span>
            <span>step {telemetry.step}</span>
            <span>audit probability p = {telemetry.audit_probability}</span>
          </div>
        </header>

        <section className="mb-10 grid grid-cols-2 gap-px md:grid-cols-3" style={{ background: 'var(--line)' }}>
          <Tile label="Registered" value={fmt(telemetry.registered_clients)} note="participants on the run" />
          <Tile label="Active this epoch" value={fmt(telemetry.active_clients)} />
          <Tile label="Convicted" value={fmt(telemetry.convicted_clients)} note="ejected by a slash" />
          <Tile label="Total earned" value={fmt(telemetry.total_earned)} note="proof of gradient points" />
          <Tile label="Total slashed" value={fmt(telemetry.total_slashed)} note="forfeited to the vault" />
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

        {security && (
          <section
            className="mb-10 p-6"
            style={{ border: `1px solid ${secure ? 'var(--line-strong)' : 'var(--line)'}` }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-2xl">Economic security</h2>
              <span className="text-lg" style={{ color: 'var(--ink)' }}>
                {secure ? 'secure' : 'not secure'}
              </span>
            </div>
            <p style={{ color: 'var(--ink-soft)' }} className="mb-5 max-w-2xl text-sm">
              A run is economically secure when the expected value of cheating for one round is at
              most zero. The effective penalty is the smaller of the slash and the cheater bond.
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-sm">
              <div className="flex flex-col gap-1">
                <span style={{ color: 'var(--ink-muted)' }}>Break-even penalty</span>
                <span className="text-xl">
                  {security.break_even_penalty === null ? 'n/a' : security.break_even_penalty.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ color: 'var(--ink-muted)' }}>Effective penalty</span>
                <span className="text-xl">{security.effective_penalty.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ color: 'var(--ink-muted)' }}>Expected fraud value</span>
                <span className="text-xl">{security.expected_fraud_value_per_round.toFixed(3)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ color: 'var(--ink-muted)' }}>Audit probability</span>
                <span className="text-xl">{security.audit_probability}</span>
              </div>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-2xl">Rewards by participant</h2>
          <div style={{ border: '1px solid var(--line)' }} className="p-4">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={colors.grid} vertical={false} />
                <XAxis dataKey="name" stroke={colors.ink} tick={{ fill: colors.tick, fontSize: 12 }} />
                <YAxis stroke={colors.ink} tick={{ fill: colors.tick, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: colors.paper,
                    border: `1px solid ${colors.ink}`,
                    color: colors.ink,
                    fontFamily: 'var(--font-latex)',
                  }}
                  cursor={{ fill: colors.grid }}
                />
                <Bar dataKey="earned" name="earned">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.slashed > 0 ? colors.faint : colors.ink} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl">Leaderboard</h2>
          <div style={{ border: '1px solid var(--line)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--ink-muted)' }}>
                  <th className="px-4 py-3 text-left font-normal">Participant</th>
                  <th className="px-4 py-3 text-right font-normal">Earned</th>
                  <th className="px-4 py-3 text-right font-normal">Slashed</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.leaderboard.map((client) => (
                  <tr key={client.signer} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td className="px-4 py-3" style={{ fontFamily: 'var(--font-latex-tt)' }}>
                      {short(client.signer)}
                    </td>
                    <td className="px-4 py-3 text-right">{fmt(client.earned)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: client.slashed > 0 ? 'var(--ink)' : 'var(--ink-faint)' }}>
                      {fmt(client.slashed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {telemetry.generated_at && (
            <p style={{ color: 'var(--ink-faint)' }} className="mt-4 text-xs">
              Last read {telemetry.generated_at}. Fed by leviathan-indexer.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
