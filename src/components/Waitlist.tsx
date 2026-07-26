import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import XLogo from './XLogo'

const PERKS = [
  {
    title: 'Early access',
    body: 'First in line when one-line join and the public swarm open.',
  },
  {
    title: 'Verified only',
    body: 'One real X account, one spot. No bots, no burner sybils.',
  },
  {
    title: 'Role routing',
    body: 'We match you to GPU, verifier, supply, or builder tracks.',
  },
]

// Home-page teaser for the waitlist. The real verify + signup flow lives on the
// dedicated /waitlist page (X OAuth needs a full-page redirect round-trip).
export default function Waitlist() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/waitlist/count', { headers: { accept: 'application/json' } })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setCount(Number(d?.count) || 0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="waitlist"
      className="border-t border-black/10 px-4 sm:px-5 md:px-12 py-16 sm:py-20 md:py-28 scroll-mt-8"
    >
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 sm:gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            <p className="text-[14px] sm:text-[15px] md:text-[17px] text-black/50 font-medium mb-5 sm:mb-6 tracking-[0.06em]">
              Waitlist
            </p>
            <h2 className="font-italiana text-[30px] sm:text-[38px] md:text-[64px] leading-[1.08] mb-5 sm:mb-6">
              Be early for the Genesis Run
            </h2>
            <p className="text-[16px] sm:text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[520px] mb-8">
              Phase 1 trust and training are live on Solana devnet. Phase 2 opens
              the public swarm. Verify with X to claim your spot — one real
              account, one place in line.
            </p>

            <div className="flex flex-wrap gap-3">
              {count > 0 ? (
                <div className="rounded-full border border-black px-4 py-2 text-[14px]">
                  <span className="font-medium tabular-nums">
                    {count.toLocaleString('en-US')}
                  </span>
                  <span className="text-black/45"> verified so far</span>
                </div>
              ) : null}
              <div className="rounded-full border border-black/20 px-4 py-2 text-[14px] text-black/55">
                Phase 2 · public swarm
              </div>
              <a
                href="https://x.com/leviathanfront"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/20 px-4 py-2 text-[14px] text-black/55 hover:border-black hover:text-black transition-colors"
              >
                @leviathanfront
              </a>
            </div>
          </div>

          <div className="rounded-[24px] sm:rounded-[32px] border border-black p-5 sm:p-6 md:p-8 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.04)] min-w-0">
            <p className="text-[13px] tracking-[0.1em] text-black/40 mb-3">
              Verify with X · takes seconds
            </p>
            <h3 className="text-[24px] md:text-[30px] leading-[1.12] mb-4">
              Claim your spot in line
            </h3>
            <p className="text-[15px] md:text-[17px] leading-relaxed text-black/60 mb-6">
              We confirm one real X account per spot, so the list stays honest.
              We never post for you and only read your public profile.
            </p>

            <div className="space-y-3 mb-8">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="rounded-[18px] border border-black/15 px-4 py-3"
                >
                  <p className="text-[15px] md:text-[16px] font-semibold mb-0.5">
                    {String(i + 1).padStart(2, '0')} · {perk.title}
                  </p>
                  <p className="text-[14px] md:text-[15px] text-black/60 leading-relaxed">
                    {perk.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link
              to="/waitlist"
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-black text-white text-[16px] md:text-[17px] font-medium hover:bg-black/80 transition-colors"
            >
              <XLogo className="h-4 w-4" />
              Verify with X to join
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
