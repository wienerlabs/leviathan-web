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
  mint: (import.meta.env.VITE_LEVI_MINT as string | undefined)?.trim() || '',
  explorerBase: 'https://solscan.io/token/',
  jupiterBase: 'https://jup.ag/swap/SOL-',
  raydiumBase: 'https://raydium.io/swap/?inputMint=sol&outputMint=',
  dexscreenerBase: 'https://dexscreener.com/solana/',
  birdeyeBase: 'https://birdeye.so/token/',
} as const

export type LeviVenue = {
  name: string
  kind: string
  href: string
  blurb: string
  logo: string
}

export function leviVenues(mint: string): LeviVenue[] {
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
      href: mint ? `${LEVI.raydiumBase}${mint}` : 'https://raydium.io',
      blurb: 'Primary concentrated liquidity pool',
      logo: '/logos/raydium.png',
    },
    {
      name: 'Dexscreener',
      kind: 'Market data',
      href: mint ? `${LEVI.dexscreenerBase}${mint}` : 'https://dexscreener.com/solana',
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

export async function fetchLeviMarket(mint: string): Promise<{
  market: MarketSnapshot
  history: PricePoint[]
}> {
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
    pairs?: Array<{
      chainId: string
      url: string
      pairAddress: string
      priceUsd?: string
      fdv?: number
      liquidity?: { usd?: number }
      volume?: { h24?: number }
      priceChange?: { h24?: number }
      pairCreatedAt?: number
    }>
  }

  const pairs = (json.pairs ?? []).filter((p) => p.chainId === 'solana')
  if (pairs.length === 0) {
    return { market: emptyMarket(), history: [] }
  }

  pairs.sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0),
  )
  const top = pairs[0]
  const price = top.priceUsd ? Number(top.priceUsd) : null
  const market: MarketSnapshot = {
    priceUsd: price != null && Number.isFinite(price) ? price : null,
    fdvUsd: top.fdv ?? null,
    liquidityUsd: top.liquidity?.usd ?? null,
    volume24hUsd: top.volume?.h24 ?? null,
    priceChange24h: top.priceChange?.h24 ?? null,
    pairAddress: top.pairAddress ?? null,
    url: top.url ?? null,
    listed: true,
  }

  const history = buildHistoryFromSpot(market.priceUsd, top.pairCreatedAt)
  return { market, history }
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
