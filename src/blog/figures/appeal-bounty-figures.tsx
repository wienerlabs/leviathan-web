import { FigureFrame } from './FigureFrame'

export function EmptyBenchFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="A security layer nobody runs is not a security layer. The same lesson the committee sim taught for verifiers now applies to the appeals bench."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Before the bounty
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Cost without prize, again
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {[
            {
              t: 'Re-audit work',
              d: 'Tie-breakers re-run the evidence under bond.',
            },
            {
              t: 'Cast appeal vote',
              d: 'Two-thirds decides overturn or uphold.',
            },
            {
              t: 'Payout',
              d: 'Nothing. Rational silence empties the bench.',
            },
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
            The court existed on paper. Without a wage for the adjudicators, it
            would not exist in practice.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function BiasedBountyFigure() {
  return (
    <FigureFrame
      label="Fig. 02"
      caption="Paying only on overturn is worse than paying nothing: the reward itself becomes a reason to free the target, including the guilty ones."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              First cut (wrong)
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              One-sided reward tilts the vote
            </h3>
          </div>
          <span className="inline-flex h-7 items-center rounded-full bg-black/[0.06] px-2.5 text-[11px] font-mono text-black/55">
            fixed same day
          </span>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-2">Overturn</p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Tie-breakers paid
            </p>
            <p className="text-[13px] text-black/50 leading-snug">
              Funded from convicting verifiers&apos; forfeit. Reward path open.
            </p>
            <div className="mt-5 h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full w-full rounded-full bg-black" />
            </div>
          </div>
          <div className="p-5 sm:p-6 bg-black/[0.02]">
            <p className="text-[12px] text-black/40 mb-2">Uphold</p>
            <p className="text-[18px] font-medium tracking-tight mb-2">
              Tie-breakers unpaid
            </p>
            <p className="text-[13px] text-black/50 leading-snug">
              Honest confirmation of guilt earns zero. Incentive points only
              one way.
            </p>
            <div className="mt-5 h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full w-[10%] rounded-full bg-black/25" />
            </div>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 bg-black text-white">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/80">
            A guilty node appeals. Tie-breakers who want the meal vote to free
            it. That is exactly the escape hatch the court must not create.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function SymmetricBountyFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="Symmetric settlement: earn either way from the side that lost. The bounty no longer pushes the ballot, so the honest read is the Schelling point."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Fix
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Paid on both outcomes
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-mono text-black/40 mb-2">01</p>
            <p className="text-[16px] font-medium mb-1.5">Overturn</p>
            <p className="text-[13px] text-black/50 leading-snug mb-4">
              Losing side: convicting verifiers. Their forfeit funds the
              appeal voters.
            </p>
            <p className="inline-flex rounded-full border border-black px-2.5 py-1 text-[11px] font-mono">
              slash_bounty_bps
            </p>
          </div>
          <div className="p-5 sm:p-6 bg-black text-white">
            <p className="text-[11px] font-mono text-white/50 mb-2">02</p>
            <p className="text-[16px] font-medium mb-1.5">Uphold</p>
            <p className="text-[13px] text-white/65 leading-snug mb-4">
              Losing side: the target. Forfeit routes to the tie-breakers who
              confirmed the slash, not only the original verifiers.
            </p>
            <p className="inline-flex rounded-full border border-white/25 px-2.5 py-1 text-[11px] font-mono text-white/80">
              same machine, both doors
            </p>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-3.5 bg-black/[0.03]">
          <p className="text-[13px] text-black/55 leading-relaxed">
            Non-appealed convictions stay on the old path: empty appeal-voter
            set still pays the original committee. Committee-slash suite
            untouched.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function SettlementRoutesFigure() {
  const rows = [
    {
      path: 'No appeal',
      source: 'Target forfeit',
      paid: 'Original verifiers',
    },
    {
      path: 'Overturn',
      source: 'Verifier forfeit',
      paid: 'Tie-breakers',
    },
    {
      path: 'Uphold',
      source: 'Target forfeit',
      paid: 'Tie-breakers',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 04"
      caption="One bounty knob, three settlement routes. The chain checks recipients against the recorded voter set on withdraw."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              Settlement map
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              Who pays the adjudicators
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">
            existing slash_bounty_bps
          </p>
        </div>
        <div className="hidden sm:grid grid-cols-3 gap-0 border-b border-black/10 px-5 sm:px-6 py-2.5 text-[11px] font-mono text-black/40">
          <span>Path</span>
          <span>Forfeit source</span>
          <span>Bounty to</span>
        </div>
        <div className="divide-y divide-black/10">
          {rows.map((r, i) => (
            <div
              key={r.path}
              className={[
                'grid sm:grid-cols-3 gap-1 sm:gap-0 px-5 sm:px-6 py-3.5',
                i === 2 ? 'bg-black text-white' : '',
              ].join(' ')}
            >
              <p className="text-[14px] font-medium">{r.path}</p>
              <p
                className={[
                  'text-[13px]',
                  i === 2 ? 'text-white/70' : 'text-black/55',
                ].join(' ')}
              >
                {r.source}
              </p>
              <p
                className={[
                  'text-[13px]',
                  i === 2 ? 'text-white/85' : 'text-black/80',
                ].join(' ')}
              >
                {r.paid}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function Net4ClosedFigure() {
  const items = [
    {
      t: 'Security',
      d: 'Losing-side penalty: false conviction burns the accusers.',
    },
    {
      t: 'Economics',
      d: 'Symmetric appeal bounty: adjudicators are paid either way.',
    },
    {
      t: 'Proof',
      d: 'Memnet 24/24 asserts both overturn and uphold payouts; treasurer at 533000 bytes on devnet.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="Issue net#4 is closed for both mechanism and incentive. What remains is an optional explicit challenge bond: a parameter choice, not a missing tooth."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((p, i) => (
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
