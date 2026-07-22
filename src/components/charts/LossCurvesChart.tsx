import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  useXAxisScale,
  useYAxisScale,
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
import { ChartShell, ChartTooltipBox, MetricPill } from './ChartShell'
import { LATEX_FONT, makeLatexLabel, makeLatexTick } from './latex'
import { useChartColors } from '../../theme/useChartColors'

const BANKNOTE_SRC = '/banknote.jpg'

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

function GapWithBanknote({ enabled }: { enabled: boolean }) {
  const c = useChartColors()
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()

  if (!enabled || !xScale || !yScale) return null

  const points = lossChartData
    .map((d) => {
      const x = xScale(d.round)
      const yTop = yScale(d.signflipMean)
      const yBot = yScale(d.honest)
      if (
        x == null ||
        yTop == null ||
        yBot == null ||
        Number.isNaN(x) ||
        Number.isNaN(yTop) ||
        Number.isNaN(yBot)
      ) {
        return null
      }
      return { x, yTop, yBot, round: d.round }
    })
    .filter((p): p is { x: number; yTop: number; yBot: number; round: number } =>
      Boolean(p),
    )

  if (points.length < 2) return null

  const pathTop = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.yTop}`)
    .join(' ')
  const pathBot = [...points]
    .reverse()
    .map((p) => `L${p.x},${p.yBot}`)
    .join(' ')
  const clipPath = `${pathTop} ${pathBot} Z`

  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.yTop))
  const maxY = Math.max(...points.map((p) => p.yBot))
  const boxW = Math.max(1, maxX - minX)
  const boxH = Math.max(1, maxY - minY)

  const billAspect = 1280 / 616
  let imgW = boxW
  let imgH = imgW / billAspect
  if (imgH < boxH) {
    imgH = boxH
    imgW = imgH * billAspect
  }
  const imgX = minX + (boxW - imgW) / 2
  const imgY = minY + (boxH - imgH) / 2

  const clipId = 'loss-gap-banknote-clip'

  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <clipPath id={clipId}>
          <path d={clipPath} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image
          href={BANKNOTE_SRC}
          x={imgX}
          y={imgY}
          width={imgW}
          height={imgH}
          preserveAspectRatio="xMidYMid slice"
          opacity={0.5}
          style={{ filter: 'grayscale(1) contrast(1.02)' }}
        />
      </g>
      <path
        d={clipPath}
        fill="none"
        stroke={c.ink}
        strokeOpacity={0.1}
        strokeWidth={1}
      />
    </g>
  )
}

export default function LossCurvesChart() {
  const c = useChartColors()
  const tick = makeLatexTick(c.tick)
  const labelStyle = makeLatexLabel(c.tickMuted)
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
                        stroke={on ? c.ink : c.tickMuted}
                        strokeOpacity={on ? s.opacity : 0.35}
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
                Stable band crops the y-axis to [2.15, 2.85]. Switch to full
                range to see the attack divergence and the banknote in the loss
                gap.
              </p>
            ) : (
              <p className="text-[14px] text-black/40 leading-relaxed">
                Banknote marks the loss gap between naive mean under attack
                (diverged to 12) and the honest baseline.
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
              stroke={c.ink}
              strokeOpacity={0.055}
              vertical={false}
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="round"
              tickLine={false}
              axisLine={{ stroke: c.ink, strokeOpacity: 0.12 }}
              tick={tick}
              tickMargin={10}
              ticks={[1, 5, 10, 15, 20, 25, 30]}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={tick}
              tickMargin={8}
              width={48}
              tickCount={6}
              tickFormatter={(v: number) =>
                v.toFixed(focus === 'band' ? 2 : 1)
              }
            />
            <ReferenceLine
              y={HONEST_FINAL}
              stroke={c.ink}
              strokeOpacity={0.18}
              strokeDasharray="4 4"
              label={{
                value: 'Honest final',
                position: 'insideTopRight',
                ...labelStyle,
              }}
            />
            <Tooltip
              content={<LossTooltip />}
              cursor={{
                stroke: c.ink,
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
                stroke={c.ink}
                strokeOpacity={s.opacity}
                strokeWidth={s.strokeWidth}
                strokeDasharray={s.dash}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: c.paper,
                  stroke: c.ink,
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={1600}
                animationBegin={i * 70}
                animationEasing="ease-in-out"
                connectNulls
              />
            ))}
            <GapWithBanknote enabled={showBanknote} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  )
}
