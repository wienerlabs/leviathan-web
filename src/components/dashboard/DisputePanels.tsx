import { useState } from 'react'
import type { AuditVerdict, Participant, TreasuryRun } from '../../data/protocol'
import {
  AddressLink,
  Badge,
  EmptyRow,
  MiniStat,
  NONE,
  Panel,
  formatCount,
  formatDuration,
} from './Primitives'

const RESOLVED = new Set(['Upheld', 'Overturned', 'Resolved'])
const OPEN = new Set(['Voting', 'Slash pending', 'Challenged'])

const STATUS_BLURB: Record<string, string> = {
  Voting: 'Verifiers are still submitting. No forfeiture until a quorum agrees.',
  'Slash pending':
    'A quorum convicted, and the challenge window is open. The forfeiture is deferred until it closes or an appeal resolves.',
  Challenged:
    'The conviction was challenged, so a tie-breaker bench is ruling on it.',
  Upheld: 'The conviction stood, and the forfeiture applies at epoch end.',
  Overturned:
    'The bench cleared the target, and the verifiers who voted to convict forfeit instead.',
  Resolved:
    'Recorded before the appeals court existed, when a quorum forfeited immediately and there was nothing to appeal to.',
}

const LAYOUT_NOTE: Record<string, string> = {
  voteOnly:
    'Recorded before appeals existed, so it carries a resolved flag rather than a status.',
  appeals: 'Carries appeal state but no appeal deadline.',
  appealsWithDeadline: 'Current layout, with an appeal deadline.',
}

export function DisputePanel({ verdicts }: { verdicts: AuditVerdict[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const open = verdicts.filter((verdict) => OPEN.has(verdict.status))
  const resolved = verdicts.filter((verdict) => RESOLVED.has(verdict.status))

  return (
    <Panel
      eyebrow="Disputes"
      title="The appeals court, on chain"
      badge={
        open.length > 0 ? (
          <Badge tone="solid">{open.length} open</Badge>
        ) : (
          <Badge>{resolved.length} settled</Badge>
        )
      }
      footer="One record per accused participant per run. A quorum of verifiers convicts, a challenge opens a tie-breaker bench, and if the bench overturns, the verifiers who convicted forfeit instead. That last part is what stops a majority from convicting whoever it likes."
    >
      {verdicts.length === 0 ? (
        <EmptyRow>No dispute has ever been opened on this cluster.</EmptyRow>
      ) : (
        <div className="divide-y divide-black/[0.06]">
          {verdicts.map((verdict) => {
            const isOpen = expanded === verdict.address
            return (
              <div key={verdict.address}>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(isOpen ? null : verdict.address)
                  }
                  className="w-full text-left px-5 sm:px-6 py-4 hover:bg-black/[0.02] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span
                      className={[
                        'text-[12px] rounded-full px-2.5 py-1 shrink-0',
                        OPEN.has(verdict.status)
                          ? 'bg-black text-white'
                          : 'border border-black/12 text-black/55',
                      ].join(' ')}
                    >
                      {verdict.status}
                    </span>
                    <span className="text-[13px] text-black/45 shrink-0">
                      accused
                    </span>
                    <AddressLink address={verdict.target} edge={6} />
                    <span className="text-[13px] tabular-nums text-black/45 shrink-0">
                      {verdict.verdictCount} to convict
                    </span>
                    {verdict.overturnCount !== null &&
                    verdict.overturnCount + (verdict.upholdCount ?? 0) > 0 ? (
                      <span className="text-[13px] tabular-nums text-black shrink-0">
                        appeal {verdict.overturnCount} overturn /{' '}
                        {verdict.upholdCount} uphold
                      </span>
                    ) : null}
                    <span className="ml-auto text-[12px] text-black/35 shrink-0">
                      {isOpen ? 'hide' : 'detail'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-black/50 leading-snug">
                    {STATUS_BLURB[verdict.status]}
                  </p>
                </button>

                {isOpen ? (
                  <div className="px-5 sm:px-6 pb-5 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <MiniStat label="Epoch" value={formatCount(verdict.epoch)} />
                      <MiniStat
                        label="Round"
                        value={
                          verdict.roundHeight === null
                            ? NONE
                            : formatCount(verdict.roundHeight)
                        }
                        note={
                          verdict.roundHeight === null
                            ? 'not recorded'
                            : 'votes are per round'
                        }
                      />
                      <MiniStat
                        label="Batch"
                        value={
                          verdict.batchStart === null
                            ? NONE
                            : `${verdict.batchStart} to ${verdict.batchEnd}`
                        }
                      />
                      <MiniStat
                        label="Settled"
                        value={
                          verdict.settledCount === null
                            ? NONE
                            : `${verdict.settledCount} of ${verdict.voters.length}`
                        }
                        note="losing verifiers"
                      />
                    </div>

                    {verdict.committedHash !==
                    '0000000000000000000000000000000000000000000000000000000000000000' ? (
                      <div className="rounded-[16px] border border-black/10 bg-black/[0.02] px-4 py-3.5">
                        <p className="text-[12px] text-black/40 mb-2">
                          Evidence, written once by whoever voted first
                        </p>
                        <dl className="space-y-1.5 text-[12px] font-mono break-all">
                          <div>
                            <dt className="inline text-black/40">committed </dt>
                            <dd className="inline text-black/75">
                              {verdict.committedHash}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline text-black/40">replayed </dt>
                            <dd className="inline text-black/75">
                              {verdict.replayedHash}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ) : null}

                    <VoterList label="Convicted by" voters={verdict.voters} />
                    {verdict.appealVoters.length > 0 ? (
                      <VoterList
                        label="Appeal bench"
                        voters={verdict.appealVoters}
                      />
                    ) : null}

                    <p className="text-[12px] text-black/40">
                      Record <AddressLink address={verdict.address} edge={5} />
                      {' · '}
                      {LAYOUT_NOTE[verdict.layout]}
                      {verdict.challenger &&
                      verdict.challenger !==
                        '11111111111111111111111111111111' ? (
                        <>
                          {' · challenged by '}
                          <AddressLink address={verdict.challenger} edge={4} />
                        </>
                      ) : null}
                    </p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

function VoterList({ label, voters }: { label: string; voters: string[] }) {
  if (voters.length === 0) return null
  return (
    <div>
      <p className="text-[12px] text-black/40 mb-2">
        {label} ({voters.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {voters.map((voter) => (
          <span
            key={voter}
            className="inline-flex rounded-full border border-black/12 bg-black/[0.02] px-2.5 py-1"
          >
            <AddressLink address={voter} edge={4} />
          </span>
        ))}
      </div>
    </div>
  )
}

export function BondPanel({
  runs,
  participants,
}: {
  runs: TreasuryRun[]
  participants: Participant[]
}) {
  const bonded = participants.filter((entry) => entry.bondAmount > 0n)
  const totalBonded = bonded.reduce((sum, entry) => sum + entry.bondAmount, 0n)
  const pending = participants.filter(
    (entry) => entry.bondWithdrawPending > 0n,
  )
  const withChallenge = runs.filter(
    (run) => (run.challengeWindowSeconds ?? 0n) > 0n,
  )

  return (
    <Panel
      eyebrow="Collateral"
      title="What a cheat costs"
      badge={
        <Badge tone={bonded.length > 0 ? 'solid' : 'quiet'}>
          {bonded.length} bonds posted
        </Badge>
      }
      footer="A bond is what makes a conviction cost something. The withdraw delay is what stops a cheater leaving between committing fraud and being caught, and each pending withdrawal remembers the delay that applied when it was requested rather than the current one."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 sm:px-6 py-5 border-b border-black/[0.06]">
        <MiniStat label="Treasurer runs" value={formatCount(runs.length)} />
        <MiniStat
          label="Bonds posted"
          value={formatCount(bonded.length)}
          note={`${participants.length} participant records`}
        />
        <MiniStat label="Total bonded" value={formatCount(totalBonded)} />
        <MiniStat
          label="Withdrawals pending"
          value={formatCount(pending.length)}
        />
      </div>

      {runs.length === 0 ? (
        <EmptyRow>No treasurer run on this cluster.</EmptyRow>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-[14px]">
            <thead>
              <tr className="text-left text-[12px] text-black/40">
                <th className="px-5 sm:px-6 py-3 font-normal">Run</th>
                <th className="px-3 py-3 font-normal text-right">Bond floor</th>
                <th className="px-3 py-3 font-normal text-right">Bonded</th>
                <th className="px-3 py-3 font-normal text-right">Bounty</th>
                <th className="px-3 py-3 font-normal text-right">
                  Withdraw delay
                </th>
                <th className="px-3 py-3 font-normal text-right">Challenge</th>
                <th className="px-5 sm:px-6 py-3 font-normal text-right">
                  Bench
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.address} className="border-t border-black/[0.06]">
                  <td className="px-5 sm:px-6 py-3">
                    <AddressLink address={run.address} edge={4} />
                    <span className="ml-2 text-[12px] text-black/35">
                      {run.layout === 'preBond'
                        ? 'no bonding'
                        : run.layout === 'bonded'
                          ? 'no appeals'
                          : run.layout === 'challenge'
                            ? 'appeals'
                            : 'appeals, timed'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {run.bondMinimum === null
                      ? NONE
                      : formatCount(run.bondMinimum)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {run.totalBonded === null
                      ? NONE
                      : formatCount(run.totalBonded)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-black/55">
                    {run.slashBountyBps === null
                      ? NONE
                      : `${(run.slashBountyBps / 100).toFixed(0)}%`}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-black/55">
                    {run.bondWithdrawDelaySeconds === null
                      ? NONE
                      : formatDuration(run.bondWithdrawDelaySeconds)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-black/55">
                    {run.challengeWindowSeconds === null
                      ? NONE
                      : formatDuration(run.challengeWindowSeconds)}
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right tabular-nums text-black/55">
                    {run.tieBreakerCommitteeSize === null
                      ? NONE
                      : formatCount(run.tieBreakerCommitteeSize)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {withChallenge.length > 0 ? (
        <div className="px-5 sm:px-6 py-4 border-t border-black/[0.06] text-[13px] text-black/50">
          {withChallenge.length} of {runs.length} runs defer the forfeiture
          behind a challenge window. On the rest a quorum forfeits immediately,
          with no bench to appeal to.
        </div>
      ) : null}
    </Panel>
  )
}
