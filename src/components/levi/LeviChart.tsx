import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatUsd, type PricePoint } from '../../data/levi'
import { ChartTooltipBox } from '../charts/ChartShell'
import { LATEX_FONT, makeLatexTick } from '../charts/latex'
import { useChartColors } from '../../theme/useChartColors'

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string | number
}) {
  const c = useChartColors()
  if (!active || !payload?.length) return null
  const ts = typeof label === 'number' ? label : Number(label)
  const when = Number.isFinite(ts)
    ? new Date(ts).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''
  return (
    <ChartTooltipBox
      label={when}
      rows={[
        {
          name: 'LEVI',
          value: formatUsd(payload[0].value, 6),
          swatch: c.ink,
        },
      ]}
    />
  )
}

export default function LeviChart({
  history,
  loading,
}: {
  history: PricePoint[]
  loading: boolean
}) {
  const c = useChartColors()
  const tick = makeLatexTick(c.tick)
  const data = history.map((p) => ({ t: p.t, price: p.price }))
  const fillId = 'leviFill'

  return (
    <div className="chart-latex h-full min-h-[320px] rounded-[28px] border border-black bg-white overflow-hidden flex flex-col">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-black/10 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
            All-time chart
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight font-normal">
            $LEVI price
          </h3>
        </div>
        <p className="text-[13px] text-black/45 shrink-0">Solana</p>
      </div>

      <div className="flex-1 px-2 sm:px-3 py-3 min-h-[260px]">
        {loading ? (
          <div className="h-full min-h-[260px] rounded-[20px] bg-black/[0.03] animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-full min-h-[260px] flex items-center justify-center px-6 text-center">
            <div>
              <p className="text-[18px] md:text-[20px]">Chart unlocks at listing</p>
              <p className="mt-2 text-[14px] text-black/50 max-w-[320px] mx-auto">
                All-time $LEVI price history appears here once the mint is live
                and a Solana pool is indexed.
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
                  <stop offset="0%" stopColor={c.ink} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={c.ink} stopOpacity={0.01} />
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
                tickFormatter={(v: number) =>
                  new Date(v).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                }
                minTickGap={36}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={tick}
                width={56}
                tickFormatter={(v: number) => formatUsd(v, 4)}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={<ChartTip />}
                isAnimationActive={false}
                wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={c.ink}
                strokeWidth={2.25}
                fill={`url(#${fillId})`}
                isAnimationActive
                animationDuration={1200}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: c.ink,
                  stroke: c.paper,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
