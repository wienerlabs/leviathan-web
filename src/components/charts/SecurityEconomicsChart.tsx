import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AUDIT_CATCH,
  BOND_SERIES,
  bondAtP10,
  bondChartData,
} from '../../data/phase0'
import { ChartShell, ChartTooltipBox } from './ChartShell'

function BondTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string; color: string }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const rows = payload
    .filter((p) => typeof p.value === 'number' && p.dataKey !== 'expectedCatch')
    .map((p) => {
      const meta = BOND_SERIES.find((s) => s.key === p.dataKey)
      return {
        name: meta?.label ?? p.name,
        value: `$${p.value < 1 ? p.value.toFixed(3) : p.value.toFixed(2)}`,
      }
    })
  const catchRow = payload.find((p) => p.dataKey === 'expectedCatch')
  if (catchRow && typeof catchRow.value === 'number') {
    rows.push({
      name: 'Expected catch',
      value: `${catchRow.value.toFixed(1)} rounds`,
    })
  }
  return <ChartTooltipBox label={`Audit p = ${label}`} rows={rows} />
}

export default function SecurityEconomicsChart() {
  return (
    <div className="space-y-4 md:space-y-6">
      <ChartShell
        title="Break-even bond"
        subtitle="Bond = reward x (1-p)/p · calibrated to H100 market cost"
        legend={
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {BOND_SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-black"
                    style={{ background: `rgba(0,0,0,${s.opacity})` }}
                  />
                  <span className="text-[12px] md:text-[13px] text-black/65">
                    {s.label}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <svg width="28" height="10">
                  <line
                    x1="0"
                    y1="5"
                    x2="28"
                    y2="5"
                    stroke="#000"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </svg>
                <span className="text-[12px] md:text-[13px] text-black/65">
                  Expected rounds to catch
                </span>
              </div>
            </div>
            <div className="text-[12px] md:text-[13px] text-black/50 font-mono">
              at p=0.1 · observed catch {AUDIT_CATCH.observedMean.toFixed(1)}r ·
              theory {AUDIT_CATCH.theoretical}r
            </div>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={bondChartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              stroke="#000"
              strokeOpacity={0.06}
              vertical={false}
            />
            <XAxis
              dataKey="pLabel"
              tickLine={false}
              axisLine={{ stroke: '#000', strokeOpacity: 0.15 }}
              tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis
              yAxisId="bond"
              scale="log"
              domain={[0.02, 250]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 11 }}
              tickFormatter={(v: number) =>
                v >= 1 ? `$${v}` : `$${v.toFixed(2)}`
              }
              width={48}
            />
            <YAxis
              yAxisId="catch"
              orientation="right"
              domain={[0, 55]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 11 }}
              tickFormatter={(v: number) => `${v}r`}
              width={36}
            />
            <Tooltip
              content={<BondTooltip />}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            {BOND_SERIES.map((s, i) => (
              <Bar
                key={s.key}
                yAxisId="bond"
                dataKey={s.key}
                name={s.label}
                fill={`rgba(0,0,0,${s.opacity})`}
                radius={[8, 8, 0, 0]}
                isAnimationActive
                animationDuration={1200}
                animationBegin={i * 120}
                animationEasing="ease-out"
              />
            ))}
            <Line
              yAxisId="catch"
              type="monotone"
              dataKey="expectedCatch"
              name="Expected catch"
              stroke="#000"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 3.5, fill: '#fff', stroke: '#000', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#000' }}
              isAnimationActive
              animationDuration={1400}
              animationBegin={400}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartShell>

      <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
        {bondAtP10.map((item, i) => (
          <div
            key={item.key}
            className="rounded-[24px] border border-black px-5 py-5"
            style={{
              animation: `fadeUp 0.6s ease ${0.15 * i}s both`,
            }}
          >
            <p className="text-[13px] md:text-[14px] text-black/45 mb-2">
              {item.label} · p = 10%
            </p>
            <p className="text-[28px] md:text-[34px] font-semibold tracking-tight font-mono">
              ${item.bond < 1 ? item.bond.toFixed(2) : item.bond.toFixed(1)}
            </p>
            <p className="text-[13px] md:text-[14px] text-black/50 mt-1">
              break-even bond / worker
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-black p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
          <div>
            <p className="text-[18px] md:text-[20px] font-semibold mb-1">
              Audit lottery catch rounds
            </p>
            <p className="text-[14px] md:text-[15px] text-black/50">
              ALIE 5/16 vs clip + audit · five malicious workers
            </p>
          </div>
          <p className="text-[14px] md:text-[15px] font-mono text-black/60">
            mean {AUDIT_CATCH.observedMean.toFixed(1)} · E[1/p] ={' '}
            {AUDIT_CATCH.theoretical}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {AUDIT_CATCH.perWorker.map((w, i) => {
            const max = Math.max(
              ...AUDIT_CATCH.perWorker.map((x) => x.round),
              AUDIT_CATCH.theoretical,
            )
            const h = Math.max(12, (w.round / max) * 100)
            return (
              <div key={w.worker} className="flex flex-col items-center gap-2">
                <div className="w-full h-[110px] md:h-[130px] flex items-end justify-center">
                  <div
                    className="w-full max-w-[48px] rounded-t-[12px] bg-black origin-bottom"
                    style={{
                      height: `${h}%`,
                      animation: `growBar 0.9s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s both`,
                    }}
                  />
                </div>
                <p className="text-[12px] md:text-[13px] font-medium">
                  {w.worker}
                </p>
                <p className="text-[12px] md:text-[13px] font-mono text-black/50">
                  r{w.round}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
