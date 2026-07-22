import { FigureFrame } from './FigureFrame'

export function JudgeToJuryFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="Same fraud signal, two authority models. Left: one bonded key both detects and punishes. Right: independent bonded verifiers each cast one verdict; the chain convicts only at quorum."
    >
      <div className="overflow-x-auto -mx-1 px-1">
        <svg
          viewBox="0 0 720 360"
          className="w-full min-w-[560px] h-auto"
          role="img"
          aria-label="Single-authority slash versus multiparty committee verdict"
        >
          <defs>
            <marker
              id="arrow-ink"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 Z" fill="var(--ink)" />
            </marker>
            <marker
              id="arrow-muted"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 Z"
                fill="var(--ink)"
                fillOpacity="0.35"
              />
            </marker>
          </defs>

          <rect
            x="8"
            y="8"
            width="340"
            height="344"
            rx="14"
            fill="var(--canvas)"
            stroke="var(--ink)"
            strokeOpacity="0.12"
          />
          <rect
            x="372"
            y="8"
            width="340"
            height="344"
            rx="14"
            fill="var(--canvas)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          <text
            x="178"
            y="36"
            textAnchor="middle"
            fontSize="11"
            fill="var(--ink)"
            fillOpacity="0.4"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Phase 1
          </text>
          <text
            x="178"
            y="58"
            textAnchor="middle"
            fontSize="16"
            fill="var(--ink)"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
          >
            Single authority
          </text>
          <text
            x="178"
            y="78"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fillOpacity="0.5"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            one actor detects and punishes
          </text>

          <text
            x="542"
            y="36"
            textAnchor="middle"
            fontSize="11"
            fill="var(--ink)"
            fillOpacity="0.4"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Committee
          </text>
          <text
            x="542"
            y="58"
            textAnchor="middle"
            fontSize="16"
            fill="var(--ink)"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
          >
            Bonded jury
          </text>
          <text
            x="542"
            y="78"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fillOpacity="0.5"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            many vote · chain convicts at quorum
          </text>

          <rect
            x="108"
            y="100"
            width="140"
            height="36"
            rx="8"
            fill="var(--canvas-muted)"
            stroke="var(--ink)"
            strokeOpacity="0.2"
          />
          <text
            x="178"
            y="122"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fontFamily="ui-monospace, monospace"
          >
            fraud signal
          </text>

          <line
            x1="178"
            y1="136"
            x2="178"
            y2="158"
            stroke="var(--ink)"
            strokeWidth="1.25"
            markerEnd="url(#arrow-ink)"
          />

          <rect
            x="88"
            y="162"
            width="180"
            height="52"
            rx="10"
            fill="var(--ink)"
          />
          <text
            x="178"
            y="184"
            textAnchor="middle"
            fontSize="13"
            fill="var(--canvas)"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
          >
            Daemon (run authority)
          </text>
          <text
            x="178"
            y="202"
            textAnchor="middle"
            fontSize="11"
            fill="var(--canvas)"
            fillOpacity="0.65"
            fontFamily="ui-monospace, monospace"
          >
            detect + decide alone
          </text>

          <line
            x1="178"
            y1="214"
            x2="178"
            y2="236"
            stroke="var(--ink)"
            strokeWidth="1.25"
            markerEnd="url(#arrow-ink)"
          />

          <rect
            x="98"
            y="240"
            width="160"
            height="32"
            rx="8"
            fill="var(--canvas)"
            stroke="var(--ink)"
            strokeWidth="1.25"
          />
          <text
            x="178"
            y="260"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fontFamily="ui-monospace, monospace"
          >
            run_slash
          </text>

          <line
            x1="178"
            y1="272"
            x2="178"
            y2="292"
            stroke="var(--ink)"
            strokeWidth="1.25"
            markerEnd="url(#arrow-ink)"
          />

          <rect
            x="98"
            y="296"
            width="160"
            height="28"
            rx="8"
            fill="var(--ink)"
            fillOpacity="0.08"
            stroke="var(--ink)"
            strokeOpacity="0.35"
          />
          <text
            x="178"
            y="314"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Target slashed (1 of 1)
          </text>

          <rect
            x="472"
            y="100"
            width="140"
            height="36"
            rx="8"
            fill="var(--canvas-muted)"
            stroke="var(--ink)"
            strokeOpacity="0.2"
          />
          <text
            x="542"
            y="122"
            textAnchor="middle"
            fontSize="12"
            fill="var(--ink)"
            fontFamily="ui-monospace, monospace"
          >
            fraud signal
          </text>

          <line
            x1="542"
            y1="136"
            x2="542"
            y2="150"
            stroke="var(--ink)"
            strokeWidth="1.25"
            strokeOpacity="0.45"
          />
          <line
            x1="452"
            y1="150"
            x2="632"
            y2="150"
            stroke="var(--ink)"
            strokeWidth="1.25"
            strokeOpacity="0.45"
          />
          <line
            x1="452"
            y1="150"
            x2="452"
            y2="162"
            stroke="var(--ink)"
            strokeWidth="1.25"
            strokeOpacity="0.45"
            markerEnd="url(#arrow-muted)"
          />
          <line
            x1="542"
            y1="150"
            x2="542"
            y2="162"
            stroke="var(--ink)"
            strokeWidth="1.25"
            strokeOpacity="0.45"
            markerEnd="url(#arrow-muted)"
          />
          <line
            x1="632"
            y1="150"
            x2="632"
            y2="162"
            stroke="var(--ink)"
            strokeWidth="1.25"
            strokeOpacity="0.45"
            markerEnd="url(#arrow-muted)"
          />

          <g>
            <rect
              x="402"
              y="164"
              width="100"
              height="44"
              rx="10"
              fill="var(--canvas)"
              stroke="var(--ink)"
              strokeWidth="1.25"
            />
            <text
              x="452"
              y="182"
              textAnchor="middle"
              fontSize="12"
              fill="var(--ink)"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
            >
              V1
            </text>
            <text
              x="452"
              y="198"
              textAnchor="middle"
              fontSize="10"
              fill="var(--ink)"
              fillOpacity="0.5"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              bonded
            </text>
          </g>
          <g>
            <rect
              x="492"
              y="164"
              width="100"
              height="44"
              rx="10"
              fill="var(--canvas)"
              stroke="var(--ink)"
              strokeWidth="1.25"
            />
            <text
              x="542"
              y="182"
              textAnchor="middle"
              fontSize="12"
              fill="var(--ink)"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
            >
              V2
            </text>
            <text
              x="542"
              y="198"
              textAnchor="middle"
              fontSize="10"
              fill="var(--ink)"
              fillOpacity="0.5"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              bonded
            </text>
          </g>
          <g>
            <rect
              x="582"
              y="164"
              width="100"
              height="44"
              rx="10"
              fill="var(--canvas)"
              stroke="var(--ink)"
              strokeWidth="1.25"
            />
            <text
              x="632"
              y="182"
              textAnchor="middle"
              fontSize="12"
              fill="var(--ink)"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
            >
              V3
            </text>
            <text
              x="632"
              y="198"
              textAnchor="middle"
              fontSize="10"
              fill="var(--ink)"
              fillOpacity="0.5"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              bonded
            </text>
          </g>

          <line
            x1="452"
            y1="208"
            x2="452"
            y2="228"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.5"
            markerEnd="url(#arrow-muted)"
          />
          <line
            x1="542"
            y1="208"
            x2="542"
            y2="228"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.5"
            markerEnd="url(#arrow-muted)"
          />
          <line
            x1="632"
            y1="208"
            x2="632"
            y2="228"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.5"
            markerEnd="url(#arrow-muted)"
          />

          <text
            x="452"
            y="242"
            textAnchor="middle"
            fontSize="10"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontFamily="ui-monospace, monospace"
          >
            verdict
          </text>
          <text
            x="542"
            y="242"
            textAnchor="middle"
            fontSize="10"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontFamily="ui-monospace, monospace"
          >
            verdict
          </text>
          <text
            x="632"
            y="242"
            textAnchor="middle"
            fontSize="10"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontFamily="ui-monospace, monospace"
          >
            verdict
          </text>

          <line
            x1="452"
            y1="248"
            x2="492"
            y2="268"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.4"
          />
          <line
            x1="542"
            y1="248"
            x2="542"
            y2="268"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.4"
          />
          <line
            x1="632"
            y1="248"
            x2="592"
            y2="268"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeOpacity="0.4"
          />

          <rect
            x="432"
            y="268"
            width="220"
            height="48"
            rx="10"
            fill="var(--ink)"
          />
          <text
            x="542"
            y="288"
            textAnchor="middle"
            fontSize="12"
            fill="var(--canvas)"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
          >
            AuditVerdict PDA
          </text>
          <text
            x="542"
            y="306"
            textAnchor="middle"
            fontSize="11"
            fill="var(--canvas)"
            fillOpacity="0.7"
            fontFamily="ui-monospace, monospace"
          >
            count 3 · quorum 2 · convict
          </text>

          <text
            x="542"
            y="338"
            textAnchor="middle"
            fontSize="11"
            fill="var(--ink)"
            fillOpacity="0.55"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Eject only when count meets quorum
          </text>
        </svg>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-[12px] sm:text-[13px] leading-relaxed text-black/55">
        <p>
          <span className="font-medium text-black/75">Risk:</span> one
          compromised or captured authority can slash without peer check.
        </p>
        <p>
          <span className="font-medium text-black/75">Guarantee:</span> no
          single bonded verifier can finish a sentence; the program enforces
          the threshold.
        </p>
      </div>
    </FigureFrame>
  )
}

export function QuorumTimelineFigure() {
  const steps = [
    {
      n: '01',
      title: 'Vote 1',
      detail: 'Target stays Healthy',
      hot: false,
    },
    {
      n: '02',
      title: 'Vote 2',
      detail: 'Still below quorum',
      hot: false,
    },
    {
      n: '03',
      title: 'Vote 3',
      detail: 'Quorum met · eject',
      hot: true,
    },
  ]
  return (
    <FigureFrame
      label="Fig. 02"
      caption="Memnet committee run: three verifiers, quorum two. The first two votes cannot convict alone. The third tips the chain."
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-0 sm:divide-x sm:divide-black/10">
        {steps.map((s) => (
          <div key={s.n} className="flex flex-col gap-1.5 px-2 sm:px-3 py-2">
            <span
              className={[
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium',
                s.hot
                  ? 'bg-black text-white'
                  : 'border border-black/25 text-black/55',
              ].join(' ')}
            >
              {s.n}
            </span>
            <p className="text-[15px] font-medium tracking-tight">{s.title}</p>
            <p className="text-[12px] sm:text-[13px] text-black/45 leading-snug">
              {s.detail}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] font-mono text-black/45">
        <span>verifiers: 3</span>
        <span>quorum: 2</span>
        <span>clients: 6</span>
      </div>
    </FigureFrame>
  )
}

export function DualModeFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="Default keeps Phase-1 single-authority slash for existing runs. Vote mode uses a bonded verifier identity and writes a verdict PDA."
    >
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-[10px] border border-black/10 bg-white px-3.5 py-3">
          <div className="sm:w-[140px] shrink-0">
            <p className="text-[13px] font-mono text-black">default</p>
            <p className="text-[11px] text-black/40 mt-0.5">Phase 1 path</p>
          </div>
          <p className="text-[14px] text-black/70 leading-snug flex-1">
            Run authority identity. On fraud:{' '}
            <span className="font-mono text-black">run_slash</span>. Existing
            runs stay intact.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-[10px] border border-black bg-black text-white px-3.5 py-3">
          <div className="sm:w-[140px] shrink-0">
            <p className="text-[13px] font-mono">--verdict</p>
            <p className="text-[11px] text-white/45 mt-0.5">Committee path</p>
          </div>
          <p className="text-[14px] text-white/75 leading-snug flex-1">
            Bonded verifier identity. On fraud:{' '}
            <span className="font-mono text-white">
              run_submit_audit_verdict
            </span>
            . One vote, not a solo sentence.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function TestProofFigure() {
  const metrics = [
    { k: 'daemon suite', v: '23 / 23' },
    { k: 'core suite', v: '21' },
    { k: 'committee', v: '3 verifiers' },
    { k: 'quorum', v: '2' },
  ]
  return (
    <FigureFrame
      label="Fig. 04"
      caption="memnet_verifier_daemon_committee drives three independent daemons over the same real DisTrO fraud dump against the live program."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.k}
            className="rounded-[10px] border border-black/10 bg-white px-3 py-3"
          >
            <p className="text-[11px] tracking-[0.08em] text-black/40 mb-1">
              {m.k}
            </p>
            <p className="text-[18px] sm:text-[20px] font-mono font-medium tracking-tight">
              {m.v}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}

export function RemainingWorkFigure() {
  const items = [
    {
      label: 'Reporter bounty split + wrong-vote slash',
      state: 'open',
    },
    {
      label: 'Committee economics in private sim',
      state: 'open',
    },
    {
      label: 'Trainer-backed ReplayEngine + SBF redeploy',
      state: 'open',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="Issues #4 and #5 still hold the economic and trainer-backed edges. The multiparty verdict path itself is closed."
    >
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-[10px] border border-black/10 bg-white px-3 py-2.5"
          >
            <span className="inline-flex min-w-[52px] justify-center rounded-full border border-black/15 px-2 py-0.5 text-[11px] font-medium text-black/50">
              {item.state}
            </span>
            <p className="text-[14px] text-black/80 leading-snug">{item.label}</p>
          </li>
        ))}
      </ul>
    </FigureFrame>
  )
}
