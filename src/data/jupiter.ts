import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js'

export const JUPITER_API = 'https://lite-api.jup.ag/swap/v1'
export const SOL_MINT = 'So11111111111111111111111111111111111111112'
export const SOL_DECIMALS = 9
export const TOKEN_2022_PROGRAM = new PublicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
)
export const TOKEN_PROGRAM = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
)

export type RouteStep = {
  label: string
  ammKey: string
}

export type Quote = {
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  priceImpactPct: string
  slippageBps: number
  routePlan: { swapInfo: { label?: string; ammKey: string } }[]
}

export type QuoteView = {
  raw: Quote
  outAmount: number
  minimumReceived: number
  priceImpactPct: number
  route: RouteStep[]
}

export function toBaseUnits(amount: number, decimals: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '0'
  return BigInt(Math.round(amount * 10 ** decimals)).toString()
}

export function fromBaseUnits(amount: string | number, decimals: number): number {
  const value = typeof amount === 'string' ? Number(amount) : amount
  if (!Number.isFinite(value)) return 0
  return value / 10 ** decimals
}

export async function fetchQuote(params: {
  inputMint: string
  outputMint: string
  amount: number
  inputDecimals: number
  outputDecimals: number
  slippageBps: number
  signal?: AbortSignal
}): Promise<QuoteView> {
  const amount = toBaseUnits(params.amount, params.inputDecimals)
  if (amount === '0') throw new Error('Enter an amount to see a quote')

  const url = new URL(`${JUPITER_API}/quote`)
  url.searchParams.set('inputMint', params.inputMint)
  url.searchParams.set('outputMint', params.outputMint)
  url.searchParams.set('amount', amount)
  url.searchParams.set('slippageBps', String(params.slippageBps))

  const response = await fetch(url, { signal: params.signal })
  if (!response.ok) {
    throw new Error(
      response.status === 400
        ? 'No route for this pair right now'
        : `Quote failed with ${response.status}`,
    )
  }
  const raw = (await response.json()) as Quote
  if (!raw.outAmount) throw new Error('No route for this pair right now')

  return {
    raw,
    outAmount: fromBaseUnits(raw.outAmount, params.outputDecimals),
    minimumReceived: fromBaseUnits(
      raw.otherAmountThreshold,
      params.outputDecimals,
    ),
    priceImpactPct: Number(raw.priceImpactPct) * 100,
    route: raw.routePlan.map((step) => ({
      label: step.swapInfo.label || 'Direct pool',
      ammKey: step.swapInfo.ammKey,
    })),
  }
}

export async function fetchSwapTransaction(params: {
  quote: Quote
  userPublicKey: string
}): Promise<VersionedTransaction> {
  const response = await fetch(`${JUPITER_API}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: params.quote,
      userPublicKey: params.userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      dynamicSlippage: false,
      prioritizationFeeLamports: { priorityLevelWithMaxLamports: { priorityLevel: 'high', maxLamports: 4000000 } },
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      detail.includes('insufficient')
        ? 'Not enough balance to cover this swap and its fees'
        : `Could not build the swap transaction (${response.status})`,
    )
  }

  const { swapTransaction } = (await response.json()) as {
    swapTransaction: string
  }
  if (!swapTransaction) throw new Error('Jupiter returned no transaction')

  const bytes = Uint8Array.from(atob(swapTransaction), (c) => c.charCodeAt(0))
  return VersionedTransaction.deserialize(bytes)
}

export async function fetchSolBalance(
  connection: Connection,
  owner: PublicKey,
): Promise<number> {
  const lamports = await connection.getBalance(owner, 'confirmed')
  return lamports / 10 ** SOL_DECIMALS
}

export async function fetchTokenBalance(
  connection: Connection,
  owner: PublicKey,
  mint: string,
): Promise<number> {
  const mintKey = new PublicKey(mint)
  for (const programId of [TOKEN_2022_PROGRAM, TOKEN_PROGRAM]) {
    const accounts = await connection.getParsedTokenAccountsByOwner(
      owner,
      { mint: mintKey, programId },
      'confirmed',
    )
    const total = accounts.value.reduce((sum, account) => {
      const parsed = account.account.data.parsed?.info?.tokenAmount
      return sum + (parsed?.uiAmount ?? 0)
    }, 0)
    if (accounts.value.length > 0) return total
  }
  return 0
}
