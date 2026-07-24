import { FigureFrame } from './FigureFrame'

export function IncentiveGapFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="A bonded verifier paid capital, time, and risk to vote, then walked away with zero. Rational silence is then the dominant strategy, and silence is free fraud."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Before today
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Cost without prize
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {[
            { t: 'Post bond', d: 'Capital locked to even be allowed to vote.' },
            { t: 'Audit work', d: 'Replay, compare, and cast a verdict.' },
            { t: 'Payout', d: 'Nothing. Empty hands after conviction.' },
          ].map((c, i) => (
            <div key={c.t} className="p-5 sm:p-6">
              <p className="text-[11px] font-mono text-black/40 mb-2">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[16px] font-medium mb-1.5">{c.t}</p>
              <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
                {c.d}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 bg-black text-white">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/80">
            If nobody audits, fraud is free. If fraud is free, the security
            architecture collapses even when every instruction is correct.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function BountySplitFigure() {
  return (
    <FigureFrame
      label="Fig. 02"
      caption="End-to-end settlement used in the suite: slash 200, bounty 50% (100) split equally across the two voters who formed quorum; target recovers 300."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              Settlement
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              Who pays, who eats
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">
            bounty = 5000 bps
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex justify-between text-[12px] font-mono text-black/45 mb-2">
              <span>Target bond</span>
              <span>500</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden flex border border-black/10">
              <div
                className="h-full bg-black"
                style={{ width: '40%' }}
                title="slashed 200"
              />
              <div
                className="h-full bg-black/15"
                style={{ width: '60%' }}
                title="refund 300"
              />
            </div>
            <div className="mt-2 flex justify-between text-[12px] text-black/50">
              <span>
                Slash <span className="font-mono text-black">200</span>
              </span>
              <span>
                Refund <span className="font-mono text-black">300</span>
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-black bg-black px-4 py-3.5 text-white">
              <p className="text-[11px] text-white/50 mb-1">Bounty pool</p>
              <p className="text-[28px] tabular-nums tracking-tight leading-none">
                100
              </p>
              <p className="mt-1.5 text-[12px] text-white/60">
                50% of the forfeit (5000 bps)
              </p>
            </div>
            <div className="rounded-[14px] border border-black/12 bg-white px-4 py-3.5">
              <p className="text-[11px] text-black/40 mb-3">Equal split</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[13px]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-mono text-white">
                      V1
                    </span>
                    Voted
                  </span>
                  <span className="font-mono text-[15px]">50</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[13px]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-mono text-white">
                      V2
                    </span>
                    Voted
                  </span>
                  <span className="font-mono text-[15px]">50</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-black/40">
                  <span className="inline-flex items-center gap-2 text-[13px]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/20 text-[10px] font-mono">
                      V3
                    </span>
                    Did not vote
                  </span>
                  <span className="font-mono text-[15px]">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function IntegrityFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="The program rejects payouts to accounts that do not match a recorded voter. The punished side cannot redirect the bounty and sabotage the committee."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-[16px] border border-black/12 bg-white p-5">
          <p className="text-[11px] font-mono text-black/40 mb-2">01</p>
          <p className="text-[16px] font-medium mb-1.5">Recipient check</p>
          <p className="text-[13px] sm:text-[14px] text-black/55 leading-snug">
            Each token account must belong to a voter on the{' '}
            <span className="font-mono text-black/70">AuditVerdict</span>.
            Mismatch aborts with{' '}
            <span className="font-mono text-black/70">
              BountyRecipientMismatch
            </span>
            .
          </p>
        </div>
        <div className="rounded-[16px] border border-black bg-black p-5 text-white">
          <p className="text-[11px] font-mono text-white/50 mb-2">02</p>
          <p className="text-[16px] font-medium mb-1.5">Compatibility</p>
          <p className="text-[13px] sm:text-[14px] text-white/65 leading-snug">
            Without a verdict account the old single-reporter path is unchanged.
            Existing runs and callers keep working.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function EconomyLoopFigure() {
  const steps = [
    { t: 'Cheat', d: 'Target forges work' },
    { t: 'Vote', d: 'Bonded jury reaches quorum' },
    { t: 'Slash', d: 'Forfeit leaves the bond' },
    { t: 'Pay', d: 'Voters split the bounty' },
  ]
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Security is no longer only a gate. It is a loop that feeds the people who keep the gate honest."
    >
      <div className="rounded-[20px] border border-black bg-white p-5 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((s, i) => (
            <div
              key={s.t}
              className={[
                'rounded-[14px] border px-3 py-3.5',
                i === 3
                  ? 'border-black bg-black text-white'
                  : 'border-black/12 bg-white',
              ].join(' ')}
            >
              <p
                className={[
                  'text-[11px] font-mono mb-2',
                  i === 3 ? 'text-white/50' : 'text-black/40',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[15px] font-medium">{s.t}</p>
              <p
                className={[
                  'mt-1 text-[12px] leading-snug',
                  i === 3 ? 'text-white/65' : 'text-black/50',
                ].join(' ')}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function ShipStatusFigure() {
  return (
    <FigureFrame
      label="Fig. 05"
      caption="Verifier incentive shipped and upgraded on live devnet the same day. Program data length 455384 → 465624."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-3">Tests</p>
            <div className="space-y-2">
              <div className="flex justify-between gap-3 text-[14px]">
                <span className="text-black/60">Default suite</span>
                <span className="font-mono">21 / 21</span>
              </div>
              <div className="flex justify-between gap-3 text-[14px]">
                <span className="text-black/60">Daemon suite</span>
                <span className="font-mono">23 / 23</span>
              </div>
              <p className="pt-1 text-[12px] text-black/45">
                Default path stays libtorch-free.
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-3">Devnet program</p>
            <p className="font-mono text-[12px] sm:text-[13px] break-all text-black leading-relaxed">
              9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8
            </p>
            <p className="mt-3 text-[13px] text-black/55">
              Data length{' '}
              <span className="font-mono text-black">455384 → 465624</span>
            </p>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}
