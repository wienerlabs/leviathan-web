import { FigureFrame } from './FigureFrame'

export function LiveScenarioFigure() {
  const roles = [
    { id: 'V1', role: 'Verifier', detail: 'Bonded · casts vote 1' },
    { id: 'V2', role: 'Verifier', detail: 'Bonded · casts vote 2 (quorum)' },
    { id: 'T', role: 'Target', detail: 'Bonded · assigned for conviction' },
  ]
  return (
    <FigureFrame
      label="Fig. 01"
      caption="Live devnet setup: three bonded participants join a real run. Protocol opens an epoch; two sit as verifiers, one is the target."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              Live scenario
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              Three bonds, one epoch, one target
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex h-8 items-center rounded-full border border-black/15 px-3 text-[12px] font-mono text-black/55">
              clients 3
            </span>
            <span className="inline-flex h-8 items-center rounded-full border border-black/15 px-3 text-[12px] font-mono text-black/55">
              verifiers 2
            </span>
            <span className="inline-flex h-8 items-center rounded-full border border-black px-3 text-[12px] font-mono">
              quorum 2
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {roles.map((r, i) => (
            <div key={r.id} className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-mono font-medium',
                    i < 2
                      ? 'bg-black text-white'
                      : 'border border-black/25 text-black/60',
                  ].join(' ')}
                >
                  {r.id}
                </span>
                <div>
                  <p className="text-[15px] font-medium">{r.role}</p>
                  <p className="text-[12px] text-black/45 font-mono">{r.id}</p>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-black/55 leading-snug">
                {r.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function VoteSequenceFigure() {
  const steps = [
    {
      n: '01',
      title: 'Vote 1 lands',
      detail: 'Target stays Healthy. One verifier cannot convict alone.',
      state: 'safe',
    },
    {
      n: '02',
      title: 'Vote 2 lands',
      detail: 'Quorum met. Target ejected from the epoch.',
      state: 'hot',
    },
    {
      n: '03',
      title: 'Epoch settles',
      detail: 'Bond cut on chain: slashed = 200 on live devnet.',
      state: 'done',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 02"
      caption="The property we needed to see on a public network: the first vote is not enough; the second finishes the sentence."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Execution trace
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            From first ballot to on-chain forfeit
          </h3>
        </div>
        <div className="divide-y divide-black/10">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-3.5 sm:gap-4 px-5 sm:px-6 py-4"
            >
              <span
                className={[
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-mono',
                  s.state === 'safe'
                    ? 'border border-black/20 text-black/50'
                    : 'bg-black text-white',
                ].join(' ')}
              >
                {s.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] sm:text-[16px] font-medium mb-0.5">
                  {s.title}
                </p>
                <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-[12px] text-black/45">Quorum bar</p>
            <p className="text-[12px] font-mono tabular-nums text-black/60">
              2 / 2
            </p>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2.5 flex-1 rounded-sm bg-black" />
            <div className="h-2.5 flex-1 rounded-sm bg-black" />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[12px] font-mono text-black/45">
            <span>slashed = 200</span>
            <span>network: devnet</span>
            <span>path: multiparty</span>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function StackToLiveFigure() {
  const row = [
    { t: 'SBF report', d: 'Stack clean' },
    { t: 'Redeploy', d: '9A1kc8…' },
    { t: 'Live call', d: 'CommitteeSelection' },
    { t: 'Quorum slash', d: 'e2e pass' },
  ]
  return (
    <FigureFrame
      label="Fig. 03"
      caption="If CommitteeSelection had overflowed the BPF 4KB frame, the vote transaction would have trapped. It ran and completed on live devnet."
    >
      <div className="rounded-[20px] border border-black bg-white p-5 sm:p-6">
        <p className="text-[12px] text-black/40 mb-4">
          Compile check → real invocation
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {row.map((r, i) => (
            <div
              key={r.t}
              className={[
                'rounded-[14px] border px-3 py-3',
                i === row.length - 1
                  ? 'border-black bg-black text-white'
                  : 'border-black/12 bg-white',
              ].join(' ')}
            >
              <p
                className={[
                  'text-[11px] font-mono mb-1.5',
                  i === row.length - 1 ? 'text-white/50' : 'text-black/40',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[14px] font-medium leading-snug">{r.t}</p>
              <p
                className={[
                  'mt-1 text-[12px] leading-snug',
                  i === row.length - 1 ? 'text-white/65' : 'text-black/50',
                ].join(' ')}
              >
                {r.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function TripleProofFigure() {
  const proofs = [
    {
      title: 'Memnet',
      detail: 'Real program bytecode, daemon suite 23/23',
    },
    {
      title: 'SBF-safe',
      detail: 'Vote path fits the 4KB stack budget',
    },
    {
      title: 'Live quorum slash',
      detail: 'Devnet e2e: two votes, eject, slashed = 200',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Bonded committee vote is now proven three ways: lab bytecode, runtime budget, and a public-network multiparty conviction."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {proofs.map((p, i) => (
          <div
            key={p.title}
            className={[
              'rounded-[16px] border px-4 py-4',
              i === 2
                ? 'border-black bg-black text-white'
                : 'border-black/12 bg-white',
            ].join(' ')}
          >
            <p
              className={[
                'text-[11px] font-mono mb-2',
                i === 2 ? 'text-white/50' : 'text-black/40',
              ].join(' ')}
            >
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="text-[15px] font-medium mb-1.5">{p.title}</p>
            <p
              className={[
                'text-[13px] leading-snug',
                i === 2 ? 'text-white/65' : 'text-black/50',
              ].join(' ')}
            >
              {p.detail}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}

export function ArcSummaryFigure() {
  const steps = [
    'Committee vote on chain',
    'Daemon as juror',
    'SBF build check',
    'Treasurer redeploy',
    'Live e2e quorum slash',
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="One arc, five closed steps: from single-key slash to multiparty conviction proven end to end on live devnet."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
            Today&apos;s arc
          </p>
          <p className="text-[18px] sm:text-[20px] font-medium tracking-tight">
            Single key → majority vote, proven end to end
          </p>
        </div>
        <ol className="divide-y divide-black/10">
          {steps.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-3 px-5 sm:px-6 py-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-mono text-white">
                {i + 1}
              </span>
              <p className="text-[14px] sm:text-[15px] text-black/80">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </FigureFrame>
  )
}
