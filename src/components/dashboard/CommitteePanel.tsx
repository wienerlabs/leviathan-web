import { useMemo, useState } from 'react'
import type { CoordinatorView } from '../../data/coordinator'
import { useCommittee } from '../../data/useProtocol'
import type { CommitteeRole } from '../../data/committee'
import {
  AddressLink,
  Badge,
  EmptyRow,
  MiniStat,
  Panel,
  formatCount,
} from './Primitives'

const ROLE_ORDER: CommitteeRole[] = ['Tie breaker', 'Verifier', 'Trainer']

const ROLE_BLURB: Record<CommitteeRole, string> = {
  'Tie breaker':
    'Sits out the round so it can rule on an appeal without having voted in the conviction it is reviewing.',
  Verifier:
    'Replays another node’s assigned batch and compares the result against what was committed.',
  Trainer: 'Trains its assigned batch and commits the gradient.',
}

export default function CommitteePanel({
  coordinator,
}: {
  coordinator: CoordinatorView
}) {
  const round = coordinator.head
  const [override, setOverride] = useState<number | null>(null)
  const { assignments, selection } = useCommittee(coordinator, override)

  const counts = useMemo(() => {
    const out: Record<CommitteeRole, number> = {
      'Tie breaker': 0,
      Verifier: 0,
      Trainer: 0,
    }
    for (const assignment of assignments) out[assignment.role] += 1
    return out
  }, [assignments])

  const witnesses = assignments.filter((entry) => entry.witness).length
  const drawSize = round?.clientsLen ?? 0
  const actualTieBreakers = round?.tieBreakerTasks ?? 0
  const exploring = override !== null && override !== actualTieBreakers
  // The draw is by index into the roster as it stood when the round opened. A
  // node that has since exited leaves a gap, and the exited list is ordered by
  // when each left rather than where it sat, so those seats are shown by number
  // instead of guessed at. Assuming the two lists run parallel is what let a
  // convicted participant keep its bond (wienerlabs/leviathan#15, finding 1).
  const namedSeats = assignments.filter(
    (entry) => coordinator.epochClients[entry.index] !== undefined,
  ).length

  if (!round || drawSize === 0 || !selection) {
    return (
      <Panel
        eyebrow="Committee"
        title="Who drew which seat"
        footer="Roles are drawn from Round.random_seed, which is stored on chain in the clear. This panel recomputes the same lottery the program runs, so it shows nothing an observer could not already derive."
      >
        <EmptyRow>
          This run has no round with participants to draw from.
        </EmptyRow>
      </Panel>
    )
  }

  return (
    <Panel
      eyebrow="Committee"
      title="Who drew which seat"
      badge={
        exploring ? (
          <Badge tone="solid">exploring, not the live draw</Badge>
        ) : (
          <Badge>round {formatCount(round.height)}</Badge>
        )
      }
      footer={
        <>
          Drawn from <span className="font-mono">random_seed</span>{' '}
          <span className="font-mono text-black/70">
            {round.randomSeed.toString()}
          </span>
          , which the coordinator stores in the clear. The same shuffle runs in
          the browser here and in the program on chain, checked against Rust
          vectors on every build, so this is a recomputation rather than a
          report. Nothing here is secret: what is deliberately never published
          alongside it is which machine sits behind an identity.
          {namedSeats < assignments.length ? (
            <>
              {' '}
              {assignments.length - namedSeats} of {assignments.length} seats
              show a seat number rather than an identity, because those nodes
              have since left the epoch. The exited list is ordered by when each
              node left rather than where it sat, so matching them back by
              position would be a guess.
            </>
          ) : null}
        </>
      }
    >
      <div className="px-5 sm:px-6 py-5 border-b border-black/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat
            label="In the draw"
            value={formatCount(drawSize)}
            note="roster at round start"
          />
          <MiniStat
            label="Tie breakers"
            value={formatCount(counts['Tie breaker'])}
            note="appeal bench"
          />
          <MiniStat
            label="Verifiers"
            value={formatCount(counts.Verifier)}
            note={`${coordinator.config.verificationPercent}% of free nodes`}
          />
          <MiniStat
            label="Witnesses"
            value={formatCount(witnesses)}
            note="separate draw"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-black/45">
            Try a different tie-breaker count
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, Math.min(drawSize, 16))}
            value={override ?? actualTieBreakers}
            onChange={(event) => setOverride(Number(event.target.value))}
            className="flex-1 min-w-[160px] accent-black"
          />
          <span className="text-[14px] tabular-nums w-8">
            {override ?? actualTieBreakers}
          </span>
          {exploring ? (
            <button
              type="button"
              onClick={() => setOverride(null)}
              className="h-8 rounded-full border border-black/15 px-3 text-[13px] text-black/60 hover:border-black hover:text-black transition-colors"
            >
              Back to the live draw
            </button>
          ) : null}
        </div>
      </div>

      <div className="divide-y divide-black/[0.06]">
        {ROLE_ORDER.map((role) => {
          const members = assignments.filter((entry) => entry.role === role)
          if (members.length === 0) return null
          return (
            <div key={role} className="px-5 sm:px-6 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2.5">
                <h3 className="text-[15px]">{role}</h3>
                <span className="text-[13px] tabular-nums text-black/45">
                  {members.length}
                </span>
                <p className="text-[12px] text-black/40 w-full sm:w-auto sm:flex-1 leading-snug">
                  {ROLE_BLURB[role]}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => {
                  const client = coordinator.epochClients[member.index]
                  return (
                    <span
                      key={member.index}
                      className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-black/[0.02] pl-2.5 pr-3 py-1.5 text-[12px]"
                    >
                      <span className="text-black/35 tabular-nums">
                        index {member.index}
                      </span>
                      {client ? (
                        <AddressLink address={client.signer} edge={4} />
                      ) : (
                        <span className="text-black/40 tabular-nums">
                          seat {member.position.toString()}
                        </span>
                      )}
                      {member.witness ? (
                        <span className="text-black/45">witness</span>
                      ) : null}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
