import { useEffect, useRef, useState } from 'react'
import {
  emptyMarket,
  fetchLeviMarket,
  fetchPriceHistory,
  LEVI,
  type ChartRange,
  type MarketSnapshot,
  type PricePoint,
} from './levi'

const SPOT_POLL_MS = 3000
const HISTORY_POLL_MS = 60000
const MAX_LIVE_POINTS = 600

export type Direction = 'up' | 'down' | 'flat'

export type LiveMarket = {
  market: MarketSnapshot
  history: PricePoint[]
  live: PricePoint[]
  direction: Direction
  rangeChangePct: number | null
  loading: boolean
  stale: boolean
  lastUpdated: number | null
}

/**
 * Spot price is polled on a short interval and appended to a live tail, while
 * the candle history behind it is refreshed more slowly. The two are kept
 * separate so the chart can show what actually traded and what is happening
 * right now without blurring the line between them.
 */
export function useLeviLive(range: ChartRange): LiveMarket {
  const [market, setMarket] = useState<MarketSnapshot>(emptyMarket())
  const [history, setHistory] = useState<PricePoint[]>([])
  const [live, setLive] = useState<PricePoint[]>([])
  const [direction, setDirection] = useState<Direction>('flat')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const previousPrice = useRef<number | null>(null)

  useEffect(() => {
    if (!LEVI.pool && !LEVI.mint) {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const readSpot = async () => {
      try {
        const next = await fetchLeviMarket(LEVI.mint, LEVI.pool, controller.signal)
        if (controller.signal.aborted) return
        setMarket(next)
        setLastUpdated(Date.now())

        const price = next.priceUsd
        if (price == null || !Number.isFinite(price)) return

        const previous = previousPrice.current
        if (previous != null) {
          const delta = price - previous
          const threshold = previous * 1e-9
          // A poll that does not move the price leaves the last direction in
          // place. Resetting to flat would blink the colour off between trades,
          // which reads as a bug rather than as calm.
          if (delta > threshold) setDirection('up')
          else if (delta < -threshold) setDirection('down')
        }
        previousPrice.current = price

        setLive((points) => {
          const appended = [...points, { t: Date.now(), price }]
          return appended.length > MAX_LIVE_POINTS
            ? appended.slice(appended.length - MAX_LIVE_POINTS)
            : appended
        })
      } catch {
        // a dropped poll is not worth surfacing, the next one is 3 seconds away
      }
    }

    readSpot().finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    const timer = window.setInterval(readSpot, SPOT_POLL_MS)

    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const readHistory = async () => {
      try {
        const candles = await fetchPriceHistory(range, LEVI.pool, controller.signal)
        if (!cancelled) setHistory(candles)
      } catch {
        // keep whatever candles are already on screen
      }
    }

    readHistory()
    const timer = window.setInterval(readHistory, HISTORY_POLL_MS)

    return () => {
      cancelled = true
      controller.abort()
      window.clearInterval(timer)
    }
  }, [range])

  useEffect(() => {
    setLive([])
  }, [range])

  const series = live.length > 0 ? live : history
  const first = series[0]?.price
  const last = series[series.length - 1]?.price
  const rangeChangePct =
    first != null && last != null && first > 0
      ? ((last - first) / first) * 100
      : null

  return {
    market,
    history,
    live,
    direction,
    rangeChangePct,
    loading,
    stale: lastUpdated != null && Date.now() - lastUpdated > SPOT_POLL_MS * 5,
    lastUpdated,
  }
}
