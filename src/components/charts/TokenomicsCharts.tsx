import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ALLOCATION,
  ALLOCATION_TOTAL,
  bondCurveData,
  bountySplitData,
  BURN_AT_P10,
  burnShareData,
  GENESIS_OP,
  PRESET_ECONOMICS,
  presetOperatingData,
  rebalanceChartData,
  TOKENOMICS_KPIS,
} from '../../data/tokenomics'
import { ChartShell, ChartTooltipBox, MetricPill } from './ChartShell'
import { LATEX_FONT, latexTick, latexTickMuted } from './latex'

function money(v: number) {
  if (v >= 10) return `$${v.toFixed(1)}`
  if (v >= 1) return `$${v.toFixed(2)}`
  if (v >= 0.1) return `$${v.toFixed(2)}`
  return `$${v.toFixed(3)}`
}

function AllocationTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: { fill: string; purpose: string } }[]
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <ChartTooltipBox
      label={p.name}
      rows={[
        {
          name: 'Share',
          value: `${p.value}%`,
          swatch: p.payload.fill,
        },
        {
          name: 'Purpose',
          value: p.payload.purpose,
          muted: true,
        },
      ]}
      footer={`Total supply allocation ${ALLOCATION_TOTAL}%`}
    />
  )
}

function BondTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string; color?: string }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const rows = payload
    .filter((p) => typeof p.value === 'number' && p.dataKey !== 'expectedCatch')
    .map((p) => {
      const meta = PRESET_ECONOMICS.find((s) => s.key === p.dataKey)
      return {
        name: meta?.label ?? p.name,
        value: money(p.value),
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
      footer="bond = reward × (1 − p) / p"
    />
  )
}

function OperatingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string; color?: string }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <ChartTooltipBox
      label={String(label)}
      rows={payload.map((p) => ({
        name: p.name,
        value: money(p.value),
        swatch:
          p.dataKey === 'cost'
            ? '#d4d4d4'
            : p.dataKey === 'reward'
              ? '#737373'
              : '#000000',
      }))}
      footer="At operating p = 0.1 for bond"
    />
  )
}

function BurnTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value
  return (
    <ChartTooltipBox
      label={`Audit probability ${label}`}
      rows={[
        {
          name: 'Burn share of rewards',
          value: typeof v === 'number' ? `${v.toFixed(2)}%` : 'n/a',
          swatch: '#000',
        },
      ]}
      footer="fee = 1.1× cost · reward = 1.35× cost → burn/rewards = p × 1.1 / 1.35"
    />
  )
}

function RebalanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; dataKey: string }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <ChartTooltipBox
      label={String(label)}
      rows={payload.map((p) => ({
        name: p.name,
        value: `${p.value}%`,
        swatch: p.dataKey === 'previous' ? '#d4d4d4' : '#000000',
      }))}
      footer="Team +10pp funded entirely from training rewards"
    />
  )
}

function AllocationDonut() {
  const data = useMemo(
    () =>
      ALLOCATION.map((a) => ({
        name: a.label,
        value: a.share,
        fill: a.fill,
        purpose: a.purpose,
      })),
    [],
  )

  return (
    <ChartShell
      eyebrow="Figure T01"
      title="Supply allocation"
      subtitle="Working totals for modelling. Training rewards stay the largest single bucket after the team rebalance."
      meta={
        <div className="flex gap-3">
          <MetricPill label="Rewards" value="35%" hint="Primary emission" />
          <MetricPill label="Team" value="25%" hint="1y cliff · 3y linear" />
        </div>
      }
      heightClass="h-[380px] md:h-[420px]"
      footer={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
          {ALLOCATION.map((a) => (
            <div
              key={a.key}
              className="flex items-center gap-2.5 rounded-[16px] border border-black/12 px-3 py-2.5"
            >
              <span
                className="w-3 h-3 rounded-[3px] border border-black shrink-0"
                style={{ background: a.fill }}
              />
              <div className="min-w-0">
                <p className="text-[13px] text-black/45 truncate">{a.short}</p>
                <p className="text-[18px] tabular-nums leading-none">{a.share}%</p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{ fontFamily: LATEX_FONT }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="48%"
            outerRadius="78%"
            paddingAngle={1.5}
            stroke="#000"
            strokeWidth={1.25}
            isAnimationActive
            animationDuration={1100}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip
            content={<AllocationTooltip />}
            isAnimationActive={false}
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: LATEX_FONT, fill: '#000', fontSize: 28 }}
          >
            100%
          </text>
          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: LATEX_FONT, fill: 'rgba(0,0,0,0.45)', fontSize: 13 }}
          >
            supply
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function RebalanceBars() {
  return (
    <ChartShell
      eyebrow="Figure T02"
      title="Allocation rebalance"
      subtitle="Team rose from 15% to 25%. The +10pp came entirely from the training rewards endowment (45% to 35%)."
      heightClass="h-[300px] md:h-[340px]"
      footer={
        <p className="text-[14px] md:text-[15px] text-black/50 leading-relaxed">
          Thesis check: training rewards remain larger than team (35% &gt; 25%).
          The network that trains the model still holds the primary emission share.
        </p>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={rebalanceChartData}
          layout="vertical"
          margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
          barCategoryGap="28%"
          style={{ fontFamily: LATEX_FONT }}
        >
          <CartesianGrid
            stroke="#000"
            strokeOpacity={0.05}
            horizontal={false}
            strokeDasharray="3 6"
          />
          <XAxis
            type="number"
            domain={[0, 50]}
            tickLine={false}
            axisLine={{ stroke: '#000', strokeOpacity: 0.12 }}
            tick={latexTick}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={128}
            tickLine={false}
            axisLine={false}
            tick={latexTick}
          />
          <Tooltip
            content={<RebalanceTooltip />}
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            isAnimationActive={false}
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
          <Bar
            dataKey="previous"
            name="Previous"
            fill="#d4d4d4"
            stroke="#000"
            strokeWidth={1}
            radius={[0, 6, 6, 0]}
            barSize={14}
            isAnimationActive
            animationDuration={900}
          />
          <Bar
            dataKey="current"
            name="Current"
            fill="#000000"
            stroke="#000"
            strokeWidth={1}
            radius={[0, 6, 6, 0]}
            barSize={14}
            isAnimationActive
            animationDuration={900}
            animationBegin={120}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function BondCurve() {
  return (
    <ChartShell
      eyebrow="Figure T03"
      title="Break-even bond vs audit rate"
      subtitle="Higher audit probability shrinks the bond. At p = 0.1 the bond is nine rounds of reward at every scale."
      meta={
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
          {PRESET_ECONOMICS.map((s) => (
            <div key={s.key} className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-[3px] border border-black"
                style={{ background: s.fill }}
              />
              <span className="text-[14px] text-black/60">{s.label}</span>
            </div>
          ))}
        </div>
      }
      heightClass="h-[360px] md:h-[400px]"
      footer={
        <div className="grid sm:grid-cols-3 gap-3">
          {PRESET_ECONOMICS.map((p) => (
            <div
              key={p.key}
              className="rounded-[22px] border border-black/15 px-5 py-4 flex items-center gap-4"
            >
              <span
                className="w-10 h-10 rounded-full border border-black shrink-0"
                style={{ background: p.fill }}
              />
              <div>
                <p className="text-[13px] text-black/40">
                  {p.label} · <span className="latex-math">p = 10%</span>
                </p>
                <p className="text-[26px] md:text-[30px] tabular-nums tracking-tight leading-none mt-1">
                  {money(p.bondAtP10Usd)}
                </p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={bondCurveData}
          margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
          barCategoryGap="32%"
          barGap={4}
          style={{ fontFamily: LATEX_FONT }}
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
            tick={latexTick}
            tickMargin={10}
          />
          <YAxis
            yAxisId="bond"
            scale="log"
            domain={[0.02, 250]}
            tickLine={false}
            axisLine={false}
            tick={latexTick}
            tickFormatter={(v: number) =>
              v >= 1 ? `$${v}` : `$${Number(v).toFixed(2)}`
            }
            width={56}
          />
          <YAxis
            yAxisId="catch"
            orientation="right"
            domain={[0, 55]}
            tickLine={false}
            axisLine={false}
            tick={latexTickMuted}
            tickFormatter={(v: number) => `${v}r`}
            width={44}
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
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
          {PRESET_ECONOMICS.map((s, i) => (
            <Bar
              key={s.key}
              yAxisId="bond"
              dataKey={s.key}
              name={s.label}
              fill={s.fill}
              stroke="#000"
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
            dot={{ r: 4, fill: '#fff', stroke: '#000', strokeWidth: 1.75 }}
            activeDot={{ r: 6, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive
            animationDuration={1500}
            animationBegin={350}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function OperatingBars() {
  return (
    <ChartShell
      eyebrow="Figure T04"
      title="Round economics by preset"
      subtitle="Reward = 1.35× H100-market round cost. Bond at p = 0.1 is nine rounds of that reward."
      meta={
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end text-[14px] text-black/60">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] border border-black bg-[var(--chart-faint)]" />
            Cost
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] border border-black bg-[var(--chart-mid)]" />
            Reward
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] border border-black bg-black" />
            Bond @ 10%
          </span>
        </div>
      }
      heightClass="h-[360px] md:h-[400px]"
      footer={
        <p className="text-[14px] md:text-[15px] text-black/50 leading-relaxed">
          Genesis operating point: reward {money(GENESIS_OP.roundRewardUsd)} /
          round, bond {money(GENESIS_OP.bondUsd)}, expected catch{' '}
          {GENESIS_OP.expectedCatchRounds} rounds, band {GENESIS_OP.toleranceBand}.
        </p>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={presetOperatingData}
          margin={{ top: 16, right: 12, left: 4, bottom: 8 }}
          barCategoryGap="28%"
          barGap={6}
          style={{ fontFamily: LATEX_FONT }}
        >
          <CartesianGrid
            stroke="#000"
            strokeOpacity={0.05}
            vertical={false}
            strokeDasharray="3 6"
          />
          <XAxis
            dataKey="short"
            tickLine={false}
            axisLine={{ stroke: '#000', strokeOpacity: 0.12 }}
            tick={latexTick}
            tickMargin={10}
          />
          <YAxis
            scale="log"
            domain={[0.005, 50]}
            tickLine={false}
            axisLine={false}
            tick={latexTick}
            tickFormatter={(v: number) =>
              v >= 1 ? `$${v}` : `$${Number(v).toFixed(2)}`
            }
            width={56}
          />
          <Tooltip
            content={<OperatingTooltip />}
            cursor={{ fill: 'rgba(0,0,0,0.025)' }}
            isAnimationActive={false}
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
          <Bar
            dataKey="cost"
            name="Round cost"
            fill="#d4d4d4"
            stroke="#000"
            strokeWidth={1}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={1000}
          />
          <Bar
            dataKey="reward"
            name="Round reward"
            fill="#737373"
            stroke="#000"
            strokeWidth={1}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={1000}
            animationBegin={80}
          />
          <Bar
            dataKey="bond"
            name="Bond @ p=0.1"
            fill="#000000"
            stroke="#000"
            strokeWidth={1}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={1000}
            animationBegin={160}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function BurnCurve() {
  return (
    <ChartShell
      eyebrow="Figure T05"
      title="Zero-fraud audit burn"
      subtitle="When nobody cheats, verifier income is pure treasury spend. Burn share of rewards scales with audit probability."
      meta={
        <div className="flex gap-3">
          <MetricPill
            label="At p = 0.1"
            value={`${(BURN_AT_P10.burnShareOfRewards * 100).toFixed(1)}%`}
            hint="Of rewards"
          />
          <MetricPill
            label="1B · 100 workers"
            value={money(BURN_AT_P10.treasuryBurnPerRoundUsd)}
            hint="Burn / round"
          />
        </div>
      }
      heightClass="h-[320px] md:h-[360px]"
      footer={
        <p className="text-[14px] md:text-[15px] text-black/50 leading-relaxed">
          Audit fee floor = 1.1× H100 contribution cost. Reward = 1.35× cost.
          So burn / rewards = p × 1.1 / 1.35, preset-independent.
        </p>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={burnShareData}
          margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
          style={{ fontFamily: LATEX_FONT }}
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
            tick={latexTick}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 30]}
            tickLine={false}
            axisLine={false}
            tick={latexTick}
            tickFormatter={(v: number) => `${v}%`}
            width={48}
          />
          <ReferenceLine
            x="10%"
            stroke="#000"
            strokeOpacity={0.2}
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={BURN_AT_P10.burnShareOfRewards * 100}
            stroke="#000"
            strokeOpacity={0.15}
            strokeDasharray="2 4"
          />
          <Tooltip
            content={<BurnTooltip />}
            cursor={{ stroke: '#000', strokeOpacity: 0.12 }}
            isAnimationActive={false}
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
          <Line
            type="monotone"
            dataKey="burnPct"
            name="Burn share"
            stroke="#000"
            strokeWidth={2.5}
            dot={{ r: 5, fill: '#fff', stroke: '#000', strokeWidth: 1.75 }}
            activeDot={{ r: 7, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive
            animationDuration={1200}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function BountySplit() {
  const data = bountySplitData.map((d) => ({
    name: d.label,
    value: d.share,
    fill: d.fill,
  }))

  return (
    <ChartShell
      eyebrow="Figure T06"
      title="Slash bounty split"
      subtitle="Default design: slash_bounty_bps = 5000. Half of forfeited bond pays the reporter; half stays in the run vault."
      heightClass="h-[280px] md:h-[300px]"
      footer={
        <div className="grid sm:grid-cols-2 gap-3">
          {bountySplitData.map((d) => (
            <div
              key={d.key}
              className="rounded-[20px] border border-black/15 px-5 py-4 flex items-center gap-4"
            >
              <span
                className="w-10 h-10 rounded-full border border-black shrink-0"
                style={{ background: d.fill }}
              />
              <div>
                <p className="text-[13px] text-black/40">{d.label}</p>
                <p className="text-[26px] tabular-nums leading-none mt-1">
                  {d.share}%
                </p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{ fontFamily: LATEX_FONT }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="42%"
            outerRadius="72%"
            paddingAngle={2}
            stroke="#000"
            strokeWidth={1.25}
            startAngle={90}
            endAngle={-270}
            isAnimationActive
            animationDuration={1000}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const p = payload[0]
              return (
                <ChartTooltipBox
                  label={String(p.name)}
                  rows={[
                    {
                      name: 'Share of forfeit',
                      value: `${p.value}%`,
                      swatch: String(p.payload.fill),
                    },
                  ]}
                />
              )
            }}
            isAnimationActive={false}
            wrapperStyle={{ fontFamily: LATEX_FONT, outline: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

export default function TokenomicsCharts() {
  return (
    <div className="chart-latex space-y-5 md:space-y-6 my-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {TOKENOMICS_KPIS.map((kpi) => (
          <MetricPill
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
          />
        ))}
      </div>

      <AllocationDonut />
      <RebalanceBars />
      <BondCurve />
      <OperatingBars />
      <BurnCurve />
      <BountySplit />
    </div>
  )
}
