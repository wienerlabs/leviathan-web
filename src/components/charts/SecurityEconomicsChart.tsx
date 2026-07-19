import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
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
  PHASE0_KPIS,
} from '../../data/phase0'
import { ChartShell, ChartTooltipBox, MetricPill } from './ChartShell'

function BondTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string }[]
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
        swatch: meta?.fill,
      }
    })
  const catchRow = payload.find((p) => p.dataKey === 'expectedCatch')
  if (catchRow && typeof catchRow.value === 'number') {
    rows.push({
      name: 'E[catch]',
      value: `${catchRow.value.toFixed(1)} rounds`,
      swatch: 'transparent',
    })
  }
  return (
    <ChartTooltipBox
      label={`Audit probability ${label}`}
      rows={rows}
      footer="Break-even bond = reward x (1-p)/p"
    />
  )
}

function CatchTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const maxRound = 30
  const theory = AUDIT_CATCH.theoretical

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="rounded-[32px] border border-black bg-white overflow-hidden"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] text-black/40 mb-2">
            Figure 03
          </p>
          <h3 className="font-italiana text-[28px] md:text-[36px] leading-[1.05]">
            Audit lottery timeline
          </h3>
          <p className="mt-2 text-[15px] md:text-[16px] text-black/55 max-w-[520px]">
            ALIE 5/16 vs clip + audit at p = 0.1. Each marker is the round a
            malicious worker was first convicted.
          </p>
        </div>
        <div className="flex gap-3">
          <MetricPill
            label="Observed mean"
            value={`${AUDIT_CATCH.observedMean.toFixed(1)}r`}
          />
          <MetricPill label="Theory 1/p" value={`${theory}r`} />
        </div>
      </div>

      <div className="px-6 md:px-8 py-8 md:py-10">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-black/15" />
          <div
            className="absolute top-0 bottom-8 w-px bg-black/25"
            style={{ left: `${(theory / maxRound) * 100}%` }}
          >
            <span className="absolute -top-1 left-2 text-[11px] font-mono text-black/40 whitespace-nowrap">
              E[1/p]={theory}
            </span>
          </div>

          <div className="space-y-5 relative">
            {AUDIT_CATCH.perWorker.map((w, i) => {
              const left = (w.round / maxRound) * 100
              return (
                <div key={w.worker} className="relative h-10">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 text-[12px] font-mono text-black/45">
                    {w.worker}
                  </div>
                  <div className="ml-12 relative h-full">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/[0.07]" />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${left}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        inView
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={{
                        delay: 0.2 + i * 0.08,
                        type: 'spring',
                        stiffness: 260,
                        damping: 18,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-black border-2 border-white shadow-[0_0_0_1px_#000]" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 text-[11px] font-mono tabular-nums text-black/55 whitespace-nowrap">
                        r{w.round}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="ml-12 mt-8 flex justify-between text-[11px] font-mono text-black/35">
            <span>r0</span>
            <span>r10</span>
            <span>r20</span>
            <span>r30</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SecurityEconomicsChart() {
  return (
    <div className="space-y-5 md:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {PHASE0_KPIS.map((kpi) => (
          <MetricPill
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
          />
        ))}
      </div>

      <ChartShell
        eyebrow="Figure 02"
        title="Break-even bond vs audit rate"
        subtitle="Security priced to compute reality. Higher p shrinks the bond; lower p demands more collateral per worker."
        meta={
          <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            {BOND_SERIES.map((s) => (
              <div key={s.key} className="inline-flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-[3px] border border-black"
                  style={{ background: s.fill }}
                />
                <span className="text-[13px] text-black/60">{s.label}</span>
              </div>
            ))}
          </div>
        }
        heightClass="h-[360px] md:h-[400px]"
        footer={
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
            {bondAtP10.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                className="rounded-[22px] border border-black/15 px-5 py-4 flex items-center gap-4"
              >
                <span
                  className="w-10 h-10 rounded-full border border-black shrink-0"
                  style={{ background: item.fill }}
                />
                <div>
                  <p className="text-[12px] text-black/40 tracking-[0.08em]">
                    {item.label} · p = 10%
                  </p>
                  <p className="text-[26px] md:text-[30px] font-semibold font-mono tabular-nums tracking-tight leading-none mt-1">
                    $
                    {item.bond < 1
                      ? item.bond.toFixed(2)
                      : item.bond.toFixed(1)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={bondChartData}
            margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
            barCategoryGap="32%"
            barGap={4}
          >
            <CartesianGrid
              stroke="#000"
              strokeOpacity={0.05}
              vertical={false}
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="pLabel"
              tickLine={false}
              axisLine={{ stroke: '#000', strokeOpacity: 0.12 }}
              tick={{
                fill: 'rgba(0,0,0,0.42)',
                fontSize: 12,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
              tickMargin={10}
            />
            <YAxis
              yAxisId="bond"
              scale="log"
              domain={[0.02, 250]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'rgba(0,0,0,0.42)',
                fontSize: 11,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
              tickFormatter={(v: number) =>
                v >= 1 ? `$${v}` : `$${Number(v).toFixed(2)}`
              }
              width={52}
            />
            <YAxis
              yAxisId="catch"
              orientation="right"
              domain={[0, 55]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'rgba(0,0,0,0.32)',
                fontSize: 11,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
              tickFormatter={(v: number) => `${v}r`}
              width={40}
            />
            <ReferenceLine
              yAxisId="bond"
              x="10%"
              stroke="#000"
              strokeOpacity={0.2}
              strokeDasharray="4 4"
            />
            <Tooltip
              content={<BondTooltip />}
              cursor={{ fill: 'rgba(0,0,0,0.025)' }}
              isAnimationActive={false}
            />
            {BOND_SERIES.map((s, i) => (
              <Bar
                key={s.key}
                yAxisId="bond"
                dataKey={s.key}
                name={s.label}
                fill={s.fill}
                stroke={s.stroke}
                strokeWidth={1}
                radius={[6, 6, 0, 0]}
                isAnimationActive
                animationDuration={1100}
                animationBegin={i * 100}
                animationEasing="ease-out"
              />
            ))}
            <Line
              yAxisId="catch"
              type="monotone"
              dataKey="expectedCatch"
              name="Expected catch"
              stroke="#000"
              strokeWidth={2.25}
              strokeDasharray="5 4"
              dot={{
                r: 4,
                fill: '#fff',
                stroke: '#000',
                strokeWidth: 1.75,
              }}
              activeDot={{ r: 6, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1500}
              animationBegin={350}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartShell>

      <CatchTimeline />
    </div>
  )
}
