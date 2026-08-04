import { LEVI } from './levi'
import { toBase58 } from './coordinator'

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out
}

export const MAINNET_RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined)?.trim() ||
  'https://api.mainnet-beta.solana.com'

export const DEVNET_RPC =
  (import.meta.env.VITE_SOLANA_DEVNET_RPC as string | undefined)?.trim() ||
  'https://api.devnet.solana.com'

export const TOKEN_2022_PROGRAM = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'

/**
 * Every address on this page is labelled by matching it against this table.
 * Anything not in it is counted as an ordinary holder, so a wrong or stale
 * entry understates what is locked rather than overstating it.
 */
export const KNOWN_OWNERS: Record<string, { label: string; kind: SupplyKind }> = {
  ALxuDYPT5BYE5jWW5zF4BK8o1KXAwPcrt7SGdUspjNNr: {
    label: 'Treasury multisig',
    kind: 'treasury',
  },
  '3RTW9n8oxbf52LLghdeznZXLU2xQ5GJPGGMhWUEKZdis': {
    label: 'Team lock',
    kind: 'locked',
  },
  '21CRCXQjNEFg3kAhDL6gt859itsvtYYJGN9UyXvrW85b': {
    label: 'Ecosystem lock',
    kind: 'locked',
  },
  GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL: {
    label: 'Raydium pool',
    kind: 'pool',
  },
  DePfNY9tn3E7pTMP8arSV16PdrfmUDTdQnfs8FnUiWEM: {
    label: 'Founder wallet',
    kind: 'circulating',
  },
}

export type SupplyKind = 'treasury' | 'locked' | 'pool' | 'circulating'

async function rpc<T>(
  endpoint: string,
  method: string,
  params: unknown[],
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal,
  })
  if (!response.ok) throw new Error(`${method} failed with ${response.status}`)
  const json = (await response.json()) as { result?: T; error?: { message: string } }
  if (json.error) throw new Error(json.error.message)
  if (json.result === undefined) throw new Error(`${method} returned nothing`)
  return json.result
}

export type MintFacts = {
  supply: number
  decimals: number
  mintAuthority: string | null
  freezeAuthority: string | null
  extensions: string[]
  isToken2022: boolean
}

export async function fetchMintFacts(signal?: AbortSignal): Promise<MintFacts> {
  const result = await rpc<{
    value: {
      owner: string
      data: {
        parsed: {
          info: {
            supply: string
            decimals: number
            mintAuthority: string | null
            freezeAuthority: string | null
            extensions?: { extension: string }[]
          }
        }
      }
    }
  }>(MAINNET_RPC, 'getAccountInfo', [LEVI.mint, { encoding: 'jsonParsed' }], signal)

  const info = result.value.data.parsed.info
  return {
    supply: Number(info.supply) / 10 ** info.decimals,
    decimals: info.decimals,
    mintAuthority: info.mintAuthority,
    freezeAuthority: info.freezeAuthority,
    extensions: (info.extensions ?? []).map((e) => e.extension),
    isToken2022: result.value.owner === TOKEN_2022_PROGRAM,
  }
}

export type SupplySlice = {
  owner: string
  label: string
  kind: SupplyKind
  amount: number
  share: number
}

export type SupplyBreakdown = {
  total: number
  slices: SupplySlice[]
  locked: number
  treasury: number
  pool: number
  circulating: number
}

export async function fetchSupplyBreakdown(
  total: number,
  signal?: AbortSignal,
): Promise<SupplyBreakdown> {
  const largest = await rpc<{
    value: { address: string; uiAmount: number }[]
  }>(MAINNET_RPC, 'getTokenLargestAccounts', [LEVI.mint], signal)

  const owners = await Promise.all(
    largest.value.map(async (account) => {
      try {
        const info = await rpc<{
          value: { data: { parsed: { info: { owner: string } } } } | null
        }>(
          MAINNET_RPC,
          'getAccountInfo',
          [account.address, { encoding: 'jsonParsed' }],
          signal,
        )
        return info.value?.data.parsed.info.owner ?? account.address
      } catch {
        return account.address
      }
    }),
  )

  const slices: SupplySlice[] = largest.value.map((account, i) => {
    const owner = owners[i]
    const known = KNOWN_OWNERS[owner]
    return {
      owner,
      label: known?.label ?? 'Holder',
      kind: known?.kind ?? 'circulating',
      amount: account.uiAmount,
      share: total > 0 ? (account.uiAmount / total) * 100 : 0,
    }
  })

  const sum = (kind: SupplyKind) =>
    slices.filter((s) => s.kind === kind).reduce((a, s) => a + s.amount, 0)

  const treasury = sum('treasury')
  const locked = sum('locked')
  const pool = sum('pool')

  return {
    total,
    slices,
    treasury,
    locked,
    pool,
    // Anything this page cannot account for is treated as circulating. That
    // errs toward a larger float, which is the direction that does not
    // flatter the project.
    circulating: Math.max(total - treasury - locked - pool, 0),
  }
}

export type ProgramStatus = {
  name: string
  programId: string
  deployed: boolean
  upgradeAuthority: string | null
  underMultisig: boolean
  dataLength: number | null
}

export async function fetchProgramStatus(
  name: string,
  programId: string,
  multisig: string,
  endpoint: string,
  signal?: AbortSignal,
): Promise<ProgramStatus> {
  const base: ProgramStatus = {
    name,
    programId,
    deployed: false,
    upgradeAuthority: null,
    underMultisig: false,
    dataLength: null,
  }

  try {
    const program = await rpc<{
      value: {
        data: { parsed?: { info?: { programData?: string } } }
      } | null
    }>(endpoint, 'getAccountInfo', [programId, { encoding: 'jsonParsed' }], signal)

    const programData = program.value?.data.parsed?.info?.programData
    if (!programData) return base

    // Sliced, because a programData account holds the whole compiled program.
    // Asking for it parsed pulled roughly half a megabyte per program per
    // refresh, for one pubkey. The header is the loader enum, the deploy slot,
    // and an optional authority.
    const detail = await rpc<{
      value: { data: [string, string]; space?: number } | null
    }>(
      endpoint,
      'getAccountInfo',
      [
        programData,
        { encoding: 'base64', dataSlice: { offset: 0, length: 45 } },
      ],
      signal,
    )

    if (!detail.value) return { ...base, deployed: true }

    const header = decodeBase64(detail.value.data[0])
    const hasAuthority = header.length >= 45 && header[12] === 1
    const authority = hasAuthority
      ? toBase58(header.subarray(13, 45))
      : null

    return {
      name,
      programId,
      deployed: true,
      upgradeAuthority: authority,
      underMultisig: authority === multisig,
      dataLength: detail.value.space ?? null,
    }
  } catch {
    return base
  }
}
