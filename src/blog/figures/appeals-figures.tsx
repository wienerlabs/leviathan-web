import { FigureFrame } from './FigureFrame'

export function BlindSpotFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="Before today the committee could convict a cheater, but a false accusation cost the verifier nothing. The stick pointed only one way."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Blind spot
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Asymmetric teeth
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-2">Target cheats</p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Loses bond
            </p>
            <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
              Quorum convicts. Forfeit settles. Hunters can eat.
            </p>
            <div className="mt-5 h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full w-full rounded-full bg-black" />
            </div>
            <p className="mt-2 text-[12px] font-mono text-black/45">
              economic teeth: present
            </p>
          </div>
          <div className="p-5 sm:p-6 bg-black/[0.02]">
            <p className="text-[12px] text-black/40 mb-2">
              Verifier falsely convicts
            </p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Loses nothing
            </p>
            <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
              Wrongful majority could still finish a sentence. No appeal. No
              counter-slash.
            </p>
            <div className="mt-5 h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full w-[8%] rounded-full bg-black/25" />
            </div>
            <p className="mt-2 text-[12px] font-mono text-black/45">
              economic teeth: missing
            </p>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 bg-black text-white">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/80">
            A jury that cannot be punished for false conviction is still a
            trust surface. Today that surface closes.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function LifecycleFigure() {
  const states = [
    {
      id: '01',
      name: 'Voting',
      d: 'Bonded verifiers cast ballots. Quorum not yet met.',
    },
    {
      id: '02',
      name: 'Slash pending',
      d: 'Quorum reached. Challenge window opens. No immediate slash.',
    },
    {
      id: '03',
      name: 'Challenged',
      d: 'Accused posts bond and convenes a larger tie-breaker jury.',
    },
    {
      id: '04',
      name: 'Upheld or overturned',
      d: 'Two-thirds either finalises the slash or burns the accusers.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 02"
      caption="AuditVerdict lifecycle when the challenge window is enabled. Unchallenged windows still finalise alone after the timer. Defaults remain zero for old runs."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              On-chain state
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              From vote to final judgment
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">
            Voting → SlashPending → Challenged → …
          </p>
        </div>
        <ol className="divide-y divide-black/10">
          {states.map((s) => (
            <li
              key={s.id}
              className="flex gap-4 px-5 sm:px-6 py-4 sm:py-4.5 items-start"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black bg-white text-[11px] font-mono">
                {s.id}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] sm:text-[16px] font-medium">
                  {s.name}
                </p>
                <p className="mt-0.5 text-[13px] sm:text-[14px] text-black/50 leading-snug">
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="border-t border-black/10 px-5 sm:px-6 py-3.5 bg-black/[0.03]">
          <p className="text-[13px] text-black/55 leading-relaxed">
            No challenge inside the window → slash finalises alone. The judge is
            still a bonded committee, not a single key.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function PartitionFigure() {
  const sets = [
    {
      t: 'Trainers',
      d: 'Do the work under audit.',
      note: 'Cannot sit the court',
    },
    {
      t: 'Verifiers',
      d: 'First jury. Vote to convict or stay silent.',
      note: 'May be challenged',
    },
    {
      t: 'Tie-breakers',
      d: 'Larger, separately drawn appeal jury.',
      note: 'Disjoint seats',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 03"
      caption="One epoch partition draws three disjoint sets. Nobody sits as judge on a case they already argued. The coordinator lottery already had the seat; the treasurer finally fills it."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Selection
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Nobody judges their own case
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {sets.map((s, i) => (
            <div
              key={s.t}
              className={[
                'p-5 sm:p-6',
                i === 2 ? 'bg-black text-white' : 'bg-white',
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
              <p className="text-[16px] font-medium mb-1.5">{s.t}</p>
              <p
                className={[
                  'text-[13px] leading-snug mb-4',
                  i === 2 ? 'text-white/65' : 'text-black/50',
                ].join(' ')}
              >
                {s.d}
              </p>
              <p
                className={[
                  'inline-flex rounded-full border px-2.5 py-1 text-[11px]',
                  i === 2
                    ? 'border-white/25 text-white/75'
                    : 'border-black/15 text-black/55',
                ].join(' ')}
              >
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function OverturnEconomicsFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Live devnet outcome from the appeals demo: two verifiers each forfeit 200; the innocent target keeps the full bond (slashed = 0)."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              Live overturn
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              Who burns when the court reverses
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">run 2QZxyEG…</p>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-[14px] border border-black bg-black px-4 py-3.5 text-white">
              <p className="text-[11px] text-white/50 mb-1">Verifier 1</p>
              <p className="text-[28px] tabular-nums tracking-tight leading-none">
                −200
              </p>
              <p className="mt-1.5 text-[12px] text-white/60">
                Losing-side bond burn
              </p>
            </div>
            <div className="rounded-[14px] border border-black bg-black px-4 py-3.5 text-white">
              <p className="text-[11px] text-white/50 mb-1">Verifier 2</p>
              <p className="text-[28px] tabular-nums tracking-tight leading-none">
                −200
              </p>
              <p className="mt-1.5 text-[12px] text-white/60">
                Losing-side bond burn
              </p>
            </div>
            <div className="rounded-[14px] border border-black/12 bg-white px-4 py-3.5">
              <p className="text-[11px] text-black/40 mb-1">Innocent target</p>
              <p className="text-[28px] tabular-nums tracking-tight leading-none">
                0
              </p>
              <p className="mt-1.5 text-[12px] text-black/50">
                slashed stays zero
              </p>
            </div>
          </div>

          <div className="rounded-[14px] border border-black/12 bg-black/[0.03] px-4 py-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[13px]">
              <span className="text-black/55">Path observed</span>
              <span className="font-mono text-[12px] sm:text-[13px] text-black">
                convict → challenge → overturn → accuser slash
              </span>
            </div>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function ShipProofFigure() {
  const proofs = [
    {
      t: 'Memnet',
      d: 'Three appeal suites plus full treasurer pack at 24/24.',
    },
    {
      t: 'Backward compatible',
      d: 'Both config knobs default to zero. Existing runs keep immediate slash.',
    },
    {
      t: 'Live devnet',
      d: 'Treasurer redeployed (522760 bytes). Appeals demo observed on chain.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="Issue net#4 closed with lab proof, zero-default safety, and a real-network overturn. Coordinator program left untouched."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {proofs.map((p, i) => (
          <div
            key={p.t}
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
            <p className="text-[15px] font-medium mb-1.5">{p.t}</p>
            <p
              className={[
                'text-[13px] leading-snug',
                i === 2 ? 'text-white/65' : 'text-black/50',
              ].join(' ')}
            >
              {p.d}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}
