import { FigureFrame } from './FigureFrame'

export function GapFigure() {
  return (
    <FigureFrame
      label="Fig. 01"
      caption="The security stack was live. The path for a stranger with a wallet to post collateral was not. That is not a polish issue; it is a closed door."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            The embarrassing gap
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Built for the network, reachable only by me
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-mono text-black/40 mb-2">Had</p>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-black/70 leading-snug">
              <li>On-chain bond instructions</li>
              <li>Live devnet treasurer</li>
              <li>Economics and committee model</li>
              <li>Library + memnet + demo binaries</li>
            </ul>
          </div>
          <div className="p-5 sm:p-6 bg-black text-white">
            <p className="text-[11px] font-mono text-white/45 mb-2">Missing</p>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-white/70 leading-snug">
              <li>Operator CLI for deposit</li>
              <li>Status without reading source</li>
              <li>Withdraw request / finalize path</li>
              <li>One-command bonded node start</li>
            </ul>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function FourCommandsFigure() {
  const cmds = [
    {
      cmd: 'bond-deposit',
      d: 'Creates the participant account if needed, then deposits collateral.',
    },
    {
      cmd: 'bond-status',
      d: 'Bond, pending withdraw, run minimum, challenge delay, qualifies yes/no.',
    },
    {
      cmd: 'bond-withdraw-request',
      d: 'Opens the challenge window to leave.',
    },
    {
      cmd: 'bond-withdraw-finalize',
      d: 'Settles any slash and pays out the rest.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 02"
      caption="Four run-manager commands turn bond lifecycle into something an operator can run without cloning treasury library code into a custom binary."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Operator surface
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Four commands, full bond loop
          </h3>
        </div>
        <div className="divide-y divide-black/10">
          {cmds.map((c, i) => (
            <div
              key={c.cmd}
              className="flex items-start gap-3.5 px-5 sm:px-6 py-4"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-mono text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[14px] sm:text-[15px] text-black mb-0.5">
                  {c.cmd}
                </p>
                <p className="text-[13px] sm:text-[14px] text-black/55 leading-snug">
                  {c.d}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 bg-black/[0.03] px-5 sm:px-6 py-4">
          <p className="text-[12px] text-black/40 mb-1.5">Node helper</p>
          <p className="font-mono text-[13px] sm:text-[14px] text-black">
            leviathan-node.sh --bond &lt;amount&gt; …
          </p>
          <p className="mt-1.5 text-[13px] text-black/55">
            Posts collateral before join. A bonded node is one command.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}

export function LiveVerifyFigure() {
  const steps = [
    {
      n: '01',
      title: 'bond-status',
      detail: 'No participant account yet.',
      tone: 'muted',
    },
    {
      n: '02',
      title: 'bond-deposit 100',
      detail: 'Create account + deposit. Two txs land on chain.',
      tone: 'hot',
    },
    {
      n: '03',
      title: 'bond-status again',
      detail: 'Bond 100. Run minimum met.',
      tone: 'done',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 03"
      caption="Live devnet check against a treasurer run: empty status, deposit of 100, status shows the bond qualifies."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Live trace
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            Empty → funded → qualifies
          </h3>
        </div>
        <div className="divide-y divide-black/10">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-3.5 px-5 sm:px-6 py-4"
            >
              <span
                className={[
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-mono',
                  s.tone === 'muted'
                    ? 'border border-black/20 text-black/45'
                    : 'bg-black text-white',
                ].join(' ')}
              >
                {s.n}
              </span>
              <div>
                <p className="font-mono text-[14px] sm:text-[15px] font-medium mb-0.5">
                  {s.title}
                </p>
                <p className="text-[13px] sm:text-[14px] text-black/55 leading-snug">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-black/40 mb-1">Participant create</p>
            <p className="font-mono text-[12px] text-black/70 break-all">
              6qvgFMvf…
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40 mb-1">Deposit</p>
            <p className="font-mono text-[12px] text-black/70 break-all">
              4j7uHMxx…
            </p>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function DoorOpenFigure() {
  return (
    <FigureFrame
      label="Fig. 04"
      caption="The first technical door for a volunteer network is open. The remaining door is packaging: a true one-liner entry that does not demand a full repo checkout."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-[16px] border border-black bg-black p-5 text-white">
          <p className="text-[11px] font-mono text-white/50 mb-2">Closed today</p>
          <p className="text-[16px] font-medium mb-1.5">Bond funding UX</p>
          <p className="text-[13px] text-white/65 leading-snug">
            Wallet in hand → deposit → join a bonded run. Outside my demos.
          </p>
        </div>
        <div className="rounded-[16px] border border-black/12 bg-white p-5">
          <p className="text-[11px] font-mono text-black/40 mb-2">Still open</p>
          <p className="text-[16px] font-medium mb-1.5">One-line installer</p>
          <p className="text-[13px] text-black/55 leading-snug">
            <span className="font-mono text-black/70">curl | sh</span> style entry
            that does not require cloning the whole monorepo.
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}
