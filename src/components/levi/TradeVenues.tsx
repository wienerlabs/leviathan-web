import { motion } from 'motion/react'
import { LEVI, leviVenues } from '../../data/levi'

export default function TradeVenues() {
  const venues = leviVenues(LEVI.mint)

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[28px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-black/10">
        <p className="text-[12px] tracking-[0.08em] text-black/40 mb-2">
          Markets
        </p>
        <h2 className="font-italiana text-[32px] sm:text-[40px] leading-[1.08]">
          Where to trade $LEVI
        </h2>
        <p className="mt-2 text-[15px] sm:text-[17px] text-black/55 max-w-[560px]">
          Official venues and market data surfaces for $LEVI on Solana.
        </p>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 grid sm:grid-cols-2 gap-3 md:gap-4">
        {venues.map((v, i) => (
          <motion.a
            key={v.name}
            href={v.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.45 }}
            className="group rounded-[22px] border border-black/15 hover:border-black px-5 py-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-black/10 bg-black/[0.02] p-2.5">
                  <img
                    src={v.logo}
                    alt=""
                    className="h-full w-full object-contain"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] tracking-[0.07em] text-black/40 mb-1">
                    {v.kind}
                  </p>
                  <p className="text-[22px] leading-tight">{v.name}</p>
                </div>
              </div>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black text-[16px] group-hover:bg-black group-hover:text-white transition-colors">
                →
              </span>
            </div>
            <p className="mt-3 text-[14px] sm:text-[15px] text-black/55 leading-relaxed">
              {v.blurb}
            </p>
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}
