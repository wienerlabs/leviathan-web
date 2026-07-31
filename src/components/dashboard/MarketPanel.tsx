import { motion } from 'motion/react'
import { formatPrice, formatUsd, type MarketSnapshot } from '../../data/levi'
import { DOWN_COLOR, UP_COLOR } from '../levi/LeviChart'

export default function MarketPanel({
  market,
  loading,
}: {
  market: MarketSnapshot | null
  loading: boolean
}) {
  const day = market?.priceChange24h ?? null
  const tone = day == null ? undefined : day >= 0 ? UP_COLOR : DOWN_COLOR

  // Liquidity against fully diluted value is the number that decides whether a
  // sell can actually be absorbed. It is more honest than either figure alone.
  const depth =
    market?.liquidityUsd && market?.fdvUsd
      ? (market.liquidityUsd / market.fdvUsd) * 100
      : null

  const cells: { label: string; value: string; tone?: string }[] = [
    { label: 'Price', value: formatPrice(market?.priceUsd ?? null), tone },
    { label: 'Fully diluted', value: formatUsd(market?.fdvUsd ?? null) },
    { label: 'Liquidity', value: formatUsd(market?.liquidityUsd ?? null) },
    { label: '24h volume', value: formatUsd(market?.volume24hUsd ?? null) },
    {
      label: 'Liquidity to value',
      value: depth == null ? 'n/a' : `${depth.toFixed(1)}%`,
    },
    {
      label: '24h change',
      value: day == null ? 'n/a' : `${day >= 0 ? '+' : ''}${day.toFixed(2)}%`,
      tone,
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="mb-8 rounded-[24px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10">
        <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
          Market
        </p>
        <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
          What the token is doing
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-black/[0.07]">
        {cells.map((cell) => (
          <div key={cell.label} className="px-5 sm:px-6 py-4">
            <p className="text-[12px] text-black/40 mb-1.5">{cell.label}</p>
            <p
              className="text-[20px] sm:text-[24px] tabular-nums tracking-tight leading-none truncate"
              style={cell.tone ? { color: cell.tone } : undefined}
            >
              {loading && !market ? (
                <span className="inline-block h-6 w-20 rounded bg-black/[0.06] animate-pulse" />
              ) : (
                cell.value
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-black/10 px-5 sm:px-6 py-4">
        <p className="text-[13px] text-black/50 leading-relaxed">
          Liquidity to value is the pool depth measured against the fully diluted
          value. A low ratio means a small sell moves the price a long way, which
          matters more than either number on its own.
        </p>
      </div>
    </motion.section>
  )
}
