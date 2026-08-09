import { useEffect, useState } from 'react'
import {
  DEVNET_RPC,
  fetchMintFacts,
  fetchProgramStatus,
  fetchSupplyBreakdown,
  type MintFacts,
  type ProgramStatus,
  type SupplyBreakdown,
} from './chain'
import { fetchLeviMarket, LEVI, type MarketSnapshot } from './levi'
import {
  MAINNET_ID_REHEARSALS,
  PROGRAMS,
  SUPERSEDED_DEVNET,
} from './protocol'

const REFRESH_MS = 60000

/**
 * The protocol programs live on devnet while the token lives on mainnet, so
 * this reads from both and says which cluster each panel is describing rather
 * than blurring them together.
 *
 * The first three are the live deployment. The next three are the deployment it
 * replaced, listed so its abandoned runs stay reachable. The rehearsal builds
 * carry the mainnet program ids and are also on devnet, but own no accounts, so
 * a list containing only those described a network that had never run.
 */
export const PROTOCOL_PROGRAMS = [
  { name: 'Coordinator', id: PROGRAMS.coordinator },
  { name: 'Treasurer', id: PROGRAMS.treasurer },
  { name: 'Authorizer', id: PROGRAMS.authorizer },
  { name: 'Coordinator, superseded', id: SUPERSEDED_DEVNET.coordinator },
  { name: 'Treasurer, superseded', id: SUPERSEDED_DEVNET.treasurer },
  { name: 'Authorizer, superseded', id: SUPERSEDED_DEVNET.authorizer },
  {
    name: 'Coordinator, mainnet id rehearsal',
    id: MAINNET_ID_REHEARSALS.coordinator,
  },
  {
    name: 'Treasurer, mainnet id rehearsal',
    id: MAINNET_ID_REHEARSALS.treasurer,
  },
  {
    name: 'Authorizer, mainnet id rehearsal',
    id: MAINNET_ID_REHEARSALS.authorizer,
  },
] as const

export type ChainFacts = {
  mint: MintFacts | null
  supply: SupplyBreakdown | null
  programs: ProgramStatus[]
  market: MarketSnapshot | null
  loading: boolean
}

export function useChainFacts(): ChainFacts {
  const [mint, setMint] = useState<MintFacts | null>(null)
  const [supply, setSupply] = useState<SupplyBreakdown | null>(null)
  const [programs, setPrograms] = useState<ProgramStatus[]>([])
  const [market, setMarket] = useState<MarketSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const read = async () => {
      const facts = await fetchMintFacts(controller.signal).catch(() => null)
      if (controller.signal.aborted) return
      if (facts) {
        setMint(facts)
        const breakdown = await fetchSupplyBreakdown(
          facts.supply,
          controller.signal,
        ).catch(() => null)
        if (!controller.signal.aborted && breakdown) setSupply(breakdown)
      }

      const statuses = await Promise.all(
        PROTOCOL_PROGRAMS.map((p) =>
          fetchProgramStatus(
            p.name,
            p.id,
            LEVI.squads,
            DEVNET_RPC,
            controller.signal,
          ),
        ),
      ).catch(() => [])
      if (!controller.signal.aborted && statuses.length > 0) setPrograms(statuses)

      const snapshot = await fetchLeviMarket(
        LEVI.mint,
        LEVI.pool,
        controller.signal,
      ).catch(() => null)
      if (!controller.signal.aborted && snapshot) setMarket(snapshot)
    }

    read().finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    const timer = window.setInterval(read, REFRESH_MS)

    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [])

  return { mint, supply, programs, market, loading }
}
