import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchAuthorizations,
  fetchCoordinators,
  fetchRunInstances,
  fetchTreasurerAccounts,
  type Authorization,
  type AuditVerdict,
  type Participant,
  type RunInstance,
  type TreasuryRun,
} from './protocol'
import type { CoordinatorView } from './coordinator'
import { CommitteeSelection, type CommitteeAssignment } from './committee'

const REFRESH_MS = 20000

export type ProtocolState = {
  instances: RunInstance[]
  coordinators: CoordinatorView[]
  runs: TreasuryRun[]
  participants: Participant[]
  verdicts: AuditVerdict[]
  authorizations: Authorization[]
  unrecognisedTreasurerAccounts: number
  loading: boolean
  error: string | null
  fetchedAt: number | null
  refresh: () => void
}

export function useProtocol(): ProtocolState {
  const [instances, setInstances] = useState<RunInstance[]>([])
  const [coordinators, setCoordinators] = useState<CoordinatorView[]>([])
  const [runs, setRuns] = useState<TreasuryRun[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [verdicts, setVerdicts] = useState<AuditVerdict[]>([])
  const [authorizations, setAuthorizations] = useState<Authorization[]>([])
  const [unrecognised, setUnrecognised] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  const controllerRef = useRef<AbortController | null>(null)

  const refresh = useCallback(() => setTick((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current?.abort()
    controllerRef.current = controller

    const read = async () => {
      try {
        const [instanceList, coordinatorList, treasurer, authList] =
          await Promise.all([
            fetchRunInstances(controller.signal),
            fetchCoordinators(controller.signal),
            fetchTreasurerAccounts(controller.signal),
            fetchAuthorizations(controller.signal),
          ])
        if (controller.signal.aborted) return
        setInstances(instanceList)
        setCoordinators(coordinatorList)
        setRuns(treasurer.runs)
        setParticipants(treasurer.participants)
        setVerdicts(treasurer.verdicts)
        setAuthorizations(authList)
        setUnrecognised(treasurer.unrecognised)
        setError(null)
        setFetchedAt(Date.now())
      } catch (cause) {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'devnet read failed')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    read()
    const timer = window.setInterval(read, REFRESH_MS)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [tick])

  return {
    instances,
    coordinators,
    runs,
    participants,
    verdicts,
    authorizations,
    unrecognisedTreasurerAccounts: unrecognised,
    loading,
    error,
    fetchedAt,
    refresh,
  }
}

/**
 * A run as the dashboard shows it: coordinator state joined to the treasurer
 * account that funds it, when there is one. Not every coordinator run has a
 * treasurer run, so the economics half is nullable rather than faked.
 */
export type JoinedRun = {
  instance: RunInstance | null
  coordinator: CoordinatorView
  treasury: TreasuryRun | null
}

export function joinRuns(
  instances: RunInstance[],
  coordinators: CoordinatorView[],
  runs: TreasuryRun[],
): JoinedRun[] {
  const byCoordinator = new Map(runs.map((run) => [run.coordinatorAccount, run]))
  const instanceByCoordinator = new Map(
    instances.map((instance) => [instance.coordinatorAccount, instance]),
  )

  return coordinators
    .map((coordinator) => ({
      instance: instanceByCoordinator.get(coordinator.address) ?? null,
      coordinator,
      treasury: byCoordinator.get(coordinator.address) ?? null,
    }))
    .sort((a, b) => {
      const activity =
        activityScore(b.coordinator) - activityScore(a.coordinator)
      if (activity !== 0) return activity
      return a.coordinator.runId.localeCompare(b.coordinator.runId)
    })
}

/**
 * Runs that did something are worth showing first. A run with participants and
 * a slash outranks one that only ever waited for members.
 */
function activityScore(coordinator: CoordinatorView): number {
  return (
    coordinator.ledger.length * 10 +
    coordinator.epochClients.length * 5 +
    coordinator.convicted * 50 +
    (coordinator.totalEarned > 0n ? 20 : 0) +
    Number(coordinator.nonce > 0n)
  )
}

export function useCommittee(
  coordinator: CoordinatorView | null,
  tieBreakerOverride: number | null,
): { assignments: CommitteeAssignment[]; selection: CommitteeSelection | null } {
  return useMemo(() => {
    const round = coordinator?.head
    if (!coordinator || !round || round.clientsLen === 0) {
      return { assignments: [], selection: null }
    }

    const selection = CommitteeSelection.create({
      tieBreakerNodes: tieBreakerOverride ?? round.tieBreakerTasks,
      witnessNodes: coordinator.config.witnessNodes,
      verificationPercent: coordinator.config.verificationPercent,
      totalNodes: round.clientsLen,
      randomSeed: round.randomSeed,
    })

    if (!selection) return { assignments: [], selection: null }
    return { assignments: selection.assignAll(), selection }
  }, [coordinator, tieBreakerOverride])
}
