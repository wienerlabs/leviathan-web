import { useState } from 'react'
import { motion } from 'motion/react'
import {
  TEAM_VEST,
  streamflowContractUrl,
  vestExplorerUrl,
} from '../../data/tokenomics'
import { shortAddress } from '../../data/levi'

export default function TeamVest() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(address)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[28px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-2">
            Team allocation
          </p>
          <h2 className="font-italiana text-[32px] sm:text-[40px] leading-[1.08]">
            250M $LEVI locked on Streamflow
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] text-black/55 max-w-[640px]">
            {TEAM_VEST.summary}
          </p>
        </div>
        <div className="rounded-[18px] border border-black px-4 py-3 shrink-0">
          <p className="text-[12px] text-black/40">Team share</p>
          <p className="text-[22px] leading-none mt-1 font-medium">
            {TEAM_VEST.shareOfSupply}%
          </p>
          <p className="mt-1 text-[12px] text-black/45">{TEAM_VEST.schedule}</p>
          <p className="mt-2 text-[12px] text-black/45">
            {TEAM_VEST.streams.length} live streams
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="grid sm:grid-cols-3 gap-3 content-start">
          {[
            {
              t: 'Trustless',
              d: 'No admin key can free the tokens early. Unlock is the contract schedule.',
            },
            {
              t: 'Transparent',
              d: 'Anyone can open the Streamflow stream and verify remaining locked balance.',
            },
            {
              t: 'On-chain',
              d: 'Vesting lives on Solana. Explorer and Streamflow both read the same account.',
            },
          ].map((c, i) => (
            <div
              key={c.t}
              className="rounded-[18px] border border-black/12 px-4 py-4"
            >
              <p className="text-[11px] font-mono text-black/40 mb-2">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-[16px] font-medium mb-1.5">{c.t}</p>
              <p className="text-[13px] sm:text-[14px] text-black/50 leading-snug">
                {c.d}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {TEAM_VEST.streams.map((s) => (
            <div
              key={s.address}
              className="rounded-[20px] border border-black px-4 sm:px-5 py-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[12px] tracking-[0.07em] text-black/40 mb-1">
                    {s.label}
                    {s.amountLabel ? ` · ${s.amountLabel} LEVI` : ''}
                  </p>
                  <p className="font-mono text-[13px] sm:text-[14px] tracking-tight break-all">
                    {s.address}
                  </p>
                  <p className="mt-1 text-[13px] text-black/45">
                    Streamflow · {shortAddress(s.address, 6)}
                  </p>
                </div>
                <span
                  className={[
                    'inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium shrink-0',
                    s.status === 'live'
                      ? 'bg-black text-white'
                      : 'border border-black/20 text-black/50',
                  ].join(' ')}
                >
                  {s.status === 'live' ? 'Live' : 'Pending'}
                </span>
              </div>

              {s.amountLabel || s.unlockCadence || s.unlockPerPeriodLabel || s.nextUnlockLabel ? (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {s.amountLabel ? (
                    <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
                      <p className="text-[11px] text-black/40 mb-0.5">Total</p>
                      <p className="text-[14px] font-medium tabular-nums">
                        {s.amountLabel} LEVI
                      </p>
                    </div>
                  ) : null}
                  {s.unlockCadence ? (
                    <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
                      <p className="text-[11px] text-black/40 mb-0.5">Unlock rate</p>
                      <p className="text-[14px] font-medium">{s.unlockCadence}</p>
                    </div>
                  ) : null}
                  {s.unlockPerPeriodLabel ? (
                    <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
                      <p className="text-[11px] text-black/40 mb-0.5">Per period</p>
                      <p className="text-[14px] font-medium">{s.unlockPerPeriodLabel}</p>
                    </div>
                  ) : null}
                  {s.nextUnlockLabel ? (
                    <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
                      <p className="text-[11px] text-black/40 mb-0.5">Next unlock</p>
                      <p className="text-[14px] font-medium">{s.nextUnlockLabel}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(s.address)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-black px-4 text-[13px] font-medium hover:bg-black hover:text-white transition-colors"
                >
                  {copied === s.address ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={streamflowContractUrl(s.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-[13px] font-medium text-white hover:bg-black/80 transition-colors"
                >
                  Open Streamflow
                </a>
                <a
                  href={vestExplorerUrl(s.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-black/20 px-4 text-[13px] font-medium hover:border-black transition-colors"
                >
                  Explorer
                </a>
              </div>
            </div>
          ))}
          <p className="text-[13px] text-black/45 leading-relaxed px-1">
            Team allocation is {TEAM_VEST.amountLabel} $LEVI (
            {TEAM_VEST.shareOfSupply}% of supply) across Streamflow contracts.
            Stream 2 is 100M with monthly unlock (~4.1666M / month).
          </p>
        </div>
      </div>
    </motion.section>
  )
}
