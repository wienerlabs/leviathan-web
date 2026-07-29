export const LEVI = {
  symbol: 'LEVI',
  name: 'Leviathan',
  ticker: '$LEVI',
  decimals: 9,
  network: 'Solana',
  venue: 'Raydium',
  pair: 'LEVI / SOL',
  supply: '1,000,000,000',
  supplyShort: '1B',
  logo: '/logos/levi.png',
  mint:
    (import.meta.env.VITE_LEVI_MINT as string | undefined)?.trim() ||
    'LeViePUwqFYuKzA5sDXHkU2Jec1xwDn8Tdk55ecSqvv',
  pool:
    (import.meta.env.VITE_LEVI_POOL as string | undefined)?.trim() ||
    'wauDNp6gNoDayfPEUd675p9ouXYULknr3EQmSgVAMne',
  explorerBase: 'https://solscan.io/token/',
  poolExplorerBase: 'https://solscan.io/account/',
  jupiterBase: 'https://jup.ag/swap/SOL-',
  raydiumBase: 'https://raydium.io/swap/?inputMint=sol&outputMint=',
  raydiumPoolBase: 'https://raydium.io/liquidity-pools/?tab=all&pool_id=',
  dexscreenerBase: 'https://dexscreener.com/solana/',
  birdeyeBase: 'https://birdeye.so/token/',
  squads:
    (import.meta.env.VITE_LEVI_SQUADS as string | undefined)?.trim() ||
    'ALxuDYPT5BYE5jWW5zF4BK8o1KXAwPcrt7SGdUspjNNr',
  squadsAppBase: 'https://app.squads.so/squads/',
} as const

export type LeviVenue = {
  name: string
  kind: string
  href: string
  blurb: string
  logo: string
}

export function leviVenues(mint: string, pool = LEVI.pool): LeviVenue[] {
  const m = mint || 'LEVI'
  return [
    {
      name: 'Jupiter',
      kind: 'Aggregator',
      href: mint ? `${LEVI.jupiterBase}${mint}` : 'https://jup.ag',
      blurb: 'Best-route Solana swaps across venues',
      logo: '/logos/jupiter.png',
    },
    {
      name: 'Raydium',
      kind: 'AMM',
      href: mint
        ? `${LEVI.raydiumBase}${mint}`
        : 'https://raydium.io',
      blurb: pool
        ? `Primary LEVI/SOL pool · ${shortAddress(pool, 4)}`
        : 'Primary LEVI/SOL liquidity pool',
      logo: '/logos/raydium.png',
    },
    {
      name: 'Dexscreener',
      kind: 'Market data',
      href: pool
        ? `${LEVI.dexscreenerBase}${pool}`
        : mint
          ? `${LEVI.dexscreenerBase}${mint}`
          : 'https://dexscreener.com/solana',
      blurb: 'Live pair charts and volume',
      logo: '/logos/dexscreener.png',
    },
    {
      name: 'Birdeye',
      kind: 'Analytics',
      href: mint ? `${LEVI.birdeyeBase}${m}?chain=solana` : 'https://birdeye.so',
      blurb: 'Token analytics and traders',
      logo: '/logos/birdeye.png',
    },
  ]
}

export type MarketSnapshot = {
  priceUsd: number | null
  fdvUsd: number | null
  liquidityUsd: number | null
  volume24hUsd: number | null
  priceChange24h: number | null
  pairAddress: string | null
  url: string | null
  listed: boolean
}

export type PricePoint = {
  t: number
  price: number
}

export const emptyMarket = (): MarketSnapshot => ({
  priceUsd: null,
  fdvUsd: null,
  liquidityUsd: null,
  volume24hUsd: null,
  priceChange24h: null,
  pairAddress: null,
  url: null,
  listed: false,
})

export function formatUsd(value: number | null, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return 'TBA'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  if (value >= 1) return `$${value.toFixed(digits)}`
  if (value >= 0.0001) return `$${value.toFixed(6)}`
  return `$${value.toExponential(2)}`
}

/**
 * Prices below a cent are the normal case for this token, and exponential
 * notation reads as a rounding error rather than a price. Carry four
 * significant digits as plain decimals instead.
 */
export function formatPrice(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return 'TBA'
  if (value === 0) return '$0'
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  }
  if (value >= 0.01) return `$${value.toFixed(4)}`
  if (value >= 0.0001) return `$${value.toFixed(6)}`
  return `$${value.toFixed(Math.min(12, Math.ceil(-Math.log10(value)) + 3))}`
}

export function formatPct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return 'n/a'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function shortAddress(address: string, size = 4): string {
  if (!address) return 'Pending mint'
  if (address.length <= size * 2 + 3) return address
  return `${address.slice(0, size)}…${address.slice(-size)}`
}

export function explorerUrl(mint: string): string {
  if (!mint) return 'https://solscan.io'
  return `${LEVI.explorerBase}${mint}`
}

export function poolExplorerUrl(pool: string): string {
  if (!pool) return 'https://solscan.io'
  return `${LEVI.poolExplorerBase}${pool}`
}

export function squadsAppUrl(address: string = LEVI.squads): string {
  if (!address) return 'https://app.squads.so'
  return `${LEVI.squadsAppBase}${address}/home`
}

export function accountExplorerUrl(address: string): string {
  if (!address) return 'https://solscan.io'
  return `${LEVI.poolExplorerBase}${address}`
}

type DexPair = {
  chainId: string
  url: string
  pairAddress: string
  priceUsd?: string
  fdv?: number
  liquidity?: { usd?: number }
  volume?: { h24?: number }
  priceChange?: { h24?: number }
  pairCreatedAt?: number
}

function marketFromPair(top: DexPair): MarketSnapshot {
  const price = top.priceUsd ? Number(top.priceUsd) : null
  return {
    priceUsd: price != null && Number.isFinite(price) ? price : null,
    fdvUsd: top.fdv ?? null,
    liquidityUsd: top.liquidity?.usd ?? null,
    volume24hUsd: top.volume?.h24 ?? null,
    priceChange24h: top.priceChange?.h24 ?? null,
    pairAddress: top.pairAddress ?? null,
    url: top.url ?? null,
    listed: true,
  }
}

export async function fetchLeviMarket(
  mint: string,
  pool = LEVI.pool,
  signal?: AbortSignal,
): Promise<MarketSnapshot> {
  if (!mint && !pool) return emptyMarket()

  if (pool) {
    try {
      const pairRes = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${pool}`,
        { signal },
      )
      if (pairRes.ok) {
        const pairJson = (await pairRes.json()) as {
          pair?: DexPair | null
          pairs?: DexPair[]
        }
        const direct =
          pairJson.pair ??
          (pairJson.pairs ?? []).find((p) => p.pairAddress === pool) ??
          null
        if (direct) return marketFromPair(direct)
      }
    } catch {
      // fall through to mint lookup
    }
  }

  if (!mint) return emptyMarket()

  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
    { signal },
  )
  if (!res.ok) return emptyMarket()

  const json = (await res.json()) as {
    pairs?: DexPair[]
  }

  const pairs = (json.pairs ?? []).filter((p) => p.chainId === 'solana')
  if (pairs.length === 0) return emptyMarket()

  const preferred = pool
    ? pairs.find((p) => p.pairAddress === pool)
    : undefined
  pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))
  return marketFromPair(preferred ?? pairs[0])
}

export type ChartRange = 'LIVE' | '1H' | '24H' | '7D' | 'ALL'

export const CHART_RANGES: { key: ChartRange; label: string }[] = [
  { key: 'LIVE', label: 'Live' },
  { key: '1H', label: '1h' },
  { key: '24H', label: '24h' },
  { key: '7D', label: '7d' },
  { key: 'ALL', label: 'All' },
]

const RANGE_QUERY: Record<
  Exclude<ChartRange, 'LIVE'>,
  { timeframe: 'minute' | 'hour' | 'day'; aggregate: number; limit: number }
> = {
  '1H': { timeframe: 'minute', aggregate: 1, limit: 60 },
  '24H': { timeframe: 'minute', aggregate: 15, limit: 96 },
  '7D': { timeframe: 'hour', aggregate: 1, limit: 168 },
  ALL: { timeframe: 'day', aggregate: 1, limit: 365 },
}

/**
 * Real traded prices for the pool, candle by candle. There is deliberately no
 * fallback that synthesises a curve from the spot price: a chart that invents
 * its own history is worse than no chart, because a reader cannot tell the
 * difference and will price a trade on it.
 */
export async function fetchPriceHistory(
  range: ChartRange,
  pool = LEVI.pool,
  signal?: AbortSignal,
): Promise<PricePoint[]> {
  if (!pool || range === 'LIVE') return []
  const { timeframe, aggregate, limit } = RANGE_QUERY[range]
  const url = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${pool}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}`

  const response = await fetch(url, { signal })
  if (!response.ok) return []
  const json = (await response.json()) as {
    data?: { attributes?: { ohlcv_list?: number[][] } }
  }
  const candles = json.data?.attributes?.ohlcv_list ?? []

  return candles
    .map((candle) => ({ t: candle[0] * 1000, price: candle[4] }))
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.t - b.t)
}
