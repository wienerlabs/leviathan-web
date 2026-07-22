import { FigureFrame } from './FigureFrame'

export function JudgeToJuryFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="Before: one daemon decides and punishes. After: each bonded daemon votes; the chain only convicts at quorum."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-[12px] border border-black/12 bg-white p-4">
          <p className="text-[11px] tracking-[0.08em] text-black/40 mb-2">
            Before
          </p>
          <p className="text-[16px] font-medium mb-3">Single judge</p>
          <div className="space-y-2 text-[13px] text-black/65">
            <p>Detect fraud</p>
            <p className="text-black/25">↓</p>
            <p className="font-mono text-black">run_slash</p>
            <p className="text-black/25">↓</p>
            <p>Target punished alone</p>
          </div>
        </div>
        <div className="rounded-[12px] border border-black bg-black text-white p-4">
          <p className="text-[11px] tracking-[0.08em] text-white/45 mb-2">
            After
          </p>
          <p className="text-[16px] font-medium mb-3">Jury member</p>
          <div className="space-y-2 text-[13px] text-white/75">
            <p>Detect fraud</p>
            <p className="text-white/30">↓</p>
            <p className="font-mono text-white">submit_audit_verdict</p>
            <p className="text-white/30">↓</p>
            <p>Quorum convicts on chain</p>
          </div>
        </div>
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
