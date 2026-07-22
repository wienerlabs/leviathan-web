import { FigureFrame } from './FigureFrame'

export function JudgeToJuryFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="Same audit signal, different trust surface. Left: one process both detects and punishes. Right: bonded verifiers only vote; the program convicts when the vote count crosses quorum."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] tracking-[0.08em] text-black/40 mb-1.5">
              Authority topology
            </p>
            <h3 className="text-[22px] sm:text-[26px] md:text-[28px] leading-[1.12] tracking-tight font-normal">
              Who is allowed to finish a slash?
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="inline-flex h-8 items-center rounded-full border border-black/15 px-3 text-[12px] text-black/55">
              Detect stays local
            </span>
            <span className="inline-flex h-8 items-center rounded-full border border-black px-3 text-[12px] font-medium">
              Convict needs quorum
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-black/10">
          <div className="p-5 sm:p-6 md:p-7">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <p className="text-[12px] text-black/40 mb-1">Model A</p>
                <p className="text-[18px] sm:text-[20px] font-semibold tracking-tight">
                  Single authority
                </p>
              </div>
              <span className="inline-flex h-7 items-center rounded-full bg-black/[0.06] px-2.5 text-[11px] font-mono text-black/55">
                Phase 1
              </span>
            </div>

            <div className="relative pl-1">
              <div
                className="absolute left-[19px] top-5 bottom-5 w-px bg-black/15"
                aria-hidden
              />

              <div className="relative flex gap-3.5 mb-5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-[12px] font-mono text-black/50">
                  01
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[15px] font-medium">Fraud observed</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    Replay audit fails the honest reference.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3.5 mb-5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-mono text-white">
                  02
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[15px] font-medium">One daemon decides</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    Identity is the run authority. No peer check.
                  </p>
                  <p className="mt-2 inline-flex rounded-md border border-black/15 bg-black/[0.03] px-2 py-1 font-mono text-[12px] text-black/70">
                    run_slash
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3.5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black bg-white text-[12px] font-mono">
                  03
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[15px] font-medium">Target punished</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    Conviction completes with a single signature.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-[16px] border border-black/12 bg-black/[0.03] px-4 py-3.5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[12px] text-black/45">Trust surface</p>
                <p className="text-[13px] font-mono tabular-nums">1 actor</p>
              </div>
              <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full w-full rounded-full bg-black" />
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-black/50">
                Capture or compromise of that key is enough to slash anyone.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-7 bg-black/[0.015]">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <p className="text-[12px] text-black/40 mb-1">Model B</p>
                <p className="text-[18px] sm:text-[20px] font-semibold tracking-tight">
                  Bonded jury
                </p>
              </div>
              <span className="inline-flex h-7 items-center rounded-full bg-black px-2.5 text-[11px] font-mono text-white">
                Now
              </span>
            </div>

            <div className="relative pl-1">
              <div
                className="absolute left-[19px] top-5 bottom-5 w-px bg-black/15"
                aria-hidden
              />

              <div className="relative flex gap-3.5 mb-5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-[12px] font-mono text-black/50">
                  01
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[15px] font-medium">Fraud observed</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    Same replay-audit signal as Model A.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3.5 mb-5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black bg-white text-[12px] font-mono">
                  02
                </span>
                <div className="min-w-0 pt-1 w-full">
                  <p className="text-[15px] font-medium">Independent daemons vote</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    Each voter is bonded and assigned as Verifier. One vote per
                    target per epoch.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['V1', 'V2', 'V3'].map((v, i) => (
                      <div
                        key={v}
                        className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white pl-1.5 pr-3 py-1"
                      >
                        <span
                          className={[
                            'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-mono',
                            i < 2
                              ? 'bg-black text-white'
                              : 'border border-black/25 text-black/55',
                          ].join(' ')}
                        >
                          {v}
                        </span>
                        <span className="text-[12px] text-black/60 font-mono">
                          verdict
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 inline-flex rounded-md border border-black/15 bg-white px-2 py-1 font-mono text-[12px] text-black/70">
                    run_submit_audit_verdict
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3.5">
                <span className="relative z-[1] mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-mono text-white">
                  03
                </span>
                <div className="min-w-0 pt-1 w-full">
                  <p className="text-[15px] font-medium">Chain enforces quorum</p>
                  <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
                    <span className="font-mono text-black/70">AuditVerdict</span>{' '}
                    PDA tallies votes. Eject only when count ≥ quorum.
                  </p>
                  <div className="mt-3 rounded-[14px] border border-black/12 bg-white px-3.5 py-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-[12px] text-black/45">
                        Verdict count
                      </p>
                      <p className="text-[12px] font-mono tabular-nums text-black/70">
                        2 / 2 quorum
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-2.5 flex-1 rounded-sm bg-black" />
                      <div className="h-2.5 flex-1 rounded-sm bg-black" />
                      <div className="h-2.5 flex-1 rounded-sm bg-black/10 border border-black/15 border-dashed" />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] font-mono text-black/40">
                      <span>vote</span>
                      <span>vote</span>
                      <span>spare</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-[16px] border border-black bg-black px-4 py-3.5 text-white">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[12px] text-white/50">Trust surface</p>
                <p className="text-[13px] font-mono tabular-nums text-white/90">
                  quorum of N
                </p>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden flex">
                <div className="h-full w-2/3 rounded-full bg-white" />
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-white/60">
                No single bonded verifier can finish the sentence alone.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-5 sm:px-6 py-4 grid sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-[11px] text-black/40 mb-1">Invariant</p>
            <p className="text-[13px] sm:text-[14px] leading-snug text-black/75">
              Detection can stay local. Punishment cannot.
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40 mb-1">Gate</p>
            <p className="text-[13px] sm:text-[14px] leading-snug text-black/75">
              Bonded + assigned Verifier + one vote per target.
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40 mb-1">Outcome</p>
            <p className="text-[13px] sm:text-[14px] leading-snug text-black/75">
              Program ejects only after threshold, not after one opinion.
            </p>
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
