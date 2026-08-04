import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SupplyPanel from '../components/dashboard/SupplyPanel'
import ProgramsPanel from '../components/dashboard/ProgramsPanel'
import MarketPanel from '../components/dashboard/MarketPanel'
import FleetPanel from '../components/dashboard/FleetPanel'
import CommitteePanel from '../components/dashboard/CommitteePanel'
import {
  BondPanel,
  DisputePanel,
} from '../components/dashboard/DisputePanels'
import {
  LedgerPanel,
  RosterPanel,
  RunOverview,
  RunSelector,
} from '../components/dashboard/RunPanels'
import { Tile, formatCount } from '../components/dashboard/Primitives'
import { useChainFacts } from '../data/useChainFacts'
import { useFleet } from '../data/fleet'
import { joinRuns, useProtocol } from '../data/useProtocol'
import { LEVI } from '../data/levi'

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-[24px] border border-black/10 bg-black/[0.03] animate-pulse ${className}`}
    />
  )
}

export default function Dashboard() {
  const protocol = useProtocol()
  const chain = useChainFacts()
  const fleet = useFleet()
  const [selected, setSelected] = useState<string | null>(null)

  const runs = useMemo(
    () => joinRuns(protocol.instances, protocol.coordinators, protocol.runs),
    [protocol.instances, protocol.coordinators, protocol.runs],
  )

  useEffect(() => {
    if (selected === null && runs.length > 0) {
      setSelected(runs[0].coordinator.address)
    }
  }, [runs, selected])

  const active = useMemo(
    () => runs.find((run) => run.coordinator.address === selected) ?? runs[0] ?? null,
    [runs, selected],
  )

  const totals = useMemo(() => {
    let earned = 0n
    let slashed = 0n
    let participants = 0
    let convicted = 0
    for (const run of runs) {
      earned += run.coordinator.totalEarned
      slashed += run.coordinator.totalSlashed
      participants += run.coordinator.ledger.length
      convicted += run.coordinator.convicted
    }
    return { earned, slashed, participants, convicted }
  }, [runs])

  const statusLabel = protocol.loading
    ? 'reading devnet'
    : protocol.error
      ? 'devnet unreachable'
      : 'live from devnet'

  const statusTone = protocol.error
    ? 'border-black/15 text-black/45'
    : protocol.loading
      ? 'border-black/20 text-black/60'
      : 'bg-black text-white border-black'

  return (
    <div className="min-h-screen bg-white text-black font-manrope">
      <SiteHeader variant="sticky" />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <p className="text-[13px] tracking-[0.08em] text-black/40">Network</p>
            <span
              className={`inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium ${statusTone}`}
            >
              {statusLabel}
            </span>
            {protocol.fetchedAt ? (
              <span className="text-[12px] text-black/40">
                read {new Date(protocol.fetchedAt).toLocaleTimeString()}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-italiana text-[36px] sm:text-[44px] md:text-[52px] leading-[1.06] tracking-tight mb-3">
                Network dashboard
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-relaxed text-black/60 max-w-[42rem]">
                Everything below is decoded from Solana accounts in your browser.
                Nothing is fed from a file, so a panel with no data means the
                chain has none.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={protocol.refresh}
                className="inline-flex h-10 items-center rounded-full border border-black px-4 text-[14px] font-medium hover:bg-black hover:text-white transition-colors"
              >
                Refresh
              </button>
              <Link
                to="/docs/protocol/committee-vote"
                className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/70 hover:border-black hover:text-black transition-colors"
              >
                Committee vote
              </Link>
              <Link
                to="/docs/protocol/economics"
                className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/70 hover:border-black hover:text-black transition-colors"
              >
                Economics
              </Link>
            </div>
          </div>

          {protocol.error ? (
            <div className="mt-4 rounded-[18px] border border-black/15 bg-black/[0.03] px-4 py-3 text-[13px] text-black/60">
              Devnet read failed ({protocol.error}). Panels show the last good
              read, if there was one.
            </div>
          ) : null}

          {protocol.unrecognisedTreasurerAccounts > 0 ? (
            <div className="mt-4 rounded-[18px] border border-black/12 bg-black/[0.03] px-4 py-3 text-[13px] leading-relaxed text-black/55">
              {protocol.unrecognisedTreasurerAccounts} treasurer accounts are in
              a layout this page does not recognise, so they are left out rather
              than decoded with the wrong offsets.
            </div>
          ) : null}
        </header>

        {protocol.loading && runs.length === 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[112px]" />
              ))}
            </div>
            <SkeletonBlock className="h-[320px]" />
            <SkeletonBlock className="h-[280px]" />
          </div>
        ) : (
          <>
            <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Tile
                label="Runs opened"
                value={formatCount(runs.length)}
                note="on the coordinator program"
              />
              <Tile
                label="Participant records"
                value={formatCount(totals.participants)}
                note={`${protocol.authorizations.length} authorized to join`}
              />
              <Tile
                label="Points earned"
                value={formatCount(totals.earned)}
                note="proof of gradient"
              />
              <Tile
                label="Convictions"
                value={formatCount(totals.convicted)}
                note={`${formatCount(totals.slashed)} points forfeited`}
              />
            </section>

            <RunSelector
              runs={runs}
              selected={active?.coordinator.address ?? null}
              onSelect={setSelected}
            />

            {active ? (
              <>
                <RunOverview run={active} />
                <CommitteePanel coordinator={active.coordinator} />
                <LedgerPanel coordinator={active.coordinator} />
                <RosterPanel coordinator={active.coordinator} />
              </>
            ) : null}

            <DisputePanel verdicts={protocol.verdicts} />

            <BondPanel runs={protocol.runs} participants={protocol.participants} />

            <FleetPanel
              fleet={fleet.fleet}
              absent={fleet.absent}
              loading={fleet.loading}
            />

            <ProgramsPanel
              programs={chain.programs}
              cluster="devnet"
              multisig={LEVI.squads}
              loading={chain.loading}
            />

            <MarketPanel market={chain.market} loading={chain.loading} />

            <SupplyPanel
              mint={chain.mint}
              breakdown={chain.supply}
              loading={chain.loading}
            />

            <footer className="border-t border-black/10 pt-6 pb-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-black/45">
              <Link
                to="/docs/developer/run-a-node"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Run a node
              </Link>
              <Link
                to="/blog/bond-can-actually-be-posted"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Bond CLI
              </Link>
              <Link
                to="/blog/appeals-court-for-wrongful-convictions"
                className="hover:text-black underline underline-offset-2 decoration-black/20"
              >
                Appeals court
              </Link>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
