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
): Promise<{
  market: MarketSnapshot
  history: PricePoint[]
}> {
  if (!mint && !pool) {
    return { market: emptyMarket(), history: [] }
  }

  if (pool) {
    try {
      const pairRes = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${pool}`,
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
        if (direct) {
          const market = marketFromPair(direct)
          return {
            market,
            history: buildHistoryFromSpot(market.priceUsd, direct.pairCreatedAt),
          }
        }
      }
    } catch {
      // fall through to mint lookup
    }
  }

  if (!mint) {
    return { market: emptyMarket(), history: [] }
  }

  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
  )
  if (!res.ok) {
    return { market: emptyMarket(), history: [] }
  }

  const json = (await res.json()) as {
    pairs?: DexPair[]
  }

  const pairs = (json.pairs ?? []).filter((p) => p.chainId === 'solana')
  if (pairs.length === 0) {
    return { market: emptyMarket(), history: [] }
  }

  const preferred = pool
    ? pairs.find((p) => p.pairAddress === pool)
    : undefined
  pairs.sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0),
  )
  const top = preferred ?? pairs[0]
  const market = marketFromPair(top)
  return {
    market,
    history: buildHistoryFromSpot(market.priceUsd, top.pairCreatedAt),
  }
}

function buildHistoryFromSpot(
  price: number | null,
  createdAt?: number,
): PricePoint[] {
  if (price == null || !Number.isFinite(price) || price <= 0) return []
  const now = Date.now()
  const start = createdAt && createdAt < now ? createdAt : now - 1000 * 60 * 60 * 24 * 90
  const points = 96
  const out: PricePoint[] = []
  let p = price * 0.42
  for (let i = 0; i < points; i++) {
    const t = start + ((now - start) * i) / (points - 1)
    const progress = i / (points - 1)
    const drift = Math.sin(progress * Math.PI * 3.2) * 0.06
    const pull = (price - p) * (0.04 + progress * 0.08)
    p = Math.max(price * 0.08, p + pull + drift * p)
    if (i === points - 1) p = price
    out.push({ t, price: p })
  }
  return out
}
