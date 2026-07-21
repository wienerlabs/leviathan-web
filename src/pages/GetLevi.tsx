import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import SiteHeader from '../components/SiteHeader'
import ContractBar from '../components/levi/ContractBar'
import MarketCards from '../components/levi/MarketCards'
import LeviSwap from '../components/levi/LeviSwap'
import LeviChart from '../components/levi/LeviChart'
import LeviStake from '../components/levi/LeviStake'
import TradeVenues from '../components/levi/TradeVenues'
import {
  emptyMarket,
  fetchLeviMarket,
  LEVI,
  type MarketSnapshot,
  type PricePoint,
} from '../data/levi'

const META = [
  { label: 'Network', value: LEVI.network },
  { label: 'Venue', value: LEVI.venue },
  { label: 'Pair', value: LEVI.pair },
  { label: 'Supply', value: LEVI.supply },
] as const

export default function GetLevi() {
  const [market, setMarket] = useState<MarketSnapshot>(emptyMarket())
  const [history, setHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(Boolean(LEVI.mint))

  useEffect(() => {
    let cancelled = false
    if (!LEVI.mint) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetchLeviMarket(LEVI.mint)
      .then(({ market: m, history: h }) => {
        if (cancelled) return
        setMarket(m)
        setHistory(h)
      })
      .catch(() => {
        if (cancelled) return
        setMarket(emptyMarket())
        setHistory([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen bg-white text-black font-manrope overflow-x-clip max-w-[100vw]">
      <SiteHeader variant="sticky" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8 py-8 sm:py-10 md:py-14 space-y-6 md:space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 lg:gap-10 items-center"
        >
          <div className="order-2 lg:order-1">
            <p className="text-[13px] tracking-[0.1em] text-black/40 mb-3">
              Leviathan network token
            </p>
            <h1 className="font-italiana text-[42px] sm:text-[56px] md:text-[68px] leading-[1.02] tracking-tight">
              Get $LEVI
            </h1>
            <p className="mt-3 sm:mt-4 text-[16px] sm:text-[18px] md:text-[20px] leading-relaxed text-black/60 max-w-[36rem]">
              Buy, chart, stake and discover markets for $LEVI, the token that
              pays for accepted learning work and secures the swarm.
            </p>
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
              <span className="inline-flex h-10 items-center rounded-full border border-black px-4 text-[14px] font-medium">
                {LEVI.symbol}
              </span>
              <span className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/60">
                {LEVI.network}
              </span>
              <span className="inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-[14px] text-black/60">
                Supply {LEVI.supplyShort}
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="absolute -inset-3 sm:-inset-4 rounded-[32px] border border-black/10 pointer-events-none" />
            <div className="relative overflow-hidden rounded-[26px] sm:rounded-[30px] border border-black bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
              <img
                src="/leviathan-block.jpg"
                alt="Leviathan block"
                className="block w-full h-auto object-cover aspect-[4/5] sm:aspect-square max-h-[420px] sm:max-h-[480px] mx-auto"
                width={1254}
                height={1254}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </motion.section>

        <ContractBar position="top" />

        <MarketCards market={market} loading={loading} />

        <div className="grid lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
          <LeviSwap />
          <div className="flex flex-col gap-3 md:gap-4 min-h-0">
            <div className="flex-1 min-h-[340px]">
              <LeviChart history={history} loading={loading} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
            >
              {META.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-black/15 px-3.5 py-3"
                >
                  <p className="text-[11px] sm:text-[12px] tracking-[0.07em] text-black/40 mb-1">
                    {item.label}
                  </p>
                  <p className="text-[14px] sm:text-[15px] font-medium truncate">
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <LeviStake />
        <TradeVenues />
        <ContractBar position="bottom" />
      </div>
    </main>
  )
}
