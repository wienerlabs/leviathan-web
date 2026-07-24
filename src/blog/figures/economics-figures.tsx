import { FigureFrame } from './FigureFrame'

export function MissingConstraintFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="The published bond formula only asked whether cheating stays negative EV. It never asked whether a rational verifier would bother to audit."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Two actors, one incomplete formula
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Who the old bond actually priced
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-mono text-black/40 mb-2">Modelled</p>
            <p className="text-[17px] font-medium mb-2">The cheater</p>
            <p className="text-[13px] sm:text-[14px] text-black/55 leading-relaxed">
              Expected return on fraud is negative at the published{' '}
              <span className="font-mono text-black/70">p</span>, bond, and
              reward. That half is still correct.
            </p>
            <div className="mt-4 rounded-[12px] border border-black/12 bg-black/[0.03] px-3 py-2.5 font-mono text-[12px] text-black/70">
              bond ≥ reward × (1 − p) / p
            </div>
          </div>
          <div className="p-5 sm:p-6 bg-black text-white">
            <p className="text-[11px] font-mono text-white/45 mb-2">Missing</p>
            <p className="text-[17px] font-medium mb-2">The verifier</p>
            <p className="text-[13px] sm:text-[14px] text-white/65 leading-relaxed">
              Pays compute on every audit. Earns only when a catch happens. The
              bounty is split across the quorum. Silence becomes rational.
            </p>
            <div className="mt-4 rounded-[12px] border border-white/20 bg-white/5 px-3 py-2.5 font-mono text-[12px] text-white/75">
              EV_audit &lt; 0 at bond = 2.91
            </div>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function BondCorrectionFigure() {
  return (
    <FigureFrame
      label="Fig. 02"
      caption="1B genesis preset, p = 0.1, 50% bounty, three-verifier committee. The binding constraint is verifier sustainability, not cheater break-even."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
              Binding floor
            </p>
            <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
              $2.91 was not enough
            </h3>
          </div>
          <p className="font-mono text-[12px] text-black/50">
            ~3.6× correction
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-black/40 mb-2">
                Published cheater floor
              </p>
              <p className="text-[40px] sm:text-[44px] tabular-nums tracking-tight leading-none">
                $2.91
              </p>
              <div className="mt-3 h-3 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full rounded-full bg-black/30" style={{ width: '28%' }} />
              </div>
            </div>
            <div>
              <p className="text-[12px] text-black/40 mb-2">
                Required with verifier pay
              </p>
              <p className="text-[40px] sm:text-[44px] tabular-nums tracking-tight leading-none">
                $10.55
              </p>
              <div className="mt-3 h-3 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full rounded-full bg-black" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-black/12 bg-black/[0.03] px-4 py-3.5 font-mono text-[12px] sm:text-[13px] leading-relaxed text-black/75">
            sustainable bond = audit_cost × quorum / (fraud_rate × bounty_share)
          </div>

          <p className="text-[13px] sm:text-[14px] text-black/55 leading-relaxed">
            Network bond = max(cheater floor, verifier floor). At this preset
            the verifier floor binds everywhere. Raising bounty to 100% still
            leaves auditors underwater at the old bond.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function CommitteeScaleFigure() {
  const rows = [
    { n: '3', bond: '$10.55', collusion: '$21', mult: '1×' },
    { n: '6', bond: '~$21', collusion: '~$84', mult: '~2×' },
    { n: '21', bond: '~$74', collusion: '$1,034', mult: '~7×' },
  ]
  return (
    <FigureFrame
      label="Fig. 03"
      caption="Larger committees buy Byzantine headroom and higher collusion capital. They also raise the bond roughly with quorum. Security is not free."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Scale is a trade
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            More verifiers, higher bond
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[13px] sm:text-[14px]">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.03]">
                <th className="px-5 py-3 font-medium">Verifiers</th>
                <th className="px-5 py-3 font-medium">Required bond</th>
                <th className="px-5 py-3 font-medium">Collusion capital</th>
                <th className="px-5 py-3 font-medium">vs 3</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.n}
                  className={[
                    'border-b border-black/8 last:border-0',
                    i === 0 ? 'bg-black/[0.02]' : '',
                  ].join(' ')}
                >
                  <td className="px-5 py-3 font-mono">{r.n}</td>
                  <td className="px-5 py-3 font-mono">{r.bond}</td>
                  <td className="px-5 py-3 font-mono">{r.collusion}</td>
                  <td className="px-5 py-3 text-black/55">{r.mult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4">
          <p className="text-[13px] sm:text-[14px] text-black/60 leading-relaxed">
            Recommendation for genesis: start with{' '}
            <span className="font-medium text-black">3–6 verifiers</span>. Buy
            headroom later when the economy can carry a higher bond.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function OpenRiskFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="The model is honest about what it does not cover. Framing an innocent target still lacks a direct economic penalty in the current design."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-[16px] border border-black/12 bg-white p-5">
          <p className="text-[11px] font-mono text-black/40 mb-2">Modelled</p>
          <ul className="space-y-2 text-[13px] sm:text-[14px] text-black/70 leading-snug">
            <li>Quorum and Byzantine bounds</li>
            <li>Collusion capital</li>
            <li>Verifier expected value</li>
            <li>Binding bond floor (named constraint)</li>
          </ul>
        </div>
        <div className="rounded-[16px] border border-black bg-black p-5 text-white">
          <p className="text-[11px] font-mono text-white/45 mb-2">Not yet</p>
          <p className="text-[15px] font-medium mb-2">False accusation cost</p>
          <p className="text-[13px] sm:text-[14px] text-white/65 leading-relaxed">
            If an attacker buys the majority, they can punish an innocent target
            without paying for the frame. That is the next economic job.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function ScienceNormFigure() {
  return (
    <FigureFrame
      label="Fig. 05"
      caption="The most important output of this round is not a prettier number. It is catching our own published figure with a reproducible model."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          {[
            { t: 'Claim', d: 'Bond = $2.91 at genesis p = 0.1' },
            { t: 'Check', d: 'Committee sim, 12 tests, suite 48/48' },
            { t: 'Correct', d: 'Binding floor ≈ $10.55 for n = 3' },
          ].map((c, i) => (
            <div
              key={c.t}
              className={[
                'p-5 sm:p-6',
                i === 2 ? 'bg-black text-white' : '',
              ].join(' ')}
            >
              <p
                className={[
                  'text-[11px] font-mono mb-2',
                  i === 2 ? 'text-white/50' : 'text-black/40',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')} · {c.t}
              </p>
              <p
                className={[
                  'text-[14px] sm:text-[15px] leading-snug',
                  i === 2 ? 'text-white/85' : 'text-black/75',
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
