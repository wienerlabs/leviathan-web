import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { LEVI } from '../../data/levi'

export default function LeviSwap() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const mint = LEVI.mint

  const href = useMemo(() => {
    if (!mint) return 'https://jup.ag'
    if (side === 'buy') return `${LEVI.jupiterBase}${mint}`
    return `https://jup.ag/swap/${mint}-SOL`
  }, [mint, side])

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
            <span className="text-[13px] text-black/45">
              {side === 'buy' ? 'SOL' : 'LEVI'}
            </span>
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
            <span className="shrink-0 rounded-full border border-black px-3 py-1.5 text-[14px] font-medium">
              {side === 'buy' ? 'SOL' : 'LEVI'}
            </span>
          </div>
        </div>

        <div className="flex justify-center -my-1">
          <div className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center text-[18px]">
            ↓
          </div>
        </div>

        <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-black/45">You receive</span>
            <span className="text-[13px] text-black/45">
              {side === 'buy' ? 'LEVI' : 'SOL'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="w-full text-[28px] sm:text-[32px] tabular-nums tracking-tight text-black/35">
              0.0
            </p>
            <span className="shrink-0 rounded-full border border-black px-3 py-1.5 text-[14px] font-medium">
              {side === 'buy' ? 'LEVI' : 'SOL'}
            </span>
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
          className="mt-auto inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium hover:bg-black/80 transition-colors"
        >
          {mint
            ? side === 'buy'
              ? 'Swap SOL for $LEVI'
              : 'Swap $LEVI for SOL'
            : 'Open Jupiter (mint pending)'}
        </a>
      </div>
    </motion.div>
  )
}
