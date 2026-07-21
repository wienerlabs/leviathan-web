import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { LEVI } from '../../data/levi'

function TokenBadge({
  symbol,
  logo,
}: {
  symbol: string
  logo: string
}) {
  return (
    <span className="shrink-0 inline-flex items-center gap-2 rounded-full border border-black px-2.5 py-1.5 text-[14px] font-medium bg-white">
      <img
        src={logo}
        alt=""
        className="h-5 w-5 object-contain"
        width={20}
        height={20}
        decoding="async"
      />
      {symbol}
    </span>
  )
}

export default function LeviSwap() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const mint = LEVI.mint

  const href = useMemo(() => {
    if (!mint) return 'https://jup.ag'
    if (side === 'buy') return `${LEVI.jupiterBase}${mint}`
    return `https://jup.ag/swap/${mint}-SOL`
  }, [mint, side])

  const pay = side === 'buy'
    ? { symbol: 'SOL', logo: '/logos/solana.png' }
    : { symbol: 'LEVI', logo: '/mascot.png' }
  const receive = side === 'buy'
    ? { symbol: 'LEVI', logo: '/mascot.png' }
    : { symbol: 'SOL', logo: '/logos/solana.png' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-[28px] border border-black bg-white overflow-hidden flex flex-col"
    >
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-black/10 flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">Swap</p>
          <h3 className="text-[22px] sm:text-[26px] leading-tight font-normal">
            Get $LEVI
          </h3>
        </div>
        <div className="inline-flex rounded-full border border-black p-1">
          {(['buy', 'sell'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={[
                'h-9 px-4 rounded-full text-[14px] font-medium transition-colors capitalize',
                side === s
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 sm:px-6 py-5 flex flex-col gap-4">
        <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-black/45">You pay</span>
            <span className="text-[13px] text-black/45">{pay.symbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-transparent text-[28px] sm:text-[32px] tabular-nums tracking-tight outline-none placeholder:text-black/20"
            />
            <TokenBadge symbol={pay.symbol} logo={pay.logo} />
          </div>
        </div>

        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={() => setSide((s) => (s === 'buy' ? 'sell' : 'buy'))}
            className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center text-[18px] hover:bg-black hover:text-white transition-colors"
            aria-label="Flip swap direction"
          >
            ↓
          </button>
        </div>

        <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-black/45">You receive</span>
            <span className="text-[13px] text-black/45">{receive.symbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="w-full text-[28px] sm:text-[32px] tabular-nums tracking-tight text-black/35">
              0.0
            </p>
            <TokenBadge symbol={receive.symbol} logo={receive.logo} />
          </div>
        </div>

        <p className="text-[13px] text-black/50 leading-relaxed">
          Routes through Jupiter for best Solana execution. Wallet connects on
          the swap venue; this page never holds your keys.
        </p>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium hover:bg-black/80 transition-colors"
        >
          {side === 'buy' ? (
            <>
              <img
                src="/logos/solana.png"
                alt=""
                className="h-5 w-5 object-contain"
                width={20}
                height={20}
              />
              <span>Swap SOL for $LEVI</span>
            </>
          ) : (
            <>
              <img
                src="/mascot.png"
                alt=""
                className="h-5 w-5 object-contain"
                width={20}
                height={20}
              />
              <span>Swap $LEVI for SOL</span>
            </>
          )}
        </a>
      </div>
    </motion.div>
  )
}
