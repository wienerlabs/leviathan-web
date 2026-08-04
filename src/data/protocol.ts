import { ACCOUNT_SIZE } from './layout'
import { decodeCoordinator, toBase58, type CoordinatorView } from './coordinator'

export const DEVNET_RPC =
  (import.meta.env.VITE_SOLANA_DEVNET_RPC as string | undefined)?.trim() ||
  'https://api.devnet.solana.com'

/**
 * The devnet deployments that actually hold state.
 *
 * The mainnet-id rehearsal deployments (`9Sid2EWE…`, `A6Z8jZeK…`, `2QXAd9g3…`)
 * are also on devnet but own zero accounts, so pointing the dashboard at them
 * showed a network that had never run.
 */
export const PROGRAMS = {
  coordinator: 'JD9rHTiqBFgHjViWZc7gFZX74LvKKysbLbqFRaFvtmmN',
  treasurer: '9A1kc8Dr9dFJW9t1npAk7EHrADm6TAyFeVLH27CDdvv8',
  authorizer: '2Kg5ERG6ubuzyPmQ24axsws7V2ja2EvWp5CHMKFCrTxv',
} as const

export const MAINNET_ID_REHEARSALS = {
  coordinator: '9Sid2EWErkyMBKoqy9vzruRq6qJV2TUy9grp6NiieWN7',
  treasurer: 'A6Z8jZeKi81zUaozR7X7SGXtY8EyXm1YyTeFMuFgXEkW',
  authorizer: '2QXAd9g31vKFGSyxZC2wcjJdCZ4bjCdzrXA95H6Ft2eU',
} as const

type RpcAccount = { pubkey: string; account: { data: [string, string] } }

async function rpc<T>(
  method: string,
  params: unknown[],
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(DEVNET_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal,
  })
  if (!response.ok) throw new Error(`${method} failed with ${response.status}`)
  const json = (await response.json()) as {
    result?: T
    error?: { message: string }
  }
  if (json.error) throw new Error(json.error.message)
  if (json.result === undefined) throw new Error(`${method} returned nothing`)
  return json.result
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out
}

async function programAccounts(
  programId: string,
  dataSize: number | null,
  signal?: AbortSignal,
): Promise<{ pubkey: string; data: Uint8Array }[]> {
  const config: Record<string, unknown> = { encoding: 'base64' }
  if (dataSize !== null) config.filters = [{ dataSize }]
  const result = await rpc<RpcAccount[]>(
    'getProgramAccounts',
    [programId, config],
    signal,
  )
  return result.map((entry) => ({
    pubkey: entry.pubkey,
    data: decodeBase64(entry.account.data[0]),
  }))
}

class Reader {
  private at: number
  private readonly view: DataView

  constructor(view: DataView, start: number) {
    this.view = view
    this.at = start
  }

  get offset(): number {
    return this.at
  }

  u8(): number {
    const value = this.view.getUint8(this.at)
    this.at += 1
    return value
  }

  u16(): number {
    const value = this.view.getUint16(this.at, true)
    this.at += 2
    return value
  }

  u32(): number {
    const value = this.view.getUint32(this.at, true)
    this.at += 4
    return value
  }

  u64(): bigint {
    const value = this.view.getBigUint64(this.at, true)
    this.at += 8
    return value
  }

  i64(): bigint {
    const value = this.view.getBigInt64(this.at, true)
    this.at += 8
    return value
  }

  pubkey(): string {
    const bytes = new Uint8Array(
      this.view.buffer,
      this.view.byteOffset + this.at,
      32,
    )
    this.at += 32
    return toBase58(bytes)
  }

  hash(): string {
    const bytes = new Uint8Array(
      this.view.buffer,
      this.view.byteOffset + this.at,
      32,
    )
    this.at += 32
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  pubkeyVec(): string[] {
    const len = this.u32()
    const out: string[] = []
    for (let i = 0; i < len; i += 1) out.push(this.pubkey())
    return out
  }
}

function reader(data: Uint8Array, start = 8): Reader {
  return new Reader(new DataView(data.buffer, data.byteOffset, data.byteLength), start)
}

export type RunInstance = {
  address: string
  runId: string
  mainAuthority: string
  joinAuthority: string
  coordinatorAccount: string
}

export async function fetchRunInstances(
  signal?: AbortSignal,
): Promise<RunInstance[]> {
  const accounts = await programAccounts(PROGRAMS.coordinator, 173, signal)
  return accounts
    .map((entry) => {
      const r = reader(entry.data)
      r.u8()
      const mainAuthority = r.pubkey()
      const joinAuthority = r.pubkey()
      const coordinatorAccount = r.pubkey()
      const length = r.u32()
      const bytes = entry.data.subarray(r.offset, r.offset + length)
      return {
        address: entry.pubkey,
        runId: new TextDecoder().decode(bytes),
        mainAuthority,
        joinAuthority,
        coordinatorAccount,
      }
    })
    .sort((a, b) => a.runId.localeCompare(b.runId))
}

/**
 * Every coordinator account, which is 2.7 MB over the wire once base64 has had
 * its way with 18 accounts of 119 KB. Worth paying on load to list the runs
 * with their real activity, not worth paying on a timer: use
 * {@link fetchCoordinator} to refresh whichever one is on screen.
 */
export async function fetchCoordinators(
  signal?: AbortSignal,
): Promise<CoordinatorView[]> {
  const accounts = await programAccounts(
    PROGRAMS.coordinator,
    ACCOUNT_SIZE,
    signal,
  )
  return accounts
    .map((entry) => decodeCoordinator(entry.pubkey, entry.data))
    .filter((entry): entry is CoordinatorView => entry !== null)
}

export async function fetchCoordinator(
  address: string,
  signal?: AbortSignal,
): Promise<CoordinatorView | null> {
  const result = await rpc<{
    value: { data: [string, string] } | null
  }>('getAccountInfo', [address, { encoding: 'base64' }], signal)
  if (!result.value) return null
  return decodeCoordinator(address, decodeBase64(result.value.data[0]))
}

/**
 * Which set of fields a treasurer `Run` account carries.
 *
 * Four generations are live at once, and they are told apart by length because
 * that is the only thing on chain that distinguishes them. Reading a short
 * account with the long layout does not throw, it invents a bond floor, so
 * anything unrecognised is reported as unknown instead of decoded.
 */
export type RunLayout = 'preBond' | 'bonded' | 'challenge' | 'appeal' | 'unknown'

const RUN_LAYOUT_BY_SIZE: Record<number, RunLayout> = {
  200: 'preBond',
  224: 'bonded',
  232: 'challenge',
  237: 'appeal',
}

export type TreasuryRun = {
  address: string
  layout: RunLayout
  index: bigint
  mainAuthority: string
  coordinatorAccount: string
  coordinatorInstance: string
  collateralMint: string
  totalClaimedCollateral: bigint
  totalClaimedEarnedPoints: bigint
  totalBonded: bigint | null
  bondMinimum: bigint | null
  bondWithdrawDelaySeconds: bigint | null
  slashBountyBps: number | null
  challengeWindowSeconds: bigint | null
  tieBreakerCommitteeSize: number | null
  appealWindowSeconds: bigint | null
}

type RawAccount = { pubkey: string; data: Uint8Array }

/**
 * Runs, participants and verdicts all live under the treasurer program, so they
 * come back in one `getProgramAccounts` call and are sorted here by length
 * rather than fetched three times.
 */
export type TreasurerAccounts = {
  runs: TreasuryRun[]
  participants: Participant[]
  verdicts: AuditVerdict[]
  unrecognised: number
}

export async function fetchTreasurerAccounts(
  signal?: AbortSignal,
): Promise<TreasurerAccounts> {
  const accounts = await programAccounts(PROGRAMS.treasurer, null, signal)
  const runs = decodeRuns(accounts)
  const participants = decodeParticipants(accounts)
  const verdicts = decodeVerdicts(accounts)
  const recognised = runs.length + participants.length + verdicts.length
  return {
    runs,
    participants,
    verdicts,
    unrecognised: accounts.length - recognised,
  }
}

function decodeRuns(accounts: RawAccount[]): TreasuryRun[] {
  const out: TreasuryRun[] = []

  for (const entry of accounts) {
    const layout = RUN_LAYOUT_BY_SIZE[entry.data.byteLength]
    if (!layout) continue

    const r = reader(entry.data)
    r.u8()
    const index = r.u64()
    const mainAuthority = r.pubkey()
    r.pubkey()
    const coordinatorAccount = r.pubkey()
    const coordinatorInstance = r.pubkey()
    const collateralMint = r.pubkey()
    const totalClaimedCollateral = r.u64()
    const totalClaimedEarnedPoints = r.u64()

    const bonded = layout !== 'preBond'
    const challenge = layout === 'challenge' || layout === 'appeal'

    out.push({
      address: entry.pubkey,
      layout,
      index,
      mainAuthority,
      coordinatorAccount,
      coordinatorInstance,
      collateralMint,
      totalClaimedCollateral,
      totalClaimedEarnedPoints,
      totalBonded: bonded ? r.u64() : null,
      bondMinimum: bonded ? r.u64() : null,
      bondWithdrawDelaySeconds: bonded ? r.i64() : null,
      slashBountyBps: bonded ? r.u16() : null,
      challengeWindowSeconds: challenge ? r.i64() : null,
      tieBreakerCommitteeSize: challenge ? r.u16() : null,
      appealWindowSeconds: layout === 'appeal' ? r.i64() : null,
    })
  }

  return out.sort((a, b) => Number(a.index - b.index))
}

export type Participant = {
  address: string
  bondAmount: bigint
  bondWithdrawPending: bigint
  bondWithdrawRequestedAt: bigint
  bondSettledSlashedPoints: bigint
  claimedCollateral: bigint
  claimedEarnedPoints: bigint
  hasWithdrawDelaySnapshot: boolean
}

function decodeParticipants(accounts: RawAccount[]): Participant[] {
  const out: Participant[] = []

  for (const entry of accounts) {
    const size = entry.data.byteLength
    // 64 is the padded `size_of` allocation the deployed accounts were created
    // with; 65 is the hand-counted Borsh length that added the withdraw delay
    // snapshot (wienerlabs/leviathan#15, findings 13 and 17).
    if (size !== 64 && size !== 65) continue

    const r = reader(entry.data)
    r.u8()
    const claimedCollateral = r.u64()
    const claimedEarnedPoints = r.u64()
    const bondAmount = r.u64()
    const bondWithdrawPending = r.u64()
    const bondWithdrawRequestedAt = r.i64()
    const bondSettledSlashedPoints = r.u64()

    out.push({
      address: entry.pubkey,
      bondAmount,
      bondWithdrawPending,
      bondWithdrawRequestedAt,
      bondSettledSlashedPoints,
      claimedCollateral,
      claimedEarnedPoints,
      hasWithdrawDelaySnapshot: size === 65,
    })
  }

  return out.sort((a, b) => Number(b.bondAmount - a.bondAmount))
}

export const VERDICT_STATUS = [
  'Voting',
  'Slash pending',
  'Challenged',
  'Upheld',
  'Overturned',
] as const

/**
 * `Resolved` is not one of the program's states. The original layout had no
 * status at all, only a `resolved` bool, so a legacy account gets that word
 * rather than being mapped onto an enum it predates.
 */
export type VerdictStatus = (typeof VERDICT_STATUS)[number] | 'Resolved'

/**
 * Three generations, and the difference is field order rather than just length.
 *
 * - `voteOnly`   epoch u16, verdict_count u16, resolved bool
 * - `appeals`    epoch u16, status u8, verdict_count u16
 * - `appealsWithDeadline` adds round_height u32 after epoch
 *
 * Reading a `voteOnly` account with the `appeals` order lands `status` on the
 * low byte of the count and the count on the high byte plus the bool, which is
 * how the same record read as "Challenged, 256 to convict" instead of
 * "resolved, 2 to convict".
 */
export type VerdictLayout = 'voteOnly' | 'appeals' | 'appealsWithDeadline'

export type AuditVerdict = {
  address: string
  layout: VerdictLayout
  run: string
  target: string
  epoch: number
  roundHeight: number | null
  status: VerdictStatus
  verdictCount: number
  committedHash: string
  replayedHash: string
  targetIndex: bigint | null
  batchStart: bigint | null
  batchEnd: bigint | null
  pendingSinceUnix: bigint | null
  challengedSinceUnix: bigint | null
  challenger: string | null
  overturnCount: number | null
  upholdCount: number | null
  settledCount: number | null
  voters: string[]
  appealVoters: string[]
}

const VERDICT_LAYOUT_BY_SIZE: Record<number, VerdictLayout> = {
  2194: 'voteOnly',
  4316: 'appeals',
  4328: 'appealsWithDeadline',
}

function decodeVerdicts(accounts: RawAccount[]): AuditVerdict[] {
  const out: AuditVerdict[] = []

  for (const entry of accounts) {
    const layout = VERDICT_LAYOUT_BY_SIZE[entry.data.byteLength]
    if (!layout) continue

    const r = reader(entry.data)
    r.u8()
    const run = r.pubkey()
    const target = r.pubkey()
    const epoch = r.u16()
    const full = layout !== 'voteOnly'

    const roundHeight = layout === 'appealsWithDeadline' ? r.u32() : null
    let status: VerdictStatus
    let verdictCount: number
    if (full) {
      const raw = r.u8()
      status = VERDICT_STATUS[raw] ?? VERDICT_STATUS[0]
      verdictCount = r.u16()
    } else {
      verdictCount = r.u16()
      status = r.u8() === 1 ? 'Resolved' : 'Voting'
    }

    const committedHash = r.hash()
    const replayedHash = r.hash()

    const targetIndex = full ? r.u64() : null
    const batchStart = full ? r.u64() : null
    const batchEnd = full ? r.u64() : null
    const pendingSinceUnix = full ? r.i64() : null
    const challengedSinceUnix =
      layout === 'appealsWithDeadline' ? r.i64() : null
    const challenger = full ? r.pubkey() : null
    const overturnCount = full ? r.u16() : null
    const upholdCount = full ? r.u16() : null
    const settledCount = full ? r.u16() : null
    const voters = r.pubkeyVec()
    const appealVoters = full ? r.pubkeyVec() : []

    out.push({
      address: entry.pubkey,
      layout,
      run,
      target,
      epoch,
      roundHeight,
      status,
      verdictCount,
      committedHash,
      replayedHash,
      targetIndex,
      batchStart,
      batchEnd,
      pendingSinceUnix,
      challengedSinceUnix,
      challenger,
      overturnCount,
      upholdCount,
      settledCount,
      voters,
      appealVoters,
    })
  }

  return out
}

export type Authorization = {
  address: string
  grantor: string
  grantee: string
  scope: string
  active: boolean
  delegates: string[]
}

export async function fetchAuthorizations(
  signal?: AbortSignal,
): Promise<Authorization[]> {
  const accounts = await programAccounts(PROGRAMS.authorizer, null, signal)
  const out: Authorization[] = []

  for (const entry of accounts) {
    try {
      const r = reader(entry.data)
      r.u8()
      const grantor = r.pubkey()
      const grantee = r.pubkey()
      const scopeLen = r.u32()
      const scopeBytes = entry.data.subarray(r.offset, r.offset + scopeLen)
      const scoped = new Reader(
        new DataView(entry.data.buffer, entry.data.byteOffset, entry.data.byteLength),
        r.offset + scopeLen,
      )
      const active = scoped.u8() === 1
      const delegates = scoped.pubkeyVec()
      out.push({
        address: entry.pubkey,
        grantor,
        grantee,
        scope: new TextDecoder().decode(scopeBytes),
        active,
        delegates,
      })
    } catch {
      continue
    }
  }

  return out
}
