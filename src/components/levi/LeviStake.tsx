import { useMemo, useState } from 'react'
import { motion } from 'motion/react'

const TERMS = [
  { id: 'flex', label: 'Flexible', days: 0, apr: 8 },
  { id: '90', label: '90 days', days: 90, apr: 14 },
  { id: '180', label: '180 days', days: 180, apr: 22 },
] as const

export default function LeviStake() {
  const [amount, setAmount] = useState('')
  const [term, setTerm] = useState<(typeof TERMS)[number]['id']>('90')
  const selected = TERMS.find((t) => t.id === term) ?? TERMS[1]

  const projected = useMemo(() => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return null
    const yearFrac = selected.days > 0 ? selected.days / 365 : 30 / 365
    return n * (selected.apr / 100) * yearFrac
  }, [amount, selected])

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
            Stake
          </p>
          <h2 className="font-italiana text-[32px] sm:text-[40px] leading-[1.08]">
            Stake $LEVI
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] text-black/55 max-w-[520px]">
            Lock LEVI to back network security and earn protocol rewards when
            staking ships with mainnet economics.
          </p>
        </div>
        <div className="rounded-[18px] border border-black/15 px-4 py-3">
          <p className="text-[12px] text-black/40">Selected apr</p>
          <p className="text-[28px] tabular-nums leading-none mt-1">
            {selected.apr}%
          </p>
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

          <div className="grid grid-cols-3 gap-2">
            {TERMS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTerm(t.id)}
                className={[
                  'rounded-[18px] border px-3 py-3 text-left transition-colors',
                  term === t.id
                    ? 'border-black bg-black text-white'
                    : 'border-black/15 hover:border-black',
                ].join(' ')}
              >
                <p className="text-[14px] font-medium">{t.label}</p>
                <p
                  className={[
                    'text-[13px] mt-1',
                    term === t.id ? 'text-white/70' : 'text-black/45',
                  ].join(' ')}
                >
                  {t.apr}% apr
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled
            className="w-full h-12 sm:h-14 rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium opacity-45 cursor-not-allowed"
          >
            Staking opens with mainnet
          </button>
        </div>

        <div className="rounded-[22px] border border-black/15 bg-black/[0.02] px-5 py-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Term</span>
            <span className="text-[15px] font-medium">{selected.label}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Projected yield</span>
            <span className="text-[15px] tabular-nums font-medium">
              {projected == null ? '0.00 LEVI' : `${projected.toFixed(2)} LEVI`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] text-black/50">Status</span>
            <span className="text-[15px] font-medium">Awaiting TGE</span>
          </div>
          <p className="text-[13px] text-black/50 leading-relaxed pt-2 border-t border-black/10">
            APR figures are design targets for the post-TGE staking module, not
            a live yield promise. No tokens are locked from this page yet.
          </p>
        </div>
      </div>
    </motion.section>
  )
}
