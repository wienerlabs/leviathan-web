import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Customized,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  HONEST_FINAL,
  LOSS_SERIES,
  type LossSeriesKey,
  lossChartData,
  lossFinals,
  PHASE0_CONFIG,
} from '../../data/phase0'
import Banknote from './Banknote'
import { ChartShell, ChartTooltipBox, MetricPill } from './ChartShell'
import { LATEX_FONT, latexLabel, latexTick } from './latex'

const DEFAULT_ON: LossSeriesKey[] = [
  'honest',
  'signflipMean',
  'signflipClip',
  'alieClip',
  'alieAudit',
]

function LossTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const rows = [...payload]
    .filter((p) => typeof p.value === 'number')
    .sort((a, b) => a.value - b.value)
    .map((p) => {
      const meta = LOSS_SERIES.find((s) => s.key === p.dataKey)
      return {
        name: meta?.short ?? p.name,
        value: p.value >= 10 ? p.value.toFixed(1) : p.value.toFixed(3),
        swatch: `rgba(0,0,0,${meta?.opacity ?? 1})`,
      }
    })
  return (
    <ChartTooltipBox
      label={`Outer round ${label}`}
      rows={rows}
      footer="Lower is better · validation loss"
    />
  )
}

type AxisLike = {
  scale?: (v: number) => number
}

function GapWithBanknote(props: {
  xAxisMap?: Record<string, AxisLike>
  yAxisMap?: Record<string, AxisLike>
  show: boolean
}) {
  if (!props.show) return null

  const xAxis = props.xAxisMap
    ? (Object.values(props.xAxisMap)[0] as AxisLike | undefined)
    : undefined
  const yAxis = props.yAxisMap
    ? (Object.values(props.yAxisMap)[0] as AxisLike | undefined)
    : undefined

  if (!xAxis?.scale || !yAxis?.scale) return null

  const xs = xAxis.scale
  const ys = yAxis.scale

  const upper = lossChartData.map((d) => [xs(d.round), ys(d.signflipMean)])
  const lower = [...lossChartData]
    .reverse()
    .map((d) => [xs(d.round), ys(d.honest)])

  const path = [
    ...upper.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`),
    ...lower.map((p) => `L${p[0]},${p[1]}`),
    'Z',
  ].join(' ')

  const anchorRound = 17
  const row = lossChartData[anchorRound - 1]
  if (!row) return null

  const cx = xs(anchorRound)
  const cy = (ys(row.signflipMean) + ys(row.honest)) / 2
  const billW = 112
  const billH = 58

  return (
    <g style={{ pointerEvents: 'none' }}>
      <path d={path} fill="rgba(0,0,0,0.045)" stroke="none" />
      <Banknote
        x={cx - billW / 2}
        y={cy - billH / 2}
        width={billW}
        height={billH}
        opacity={0.95}
      />
    </g>
  )
}

export default function LossCurvesChart() {
  const [active, setActive] = useState<Set<LossSeriesKey>>(
    () => new Set(DEFAULT_ON),
  )
  const [focus, setFocus] = useState<'full' | 'band'>('full')

  const visible = useMemo(
    () => LOSS_SERIES.filter((s) => active.has(s.key)),
    [active],
  )

  const showBanknote =
    focus === 'full' && active.has('signflipMean') && active.has('honest')

  const toggle = (key: LossSeriesKey) => {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size === 1) return prev
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const yDomain: [number, number] = focus === 'band' ? [2.15, 2.85] : [2, 12.2]

  return (
    <div className="chart-latex">
      <ChartShell
        eyebrow="Figure 01"
        title="Validation loss across attacks"
        subtitle={`${PHASE0_CONFIG.rounds} outer rounds · ${PHASE0_CONFIG.workers} workers · ${(PHASE0_CONFIG.model_parameters / 1000).toFixed(0)}k GPT · real gradients from the Phase 0 sim`}
        meta={
          <div className="flex flex-wrap md:justify-end gap-2">
            {(
              [
                ['band', 'Stable band'],
                ['full', 'Full range'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={[
                  'h-9 px-4 rounded-full border text-[14px] transition-colors',
                  focus === id
                    ? 'bg-black text-white border-black'
                    : 'border-black/20 text-black/70 hover:border-black',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        }
        heightClass="h-[360px] md:h-[420px]"
        footer={
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {LOSS_SERIES.map((s) => {
                const on = active.has(s.key)
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggle(s.key)}
                    className={[
                      'inline-flex items-center gap-2.5 h-10 px-3.5 rounded-full border text-[14px] transition-all',
                      on
                        ? 'border-black bg-white text-black'
                        : 'border-black/15 text-black/35',
                    ].join(' ')}
                  >
                    <svg width="22" height="8" className="shrink-0">
                      <line
                        x1="0"
                        y1="4"
                        x2="22"
                        y2="4"
                        stroke={
                          on
                            ? `rgba(0,0,0,${s.opacity})`
                            : 'rgba(0,0,0,0.2)'
                        }
                        strokeWidth={s.strokeWidth}
                        strokeDasharray={s.dash}
                        strokeLinecap="round"
                      />
                    </svg>
                    {s.short}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {lossFinals
                .filter((f) =>
                  [
                    'honest',
                    'signflipMean',
                    'signflipClip',
                    'alieAudit',
                  ].includes(f.key),
                )
                .map((f) => (
                  <MetricPill
                    key={f.key}
                    label={f.short}
                    value={
                      f.final >= 10 ? f.final.toFixed(1) : f.final.toFixed(3)
                    }
                    hint={
                      f.key === 'signflipMean'
                        ? 'Diverged'
                        : f.key === 'honest'
                          ? 'Baseline'
                          : f.key === 'signflipClip'
                            ? 'Malicious accept 3%'
                            : 'All 5 slashed'
                    }
                  />
                ))}
            </div>

            {focus === 'band' ? (
              <p className="text-[14px] text-black/40 leading-relaxed">
                Stable band crops the y-axis to [2.15, 2.85] so honest and
                defended runs resolve clearly. Sign-flip vs mean leaves the frame
                after divergence - switch to full range to see the collapse to
                12.0 and the gap banknote.
              </p>
            ) : (
              <p className="text-[14px] text-black/40 leading-relaxed">
                Banknote sits in the loss gap between naive mean under attack
                (diverged) and the honest baseline - the economic space attacks
                open when verification is missing.
              </p>
            )}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lossChartData}
            margin={{ top: 16, right: 18, left: 4, bottom: 8 }}
            style={{ fontFamily: LATEX_FONT }}
          >
            <CartesianGrid
              stroke="#000"
              strokeOpacity={0.055}
              vertical={false}
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="round"
              tickLine={false}
              axisLine={{ stroke: '#000', strokeOpacity: 0.12 }}
              tick={latexTick}
              tickMargin={10}
              ticks={[1, 5, 10, 15, 20, 25, 30]}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={latexTick}
              tickMargin={8}
              width={48}
              tickCount={6}
              tickFormatter={(v: number) =>
                v.toFixed(focus === 'band' ? 2 : 1)
              }
            />
            <ReferenceLine
              y={HONEST_FINAL}
              stroke="#000"
              strokeOpacity={0.18}
              strokeDasharray="4 4"
              label={{
                value: 'Honest final',
                position: 'insideTopRight',
                ...latexLabel,
              }}
            />
            <Customized
              component={(p: Record<string, unknown>) => (
                <GapWithBanknote
                  xAxisMap={p.xAxisMap as Record<string, AxisLike>}
                  yAxisMap={p.yAxisMap as Record<string, AxisLike>}
                  show={showBanknote}
                />
              )}
            />
            <Tooltip
              content={<LossTooltip />}
              cursor={{
                stroke: '#000',
                strokeOpacity: 0.14,
                strokeDasharray: '2 4',
              }}
              isAnimationActive={false}
              wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
            />
            {visible.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={`rgba(0,0,0,${s.opacity})`}
                strokeWidth={s.strokeWidth}
                strokeDasharray={s.dash}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={1600}
                animationBegin={i * 70}
                animationEasing="ease-in-out"
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  )
}
