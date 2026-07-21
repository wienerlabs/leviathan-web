import { motion } from 'motion/react'
import {
  formatPct,
  formatUsd,
  type MarketSnapshot,
} from '../../data/levi'

const cards = [
  { key: 'price', label: 'Levi price', hint: 'USD spot' },
  { key: 'fdv', label: 'Fdv', hint: 'Fully diluted' },
  { key: 'liquidity', label: 'Liquidity', hint: 'Pool depth' },
  { key: 'volume', label: '24h volume', hint: 'Last day' },
] as const

function valueFor(
  key: (typeof cards)[number]['key'],
  market: MarketSnapshot,
): string {
  switch (key) {
    case 'price':
      return formatUsd(market.priceUsd, 6)
    case 'fdv':
      return formatUsd(market.fdvUsd)
    case 'liquidity':
      return formatUsd(market.liquidityUsd)
    case 'volume':
      return formatUsd(market.volume24hUsd)
  }
}

export default function MarketCards({
  market,
  loading,
}: {
  market: MarketSnapshot
  loading: boolean
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.05 * i,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="rounded-[24px] border border-black bg-white px-4 sm:px-5 py-4 sm:py-5"
        >
          <p className="text-[12px] sm:text-[13px] tracking-[0.07em] text-black/40 mb-2">
            {card.label}
          </p>
          <p className="text-[24px] sm:text-[28px] md:text-[32px] tabular-nums tracking-tight leading-none">
            {loading ? (
              <span className="inline-block h-8 w-24 rounded-md bg-black/[0.06] animate-pulse" />
            ) : (
              valueFor(card.key, market)
            )}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-[13px] text-black/45">{card.hint}</p>
            {card.key === 'price' && market.priceChange24h != null ? (
              <span
                className={[
                  'text-[13px] tabular-nums',
                  market.priceChange24h >= 0 ? 'text-black' : 'text-black/50',
                ].join(' ')}
              >
                {formatPct(market.priceChange24h)}
              </span>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
