import { FigureFrame } from './FigureFrame'

export function TrustHoleFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="The old path needed an honest peer to publish the truth before the verifier could judge. That is the assumption the protocol exists to remove."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Before today
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Two directories, one hidden trust
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-2">Under audit</p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Submitted dumps
            </p>
            <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
              What the network claims each trainer contributed.
            </p>
          </div>
          <div className="p-5 sm:p-6 bg-black/[0.02]">
            <p className="text-[12px] text-black/40 mb-2">Reference</p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Honest dumps from someone else
            </p>
            <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
              Required a node that already did the work correctly and published
              it. The truth was imported, not owned.
            </p>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 bg-black text-white">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/80">
            If detection depends on a trusted honest dump, conviction is only as
            trustless as that peer.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function ReplayLoopFigure() {
  const steps = [
    {
      n: '01',
      t: 'Map committer',
      d: 'Resolve the dump author to its epoch roster index.',
    },
    {
      n: '02',
      t: 'Recompute',
      d: "Ask the replay engine for that target's contribution.",
    },
    {
      n: '03',
      t: 'Judge',
      d: "Compare the submitted dump to the daemon's own reference.",
    },
    {
      n: '04',
      t: 'Convict',
      d: 'Vote or slash. No reference directory in the loop.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 02"
      caption="Optional replay engine replaces the reference directory. Roster lookup runs first so the daemon never decompresses work it cannot act on."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              New path
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              Truth the daemon owns
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">
            --replay-model · --replay-data-dir
          </p>
        </div>
        <ol className="divide-y divide-black/10">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={[
                'flex gap-4 px-5 sm:px-6 py-4 items-start',
                i === 3 ? 'bg-black text-white' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-mono',
                  i === 3
                    ? 'bg-white text-black'
                    : 'border border-black bg-white',
                ].join(' ')}
              >
                {s.n}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] sm:text-[16px] font-medium">{s.t}</p>
                <p
                  className={[
                    'mt-0.5 text-[13px] sm:text-[14px] leading-snug',
                    i === 3 ? 'text-white/65' : 'text-black/50',
                  ].join(' ')}
                >
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </FigureFrame>
  )
}

export function MemnetProofFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="End-to-end memnet against real on-chain programs: forged dump from a real nano-model delta, zero reference dumps on disk, chain settles the slash."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Observed path
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Cheat, recompute, convict, settle
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {[
            {
              t: 'Bonded cheater',
              d: 'Live epoch roster. Forged dump from real model output.',
            },
            {
              t: 'Daemon recomputes',
              d: 'Honest reference built in-process. No ref dump anywhere.',
            },
            {
              t: 'Conviction',
              d: 'Audit fails. Verdict lands on the multiparty path.',
            },
            {
              t: 'Chain settle',
              d: 'slashed = rate. earned = 0.',
            },
          ].map((c, i) => (
            <div
              key={c.t}
              className={['p-5 sm:p-6', i === 3 ? 'bg-black text-white' : ''].join(
                ' ',
              )}
            >
              <p
                className={[
                  'text-[11px] font-mono mb-2',
                  i === 3 ? 'text-white/50' : 'text-black/40',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[15px] font-medium mb-1.5">{c.t}</p>
              <p
                className={[
                  'text-[13px] leading-snug',
                  i === 3 ? 'text-white/65' : 'text-black/50',
                ].join(' ')}
              >
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function CiTrapFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="write_dense_dump lives in leviathan-verifier, not the tooling test crate, so default CI stays free of libtorch."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6 bg-black/[0.02]">
            <p className="text-[12px] text-black/40 mb-2">Trap avoided</p>
            <p className="text-[16px] font-medium mb-2">
              Tooling dev-dependency on psyche-network
            </p>
            <p className="text-[13px] text-black/50 leading-snug">
              Serialization pulls tch. Default test run would drag in libtorch
              and break CI.
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-2">Choice made</p>
            <p className="text-[16px] font-medium mb-2">
              Helper in leviathan-verifier
            </p>
            <p className="text-[13px] text-black/50 leading-snug">
              Suites that need dense dumps opt into the crate that already owns
              the torch edge. Libtorch-free packs stay clean.
            </p>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[14px]">
            <span className="text-black/55">CI invariant held</span>
            <span className="font-mono text-[13px] text-black">
              daemon 27/27 · free 24/24 · free 15/15
            </span>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function StackClosedFigure() {
  const layers = [
    {
      t: 'Detection',
      d: 'Daemon recomputes its own honest reference.',
    },
    {
      t: 'Conviction',
      d: 'Bonded majority jury, not a single key.',
    },
    {
      t: 'False charge',
      d: 'Wrongful accusers burn their own bond.',
    },
    {
      t: 'Adjudication',
      d: 'Tie-breakers paid either way. Neutral wage.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="net#4 core, net#4 economy, and net#5 core now sit together: nobody is trusted for truth, majority, penalty, or appeal pay."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Today&apos;s stack
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Neither detection nor conviction trusts anyone
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {layers.map((l, i) => (
            <div
              key={l.t}
              className={['p-5 sm:p-6', i === 0 ? 'bg-black text-white' : ''].join(
                ' ',
              )}
            >
              <p
                className={[
                  'text-[11px] font-mono mb-2',
                  i === 0 ? 'text-white/50' : 'text-black/40',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[15px] font-medium mb-1.5">{l.t}</p>
              <p
                className={[
                  'text-[13px] leading-snug',
                  i === 0 ? 'text-white/65' : 'text-black/50',
                ].join(' ')}
              >
                {l.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}
