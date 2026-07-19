import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LOSS_SERIES, lossChartData } from '../../data/phase0'
import { ChartShell, ChartTooltipBox } from './ChartShell'

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
  const rows = payload
    .filter((p) => typeof p.value === 'number')
    .map((p) => {
      const meta = LOSS_SERIES.find((s) => s.key === p.dataKey)
      return {
        name: meta?.label ?? p.name,
        value: p.value.toFixed(3),
      }
    })
  return <ChartTooltipBox label={`Round ${label}`} rows={rows} />
}

export default function LossCurvesChart() {
  return (
    <ChartShell
      title="Loss curves"
      subtitle="30 outer rounds · 16 workers · 826k GPT · real gradients"
      legend={
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {LOSS_SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <svg width="28" height="10" className="shrink-0">
                <line
                  x1="0"
                  y1="5"
                  x2="28"
                  y2="5"
                  stroke={`rgba(0,0,0,${s.opacity})`}
                  strokeWidth={s.strokeWidth}
                  strokeDasharray={s.dash}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[12px] md:text-[13px] text-black/65">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={lossChartData}
          margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
        >
          <CartesianGrid
            stroke="#000"
            strokeOpacity={0.06}
            vertical={false}
          />
          <XAxis
            dataKey="round"
            tickLine={false}
            axisLine={{ stroke: '#000', strokeOpacity: 0.15 }}
            tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12 }}
            tickMargin={8}
            label={{
              value: 'Round',
              position: 'insideBottomRight',
              offset: -2,
              fill: 'rgba(0,0,0,0.35)',
              fontSize: 11,
            }}
          />
          <YAxis
            domain={[2, 12]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(0,0,0,0.45)', fontSize: 12 }}
            tickMargin={6}
            width={36}
            label={{
              value: 'Val loss',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(0,0,0,0.35)',
              fontSize: 11,
            }}
          />
          <Tooltip
            content={<LossTooltip />}
            cursor={{ stroke: '#000', strokeOpacity: 0.12 }}
          />
          {LOSS_SERIES.map((s, i) => (
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
                r: 4,
                fill: '#fff',
                stroke: '#000',
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={1400}
              animationBegin={i * 90}
              animationEasing="ease-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}
