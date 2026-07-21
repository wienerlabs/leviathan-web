import { useState } from 'react'
import { motion } from 'motion/react'

const LOCK_OPTIONS = [
  {
    id: 'flexible',
    label: 'Flexible',
    detail: 'Withdraw after the challenge window',
  },
  {
    id: 'epoch',
    label: 'Epoch-bound',
    detail: 'Stays locked through the current epoch',
  },
  {
    id: 'run',
    label: 'Run-bound',
    detail: 'Released when the training run finishes',
  },
] as const

export default function LeviStake() {
  const [amount, setAmount] = useState('')
  const [lock, setLock] = useState<(typeof LOCK_OPTIONS)[number]['id']>('epoch')
  const selected = LOCK_OPTIONS.find((t) => t.id === lock) ?? LOCK_OPTIONS[1]

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[28px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-2">
            Bond lock
          </p>
          <h2 className="font-italiana text-[32px] sm:text-[40px] leading-[1.08]">
            Lock $LEVI
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] text-black/55 max-w-[560px]">
            Post-TGE, LEVI can be locked as economic security for runs and
            disputes. This is a bond surface, not a yield product. No APR, APY
            or guaranteed returns.
          </p>
        </div>
        <div className="rounded-[18px] border border-black/15 px-4 py-3">
          <p className="text-[12px] text-black/40">Status</p>
          <p className="text-[22px] leading-none mt-1 font-medium">Coming soon</p>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-[20px] border border-black/15 px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-black/45">Amount</span>
              <span className="text-[13px] text-black/45">LEVI</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-transparent text-[30px] tabular-nums tracking-tight outline-none placeholder:text-black/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {LOCK_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setLock(t.id)}
                className={[
                  'rounded-[18px] border px-3 py-3 text-left transition-colors',
                  lock === t.id
                    ? 'border-black bg-black text-white'
                    : 'border-black/15 hover:border-black',
                ].join(' ')}
              >
                <p className="text-[14px] font-medium">{t.label}</p>
                <p
                  className={[
                    'text-[13px] mt-1 leading-snug',
                    lock === t.id ? 'text-white/70' : 'text-black/45',
                  ].join(' ')}
                >
                  {t.detail}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled
            className="w-full h-12 sm:h-14 rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium opacity-45 cursor-not-allowed"
          >
            Lock opens with mainnet
          </button>
        </div>

        <div className="rounded-[22px] border border-black/15 bg-black/[0.02] px-5 py-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Lock style</span>
            <span className="text-[15px] font-medium text-right">{selected.label}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Purpose</span>
            <span className="text-[15px] font-medium text-right">
              Economic security
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Returns marketing</span>
            <span className="text-[15px] font-medium text-right">None</span>
          </div>
          <p className="text-[13px] text-black/50 leading-relaxed pt-2 border-t border-black/10">
            Leviathan does not advertise APR, APY or guaranteed returns. Any
            future lock product will be sized for bond and dispute security,
            consistent with the legal briefing and tokenomics docs.
          </p>
        </div>
      </div>
    </motion.section>
  )
}
