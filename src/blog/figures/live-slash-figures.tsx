import { FigureFrame } from './FigureFrame'

export function BuildPathFigure() {
  const stages = [
    { n: '01', title: 'Sim', detail: 'three-layer defense' },
    { n: '02', title: 'Programs', detail: 'devnet on-chain' },
    { n: '03', title: 'Train', detail: 'live client join' },
    { n: '04', title: 'Fuse', detail: 'detect + slash' },
    { n: '05', title: 'Live', detail: 'tx on chain', hot: true },
  ]

  return (
    <FigureFrame
      label="Fig. 01"
      caption="Each layer was proven before the next: simulation, then programs, then a live client, then fusion, then a real slash transaction."
    >
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0 sm:divide-x sm:divide-black/10">
        {stages.map((s) => (
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
    </FigureFrame>
  )
}

export function DetectionMetricsFigure() {
  const metrics = [
    { k: 'caught', v: '4 / 4' },
    { k: 'distance', v: '6.0' },
    { k: 'band', v: '0.05' },
    { k: 'false +', v: '0' },
  ]

  return (
    <FigureFrame
      label="Fig. 02"
      caption="Three-node swarm, real DisTrO gradients, sign-flip red-team. Replay verifier caught every forged contribution."
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
            <p className="text-[22px] font-mono font-medium tracking-tight">
              {m.v}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}

export function BondSlashFigure() {
  const steps = [
    { label: 'Bond in', value: '500', tone: 'in' },
    { label: 'Slash', value: '200', tone: 'slash' },
    { label: 'Refund', value: '300', tone: 'out' },
    { label: 'Vault keeps', value: '200', tone: 'vault' },
  ]

  return (
    <FigureFrame
      label="Fig. 03"
      caption="Full economic loop on devnet: bond, cheat, slash, withdraw. Unauthorized slash attempts are rejected."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((s) => (
          <div
            key={s.label}
            className={[
              'rounded-[10px] border px-3 py-3',
              s.tone === 'slash'
                ? 'border-black bg-black text-white'
                : 'border-black/12 bg-white text-black',
            ].join(' ')}
          >
            <p
              className={[
                'text-[11px] tracking-[0.08em] mb-1',
                s.tone === 'slash' ? 'text-white/55' : 'text-black/40',
              ].join(' ')}
            >
              {s.label}
            </p>
            <p className="text-[24px] font-mono font-medium tracking-tight">
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-black/[0.06] overflow-hidden flex">
        <div className="h-full bg-black/25" style={{ width: '60%' }} title="refund 300" />
        <div className="h-full bg-black" style={{ width: '40%' }} title="slashed 200" />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-black/40 font-mono">
        <span>60% returned</span>
        <span>40% forfeited</span>
      </div>
    </FigureFrame>
  )
}

export function LiveProofFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Dedicated RPC unblocked the epoch. The daemon submitted slash; committed and replayed hashes match the coordinator SlashClient log."
    >
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="text-[12px] tracking-[0.08em] text-black/40 sm:w-28 shrink-0">
            path
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-mono">
            {['RPC stable', 'epoch live', 'fraud seen', 'slash tx'].map(
              (step, i) => (
                <span key={step} className="inline-flex items-center gap-1.5">
                  {i > 0 ? (
                    <span className="text-black/25" aria-hidden>
                      →
                    </span>
                  ) : null}
                  <span className="rounded-full border border-black/15 bg-white px-2.5 py-1">
                    {step}
                  </span>
                </span>
              ),
            )}
          </div>
        </div>
        <div className="rounded-[10px] border border-black/12 bg-white px-3 py-3">
          <p className="text-[11px] tracking-[0.08em] text-black/40 mb-2">
            hash check
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-[13px] font-mono">
            <div className="flex items-center justify-between gap-2 rounded-md bg-black/[0.03] px-2.5 py-2">
              <span className="text-black/45">committed</span>
              <span className="text-black">match</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-black/[0.03] px-2.5 py-2">
              <span className="text-black/45">replayed</span>
              <span className="text-black">match</span>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-black/45 leading-relaxed">
            Evidence is permanent on chain. Anyone can inspect the transaction.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function PhaseRoadmapFigure() {
  const items = [
    { label: 'Phase 1 single-key slash authority', state: 'now' },
    { label: 'Trainer-backed self-recompute reference', state: 'next' },
    { label: 'Live mesh subscribe (iroh)', state: 'next' },
    { label: 'Phase 3 committee vote + reporter bounty', state: 'later' },
    { label: 'Audit, counsel, $LEVI', state: 'later' },
  ]

  return (
    <FigureFrame
      label="Fig. 05"
      caption="Phase 1 is intentional: a single authority closes the loop. Committee voting and bounty routing stay later."
    >
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-[10px] border border-black/10 bg-white px-3 py-2.5"
          >
            <span
              className={[
                'inline-flex min-w-[52px] justify-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                item.state === 'now'
                  ? 'bg-black text-white'
                  : 'border border-black/15 text-black/50',
              ].join(' ')}
            >
              {item.state}
            </span>
            <p className="text-[14px] text-black/80 leading-snug">{item.label}</p>
          </li>
        ))}
      </ul>
    </FigureFrame>
  )
}
