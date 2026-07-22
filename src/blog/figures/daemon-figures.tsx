import { FigureFrame } from './FigureFrame'

const steps = [
  { n: '01', title: 'Read', detail: 'coordinator account' },
  { n: '02', title: 'Ingest', detail: 'committed work' },
  { n: '03', title: 'Audit', detail: 'vs honest ref' },
  { n: '04', title: 'Slash', detail: 'on fraud only' },
]

export function DutyCycleFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="One process owns the full duty cycle. Slash runs only after a fraud verdict and a valid roster index."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 sm:divide-x sm:divide-black/10">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative flex flex-col gap-1.5 px-2 sm:px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium',
                  i === 3
                    ? 'bg-black text-white'
                    : 'border border-black/25 text-black/55',
                ].join(' ')}
              >
                {s.n}
              </span>
              {i < steps.length - 1 ? (
                <span className="hidden sm:block flex-1 h-px bg-black/15" />
              ) : null}
            </div>
            <p className="text-[15px] font-medium tracking-tight">{s.title}</p>
            <p className="text-[12px] sm:text-[13px] text-black/45 leading-snug">
              {s.detail}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-black/8 pt-3">
        <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
        <p className="text-[12px] tracking-[0.08em] text-black/40">
          always-on loop
        </p>
        <div className="ml-auto h-px flex-1 max-w-[120px] bg-gradient-to-r from-black/20 to-transparent" />
      </div>
    </FigureFrame>
  )
}

export function CoverageModesFigure() {
  const all = [1, 1, 1, 1, 1, 1, 1, 1]
  const assigned = [0, 0, 1, 0, 0, 1, 0, 1]

  return (
    <FigureFrame
      label="Fig. 02"
      caption="Phase-1 covers every observed contribution. Phase-3 preview samples lottery targets only."
    >
      <div className="space-y-4">
        <ModeRow
          name="--audit-all"
          tag="Phase 1"
          cells={all}
          note="every observed contribution"
        />
        <ModeRow
          name="--audit-assigned"
          tag="Phase 3"
          cells={assigned}
          note="select_audits lottery only"
        />
      </div>
    </FigureFrame>
  )
}

function ModeRow({
  name,
  tag,
  cells,
  note,
}: {
  name: string
  tag: string
  cells: number[]
  note: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
      <div className="sm:w-[168px] shrink-0">
        <p className="text-[13px] font-mono text-black">{name}</p>
        <p className="text-[11px] text-black/40 mt-0.5">{tag}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        {cells.map((on, i) => (
          <div
            key={i}
            className={[
              'h-7 flex-1 max-w-8 rounded-[4px] border',
              on
                ? 'bg-black border-black'
                : 'bg-transparent border-black/20 border-dashed',
            ].join(' ')}
            title={on ? 'audited' : 'skipped'}
          />
        ))}
      </div>
      <p className="text-[12px] text-black/45 sm:w-[160px] sm:text-right leading-snug">
        {note}
      </p>
    </div>
  )
}

export function IndexGuardFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="Slash maps the committer onto the live epoch roster. Missing index is a hard no-op, not a guess."
    >
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 640 148"
          className="w-full min-w-[480px] h-auto"
          role="img"
          aria-label="Committer maps to roster index, then slash or no-op"
        >
          <rect
            x="12"
            y="44"
            width="120"
            height="48"
            rx="8"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.25"
          />
          <text
            x="72"
            y="64"
            textAnchor="middle"
            fontSize="11"
            fill="#666"
            fontFamily="ui-monospace, monospace"
          >
            committer
          </text>
          <text
            x="72"
            y="80"
            textAnchor="middle"
            fontSize="12"
            fill="#000"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
          >
            pubkey
          </text>

          <line
            x1="132"
            y1="68"
            x2="188"
            y2="68"
            stroke="#000"
            strokeWidth="1.25"
          />
          <polygon points="188,64 198,68 188,72" fill="#000" />
          <text
            x="165"
            y="58"
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            fontFamily="ui-sans-serif, system-ui"
          >
            lookup
          </text>

          <rect
            x="200"
            y="36"
            width="150"
            height="64"
            rx="8"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.25"
          />
          <text
            x="275"
            y="58"
            textAnchor="middle"
            fontSize="11"
            fill="#666"
            fontFamily="ui-monospace, monospace"
          >
            epoch_state.clients
          </text>
          <text
            x="275"
            y="78"
            textAnchor="middle"
            fontSize="13"
            fill="#000"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
          >
            [i]
          </text>

          <path
            d="M350 56 H390 Q410 56 410 40 H460"
            fill="none"
            stroke="#000"
            strokeWidth="1.25"
          />
          <polygon points="460,36 470,40 460,44" fill="#000" />
          <text
            x="420"
            y="32"
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            fontFamily="ui-sans-serif, system-ui"
          >
            found
          </text>

          <rect
            x="472"
            y="18"
            width="148"
            height="44"
            rx="8"
            fill="#000"
          />
          <text
            x="546"
            y="38"
            textAnchor="middle"
            fontSize="11"
            fill="#fff"
            fontFamily="ui-monospace, monospace"
          >
            process_slash
          </text>
          <text
            x="546"
            y="52"
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.65)"
            fontFamily="ui-sans-serif, system-ui"
          >
            with hashes
          </text>

          <path
            d="M350 80 H390 Q410 80 410 108 H460"
            fill="none"
            stroke="#000"
            strokeWidth="1.25"
            strokeDasharray="4 3"
          />
          <polygon
            points="460,104 470,108 460,112"
            fill="#000"
            opacity="0.55"
          />
          <text
            x="420"
            y="126"
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            fontFamily="ui-sans-serif, system-ui"
          >
            missing
          </text>

          <rect
            x="472"
            y="88"
            width="148"
            height="44"
            rx="8"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.25"
            strokeDasharray="4 3"
          />
          <text
            x="546"
            y="108"
            textAnchor="middle"
            fontSize="12"
            fill="#000"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
          >
            no-op
          </text>
          <text
            x="546"
            y="122"
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            fontFamily="ui-sans-serif, system-ui"
          >
            wrong-index guard
          </text>
        </svg>
      </div>
    </FigureFrame>
  )
}

export function ProofStripFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Two independent proofs: real on-chain slash in memnet, live path dry-run on devnet."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <ProofCard
          env="memnet"
          status="slash"
          statusLabel="slashed"
          metrics={[
            { k: 'slashed', v: '200' },
            { k: 'earned', v: '0' },
            { k: 'tests', v: '1 passed' },
          ]}
          fill={1}
        />
        <ProofCard
          env="devnet dry-run"
          status="noop"
          statusLabel="no-op"
          metrics={[
            { k: 'dumps', v: '4 audited' },
            { k: 'fraud', v: '6.0 × 4' },
            { k: 'target', v: 'absent' },
          ]}
          fill={0.55}
        />
      </div>
    </FigureFrame>
  )
}

function ProofCard({
  env,
  status,
  statusLabel,
  metrics,
  fill,
}: {
  env: string
  status: 'slash' | 'noop'
  statusLabel: string
  metrics: { k: string; v: string }[]
  fill: number
}) {
  return (
    <div className="rounded-[10px] border border-black/12 bg-white p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-[12px] tracking-[0.1em] text-black/40">{env}</p>
        <span
          className={[
            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
            status === 'slash'
              ? 'bg-black text-white'
              : 'border border-black/20 text-black/60',
          ].join(' ')}
        >
          {statusLabel}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden mb-3">
        <div
          className={[
            'h-full rounded-full',
            status === 'slash' ? 'bg-black' : 'bg-black/35',
          ].join(' ')}
          style={{ width: `${Math.round(fill * 100)}%` }}
        />
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.k}>
            <dt className="text-[10px] tracking-[0.06em] text-black/35 mb-0.5">
              {m.k}
            </dt>
            <dd className="text-[13px] font-mono text-black leading-tight">
              {m.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function OpenWorkFigure() {
  const items = [
    { label: 'Live slash-through-daemon tx', done: 0.35 },
    { label: 'iroh Verifier-subscribe intake', done: 0.2 },
    { label: 'Trainer-backed ReplayEngine', done: 0.15 },
  ]

  return (
    <FigureFrame
      label="Fig. 05"
      caption="Issue #5 remainder. Path is proven in memnet; live multi-node swarm and dedicated RPC are still the bottleneck."
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <p className="text-[13px] sm:text-[14px] text-black/80 truncate">
                  {item.label}
                </p>
                <p className="text-[11px] font-mono text-black/35 shrink-0">
                  open
                </p>
              </div>
              <div className="h-1 w-full rounded-full bg-black/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-black/25"
                  style={{ width: `${Math.round(item.done * 100)}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </FigureFrame>
  )
}
