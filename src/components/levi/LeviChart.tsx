import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CHART_RANGES,
  formatPrice,
  type ChartRange,
  type PricePoint,
} from '../../data/levi'
import { ChartTooltipBox } from '../charts/ChartShell'
import { LATEX_FONT, makeLatexTick } from '../charts/latex'
import { useChartColors } from '../../theme/useChartColors'

export const UP_COLOR = '#1a7f4b'
export const DOWN_COLOR = '#b3261e'

function stampFor(range: ChartRange, t: number): string {
  const d = new Date(t)
  if (range === 'LIVE') {
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
  if (range === '1H' || range === '24H') {
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  if (range === '7D') {
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
    })
  }
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ChartTip({
  active,
  payload,
  label,
  range,
  tone,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string | number
  range: ChartRange
  tone: string
}) {
  if (!active || !payload?.length) return null
  const ts = typeof label === 'number' ? label : Number(label)
  return (
    <ChartTooltipBox
      label={Number.isFinite(ts) ? stampFor(range, ts) : ''}
      rows={[
        {
          name: 'LEVI',
          value: formatPrice(payload[0].value),
          swatch: tone,
        },
      ]}
    />
  )
}

export default function LeviChart({
  history,
  live,
  range,
  onRangeChange,
  changePct,
  loading,
}: {
  history: PricePoint[]
  live: PricePoint[]
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
  changePct: number | null
  loading: boolean
}) {
  const c = useChartColors()

  const data = useMemo(() => {
    if (range === 'LIVE') return live
    if (live.length === 0) return history
    const lastCandle = history[history.length - 1]?.t ?? 0
    return [...history, ...live.filter((point) => point.t > lastCandle)]
  }, [history, live, range])

  const rising = (changePct ?? 0) >= 0
  const tone = rising ? UP_COLOR : DOWN_COLOR
  const tick = makeLatexTick(c.tick)
  const fillId = rising ? 'leviFillUp' : 'leviFillDown'
  const latest = data[data.length - 1]

  return (
    <div className="chart-latex h-full min-h-[320px] rounded-[28px] border border-black bg-white overflow-hidden flex flex-col">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-black/10 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
            {range === 'LIVE' ? 'Live price' : 'Traded price'}
          </p>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h3 className="text-[20px] sm:text-[24px] leading-tight font-normal tabular-nums">
              {latest ? formatPrice(latest.price) : '$LEVI price'}
            </h3>
            {changePct != null ? (
              <span
                className="text-[14px] tabular-nums font-medium"
                style={{ color: tone }}
              >
                {rising ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="inline-flex rounded-full border border-black/15 p-1 shrink-0">
          {CHART_RANGES.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onRangeChange(option.key)}
              className={[
                'h-8 px-2.5 sm:px-3 rounded-full text-[13px] transition-colors',
                range === option.key
                  ? 'bg-black text-white'
                  : 'text-black/55 hover:text-black',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-2 sm:px-3 py-3 min-h-[260px]">
        {loading && data.length === 0 ? (
          <div className="h-full min-h-[260px] rounded-[20px] bg-black/[0.03] animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-full min-h-[260px] flex items-center justify-center px-6 text-center">
            <div>
              <p className="text-[18px] md:text-[20px]">
                {range === 'LIVE' ? 'Watching for the next trade' : 'No trades in this range'}
              </p>
              <p className="mt-2 text-[14px] text-black/50 max-w-[320px] mx-auto">
                {range === 'LIVE'
                  ? 'Live prices appear here as they are polled from the pool.'
                  : 'This chart only draws prices that actually traded, so an empty range means the pool was quiet.'}
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
              style={{ fontFamily: LATEX_FONT }}
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tone} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={tone} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke={c.ink}
                strokeOpacity={0.05}
                vertical={false}
                strokeDasharray="3 6"
              />
              <XAxis
                dataKey="t"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickLine={false}
                axisLine={{ stroke: c.ink, strokeOpacity: 0.1 }}
                tick={tick}
                tickFormatter={(v: number) => stampFor(range, v)}
                minTickGap={44}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={tick}
                width={88}
                tickFormatter={(v: number) => formatPrice(v)}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={<ChartTip range={range} tone={tone} />}
                isAnimationActive={false}
                wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={tone}
                strokeWidth={2.25}
                fill={`url(#${fillId})`}
                isAnimationActive={false}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: tone,
                  stroke: c.paper,
                  strokeWidth: 2,
                }}
              />
              {latest ? (
                <ReferenceDot
                  x={latest.t}
                  y={latest.price}
                  r={4}
                  fill={tone}
                  stroke={c.paper}
                  strokeWidth={2}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
