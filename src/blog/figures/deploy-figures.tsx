import { FigureFrame } from './FigureFrame'

export function DeployGateFigure() {
  const gates = [
    {
      n: '01',
      title: 'Memnet proof',
      detail: 'Real program bytecode, 23/23 daemon suite',
      done: true,
    },
    {
      n: '02',
      title: 'BPF stack check',
      detail: 'Vote path fits the 4KB frame, no stack warnings',
      done: true,
    },
    {
      n: '03',
      title: 'Devnet upgrade',
      detail: 'In-place deploy, program id preserved',
      done: true,
    },
    {
      n: '04',
      title: 'Live multi-voter swarm',
      detail: 'Several bonded verifiers on real nodes',
      done: false,
    },
  ]

  return (
    <FigureFrame
      label="Fig. 01"
      caption="Three gates closed this round. The fourth is operational, not architectural: a multi-node bonded verifier swarm on live devnet."
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-black bg-white overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            Ship checklist
          </p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight tracking-tight font-normal">
            From lab bytecode to live program
          </h3>
        </div>
        <div className="divide-y divide-black/10">
          {gates.map((g) => (
            <div
              key={g.n}
              className="flex items-start gap-3.5 sm:gap-4 px-5 sm:px-6 py-4"
            >
              <span
                className={[
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-mono',
                  g.done
                    ? 'bg-black text-white'
                    : 'border border-black/20 text-black/45',
                ].join(' ')}
              >
                {g.done ? '✓' : g.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="text-[15px] sm:text-[16px] font-medium">
                    {g.title}
                  </p>
                  <span
                    className={[
                      'inline-flex h-6 items-center rounded-full px-2 text-[11px] font-mono',
                      g.done
                        ? 'bg-black/[0.06] text-black/60'
                        : 'border border-black/15 text-black/40',
                    ].join(' ')}
                  >
                    {g.done ? 'closed' : 'open'}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
                  {g.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  )
}

export function StackBudgetFigure() {
  return (
    <FigureFrame
      label="Fig. 02"
      caption="Solana BPF caps each function frame at 4KB. If CommitteeSelection overflowed the stack, the instruction would trap on first call even after a successful deploy."
    >
      <div className="rounded-[20px] border border-black bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-[12px] text-black/40 mb-1">Constraint</p>
            <p className="text-[18px] sm:text-[20px] font-semibold tracking-tight">
              BPF stack budget
            </p>
          </div>
          <p className="font-mono text-[13px] text-black/55">
            limit = 4096 bytes
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[12px] font-mono text-black/45 mb-1.5">
              <span>submit_audit_verdict path</span>
              <span>no stack warning</span>
            </div>
            <div className="h-3 rounded-full bg-black/8 overflow-hidden">
              <div className="h-full w-[42%] rounded-full bg-black" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] font-mono text-black/45 mb-1.5">
              <span>Hard ceiling</span>
              <span>4 KB</span>
            </div>
            <div className="h-3 rounded-full border border-dashed border-black/25 bg-transparent" />
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="rounded-[14px] border border-black/12 bg-black/[0.03] px-3.5 py-3">
            <p className="text-[11px] text-black/40 mb-1">Pre-deploy</p>
            <p className="text-[14px] leading-snug text-black/75">
              Build for BPF and read the stack report. Fail closed on overflow.
            </p>
          </div>
          <div className="rounded-[14px] border border-black bg-black px-3.5 py-3 text-white">
            <p className="text-[11px] text-white/50 mb-1">Result</p>
            <p className="text-[14px] leading-snug text-white/80">
              Vote instruction clean. Safe to upgrade on live devnet.
            </p>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function UpgradeFigure() {
  return (
    <FigureFrame
      label="Fig. 03"
      caption="In-place upgrade keeps the program id. Existing run accounts stay valid because vote state lives in a new PDA, not inside the old run layout."
    >
      <div className="rounded-[20px] border border-black bg-white overflow-hidden">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-3">Program id</p>
            <p className="font-mono text-[13px] sm:text-[14px] leading-relaxed break-all text-black">
              9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8
            </p>
            <p className="mt-3 text-[13px] text-black/50">
              Unchanged across the upgrade.
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[12px] text-black/40 mb-3">Binary size</p>
            <div className="flex items-end gap-3 mb-2">
              <div>
                <p className="text-[11px] font-mono text-black/40 mb-1">
                  before
                </p>
                <p className="text-[28px] tabular-nums tracking-tight leading-none">
                  372
                </p>
                <p className="text-[12px] text-black/45 mt-1">KB</p>
              </div>
              <p className="pb-2 text-black/30">→</p>
              <div>
                <p className="text-[11px] font-mono text-black/40 mb-1">
                  after
                </p>
                <p className="text-[28px] tabular-nums tracking-tight leading-none">
                  455
                </p>
                <p className="text-[12px] text-black/45 mt-1">KB</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/8 overflow-hidden flex">
              <div className="h-full bg-black/25" style={{ width: '82%' }} />
              <div className="h-full bg-black" style={{ width: '18%' }} />
            </div>
            <p className="mt-2 text-[12px] font-mono text-black/40">
              +committee vote path
            </p>
          </div>
        </div>
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 grid sm:grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] text-black/40 mb-1">Slot</p>
            <p className="font-mono text-[13px] text-black/80">478174671</p>
          </div>
          <div>
            <p className="text-[11px] text-black/40 mb-1">Account layout</p>
            <p className="text-[13px] text-black/75">
              Old run shape untouched
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40 mb-1">Vote state</p>
            <p className="text-[13px] text-black/75">
              New AuditVerdict PDA
            </p>
          </div>
        </div>
      </div>
    </FigureFrame>
  )
}

export function ThreeConditionsFigure() {
  const items = [
    {
      title: 'Proven in memnet',
      detail: 'Against real program bytecode, not a mock.',
    },
    {
      title: 'Stack-safe for BPF',
      detail: 'Committee path fits the 4KB frame budget.',
    },
    {
      title: 'Live on devnet',
      detail: 'Upgraded treasurer at the stable program id.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 04"
      caption="Bonded committee vote now clears the three engineering gates that turn a design into a network fact."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div
            key={item.title}
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
            <p className="text-[15px] font-medium mb-1.5">{item.title}</p>
            <p
              className={[
                'text-[13px] leading-snug',
                i === 2 ? 'text-white/65' : 'text-black/50',
              ].join(' ')}
            >
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  )
}

export function RemainingDeployFigure() {
  const items = [
    {
      label: 'Live multi-verifier swarm on devnet',
      detail: 'Several bonded nodes cast real votes to quorum.',
    },
    {
      label: 'Issue #4 v2 economics',
      detail: 'Bounty split to voters, wrong-vote penalty, sim.',
    },
    {
      label: 'Issue #5 trainer-backed ReplayEngine',
      detail: 'Daemon recomputes the honest reference itself.',
    },
  ]
  return (
    <FigureFrame
      label="Fig. 05"
      caption="Mechanism is on live network. Closing the loop under real multi-node load, and finishing bounty plus trainer-backed audit, are the next honest items."
    >
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-[14px] border border-black/10 bg-white px-4 py-3"
          >
            <p className="text-[14px] sm:text-[15px] font-medium text-black/85">
              {item.label}
            </p>
            <p className="mt-0.5 text-[13px] text-black/50 leading-snug">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </FigureFrame>
  )
}
