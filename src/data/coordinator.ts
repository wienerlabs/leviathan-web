import {
  ACCOUNT_SIZE,
  AT,
  CLIENT_STATES,
  CONFIG_AT,
  CLIENT_VERSION_LEN,
  EPOCH_CLIENT_AT,
  LEDGER_CLIENT_AT,
  MAX_CLIENTS,
  NUM_STORED_ROUNDS,
  ROUND_AT,
  RUN_ID_LEN,
  RUN_STATES,
  SIZE,
  type ClientStateName,
  type RunStateName,
} from './layout'

const ACCOUNT_VERSION = 1n

export type EpochClient = {
  signer: string
  state: ClientStateName
  exitedHeight: number
}

export type LedgerClient = {
  signer: string
  earned: bigint
  slashed: bigint
  active: bigint
}

export type RoundView = {
  height: number
  randomSeed: bigint
  clientsLen: number
  tieBreakerTasks: number
  dataIndex: bigint
  witnesses: number
  isHead: boolean
}

export type RunConfig = {
  warmupTime: bigint
  cooldownTime: bigint
  maxRoundTrainTime: bigint
  roundWitnessTime: bigint
  epochTime: bigint
  totalSteps: number
  initMinClients: number
  minClients: number
  witnessNodes: number
  globalBatchSizeStart: number
  globalBatchSizeEnd: number
  verificationPercent: number
}

export type CoordinatorView = {
  address: string
  runId: string
  runState: RunStateName
  runStateRaw: number
  nonce: bigint
  clientVersion: string
  config: RunConfig
  epochClients: EpochClient[]
  exitedClients: EpochClient[]
  ledger: LedgerClient[]
  rounds: RoundView[]
  head: RoundView | null
  startStep: number
  lastStep: number
  startTimestamp: bigint
  runStateStartUnix: bigint
  totalEarned: bigint
  totalSlashed: bigint
  convicted: number
}

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function toBase58(bytes: Uint8Array): string {
  let leading = 0
  while (leading < bytes.length && bytes[leading] === 0) leading += 1

  const digits: number[] = []
  for (let i = leading; i < bytes.length; i += 1) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; j += 1) {
      carry += digits[j] << 8
      digits[j] = carry % 58
      carry = (carry / 58) | 0
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = (carry / 58) | 0
    }
  }

  let out = '1'.repeat(leading)
  for (let i = digits.length - 1; i >= 0; i -= 1) out += BASE58[digits[i]]
  return out === '' ? '1' : out
}

function fixedString(view: DataView, at: number, length: number): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset + at, length)
  let end = 0
  while (end < length && bytes[end] !== 0) end += 1
  return new TextDecoder().decode(bytes.subarray(0, end))
}

function signer(view: DataView, at: number): string {
  return toBase58(new Uint8Array(view.buffer, view.byteOffset + at, 32))
}

/**
 * Refuses a mismatched account rather than decoding it.
 *
 * A zero-copy read of the wrong layout produces numbers, not an error, so the
 * only honest failure mode is to check the length and version up front and
 * return null when either is unexpected.
 */
export function decodeCoordinator(
  address: string,
  data: Uint8Array,
): CoordinatorView | null {
  if (data.byteLength !== ACCOUNT_SIZE) return null
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  if (view.getBigUint64(AT.version, true) !== ACCOUNT_VERSION) return null

  const runStateRaw = view.getUint32(AT.runState, true)
  const config = readConfig(view)

  const epochClients = readEpochClients(view, AT.epochClients)
  const exitedClients = readEpochClients(view, AT.exitedClients)
  const ledger = readLedger(view)

  const head = view.getUint32(AT.roundsHead, true)
  const rounds: RoundView[] = []
  for (let i = 0; i < NUM_STORED_ROUNDS; i += 1) {
    const at = AT.rounds + i * SIZE.round
    const round: RoundView = {
      height: view.getUint32(at + ROUND_AT.height, true),
      randomSeed: view.getBigUint64(at + ROUND_AT.randomSeed, true),
      clientsLen: view.getUint16(at + ROUND_AT.clientsLen, true),
      tieBreakerTasks: view.getUint16(at + ROUND_AT.tieBreakerTasks, true),
      dataIndex: view.getBigUint64(at + ROUND_AT.dataIndex, true),
      witnesses: Number(view.getBigUint64(at + ROUND_AT.witnessesLen, true)),
      isHead: i === head,
    }
    rounds.push(round)
  }

  let totalEarned = 0n
  let totalSlashed = 0n
  for (const entry of ledger) {
    totalEarned += entry.earned
    totalSlashed += entry.slashed
  }

  return {
    address,
    runId: fixedString(view, AT.runId, RUN_ID_LEN),
    runState: RUN_STATES[runStateRaw] ?? RUN_STATES[0],
    runStateRaw,
    nonce: view.getBigUint64(AT.nonce, true),
    clientVersion: fixedString(view, AT.clientVersion, CLIENT_VERSION_LEN),
    config,
    epochClients,
    exitedClients,
    ledger,
    rounds,
    head: rounds[head] ?? null,
    startStep: view.getUint32(AT.startStep, true),
    lastStep: view.getUint32(AT.lastStep, true),
    startTimestamp: view.getBigUint64(AT.startTimestamp, true),
    runStateStartUnix: view.getBigUint64(AT.runStateStartUnix, true),
    totalEarned,
    totalSlashed,
    convicted: ledger.filter((entry) => entry.slashed > 0n).length,
  }
}

function readConfig(view: DataView): RunConfig {
  const at = AT.config
  return {
    warmupTime: view.getBigUint64(at + CONFIG_AT.warmupTime, true),
    cooldownTime: view.getBigUint64(at + CONFIG_AT.cooldownTime, true),
    maxRoundTrainTime: view.getBigUint64(at + CONFIG_AT.maxRoundTrainTime, true),
    roundWitnessTime: view.getBigUint64(at + CONFIG_AT.roundWitnessTime, true),
    epochTime: view.getBigUint64(at + CONFIG_AT.epochTime, true),
    totalSteps: view.getUint32(at + CONFIG_AT.totalSteps, true),
    initMinClients: view.getUint16(at + CONFIG_AT.initMinClients, true),
    minClients: view.getUint16(at + CONFIG_AT.minClients, true),
    witnessNodes: view.getUint16(at + CONFIG_AT.witnessNodes, true),
    globalBatchSizeStart: view.getUint16(at + CONFIG_AT.globalBatchSizeStart, true),
    globalBatchSizeEnd: view.getUint16(at + CONFIG_AT.globalBatchSizeEnd, true),
    verificationPercent: view.getUint8(at + CONFIG_AT.verificationPercent),
  }
}

function readEpochClients(view: DataView, base: number): EpochClient[] {
  const len = Number(
    view.getBigUint64(base + MAX_CLIENTS * SIZE.epochClient, true),
  )
  const out: EpochClient[] = []
  for (let i = 0; i < Math.min(len, MAX_CLIENTS); i += 1) {
    const at = base + i * SIZE.epochClient
    const state = view.getUint32(at + EPOCH_CLIENT_AT.state, true)
    out.push({
      signer: signer(view, at + EPOCH_CLIENT_AT.id),
      state: CLIENT_STATES[state] ?? CLIENT_STATES[0],
      exitedHeight: view.getUint32(at + EPOCH_CLIENT_AT.exitedHeight, true),
    })
  }
  return out
}

function readLedger(view: DataView): LedgerClient[] {
  const base = AT.ledgerClients
  const len = Number(
    view.getBigUint64(base + MAX_CLIENTS * SIZE.ledgerClient, true),
  )
  const out: LedgerClient[] = []
  for (let i = 0; i < Math.min(len, MAX_CLIENTS); i += 1) {
    const at = base + i * SIZE.ledgerClient
    out.push({
      signer: signer(view, at + LEDGER_CLIENT_AT.id),
      earned: view.getBigUint64(at + LEDGER_CLIENT_AT.earned, true),
      slashed: view.getBigUint64(at + LEDGER_CLIENT_AT.slashed, true),
      active: view.getBigUint64(at + LEDGER_CLIENT_AT.active, true),
    })
  }
  return out
}
