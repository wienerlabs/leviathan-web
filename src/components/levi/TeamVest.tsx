import { useState } from 'react'
import { motion } from 'motion/react'
import {
  SUPPLY_LOCKS,
  streamflowContractUrl,
  vestExplorerUrl,
  type VestStream,
} from '../../data/tokenomics'
import { shortAddress } from '../../data/levi'

function StreamCard({
  stream,
  copied,
  onCopy,
}: {
  stream: VestStream
  copied: string | null
  onCopy: (address: string) => void
}) {
  return (
    <div className="rounded-[20px] border border-black px-4 sm:px-5 py-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.07em] text-black/40 mb-1">
            {stream.label} · {stream.amountLabel} LEVI ({stream.shareOfSupply}%)
          </p>
          <p className="font-mono text-[13px] sm:text-[14px] tracking-tight break-all">
            {stream.address}
          </p>
          <p className="mt-1 text-[13px] text-black/45">
            Streamflow · {shortAddress(stream.address, 6)}
            {stream.immutable ? ' · immutable' : ''}
          </p>
        </div>
        <span
          className={[
            'inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium shrink-0',
            stream.status === 'live'
              ? 'bg-black text-white'
              : 'border border-black/20 text-black/50',
          ].join(' ')}
        >
          {stream.status === 'live' ? 'Live' : 'Pending'}
        </span>
      </div>

      <p className="text-[14px] text-black/60 leading-relaxed mb-3">
        {stream.schedule}
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {stream.unlockCadence ? (
          <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
            <p className="text-[11px] text-black/40 mb-0.5">Unlock rate</p>
            <p className="text-[14px] font-medium">{stream.unlockCadence}</p>
          </div>
        ) : null}
        {stream.unlockPerPeriodLabel ? (
          <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
            <p className="text-[11px] text-black/40 mb-0.5">Per period</p>
            <p className="text-[14px] font-medium">{stream.unlockPerPeriodLabel}</p>
          </div>
        ) : null}
        {stream.nextUnlockLabel ? (
          <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
            <p className="text-[11px] text-black/40 mb-0.5">Next unlock</p>
            <p className="text-[14px] font-medium">{stream.nextUnlockLabel}</p>
          </div>
        ) : null}
        <div className="rounded-[14px] border border-black/10 px-3 py-2.5">
          <p className="text-[11px] text-black/40 mb-0.5">Recipient</p>
          <p className="text-[13px] font-medium leading-snug">
            {stream.recipientLabel}
          </p>
          {stream.recipientAddress ? (
            <p className="mt-1 font-mono text-[11px] text-black/45 break-all">
              {shortAddress(stream.recipientAddress, 4)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCopy(stream.address)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-black px-4 text-[13px] font-medium hover:bg-black hover:text-white transition-colors"
        >
          {copied === stream.address ? 'Copied' : 'Copy'}
        </button>
        <a
          href={streamflowContractUrl(stream.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-[13px] font-medium text-white hover:bg-black/80 transition-colors"
        >
          Open Streamflow
        </a>
        <a
          href={vestExplorerUrl(stream.address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full border border-black/20 px-4 text-[13px] font-medium hover:border-black transition-colors"
        >
          Explorer
        </a>
      </div>
    </div>
  )
}

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

  const team = SUPPLY_LOCKS.streams.filter((s) => s.category === 'team')
  const ecosystem = SUPPLY_LOCKS.streams.filter((s) => s.category === 'ecosystem')

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[28px] border border-black bg-white overflow-hidden"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-2">
            On-chain locks
          </p>
          <h2 className="font-italiana text-[32px] sm:text-[40px] leading-[1.08]">
            350M $LEVI locked on Streamflow
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] text-black/55 max-w-[640px]">
            {SUPPLY_LOCKS.summary} Team is 250M (25%). Ecosystem is 100M (10%)
            paid to the treasury multisig, not a personal wallet.
          </p>
        </div>
        <div className="rounded-[18px] border border-black px-4 py-3 shrink-0">
          <p className="text-[12px] text-black/40">Locked now</p>
          <p className="text-[22px] leading-none mt-1 font-medium">350M</p>
          <p className="mt-1 text-[12px] text-black/45">
            2 immutable streams
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-8">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              t: 'Trustless',
              d: 'Streams are immutable and non-cancellable, including by the team.',
            },
            {
              t: 'Transparent',
              d: 'Anyone can open Streamflow or the explorer and verify remaining balance.',
            },
            {
              t: 'On-chain',
              d: 'Schedules live on Solana. Website copy follows the contracts, not the other way around.',
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

        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-3">
            Team · 25%
          </p>
          <div className="space-y-3">
            {team.map((s) => (
              <StreamCard
                key={s.address}
                stream={s}
                copied={copied}
                onCopy={copy}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-3">
            Ecosystem and grants · 10%
          </p>
          <div className="space-y-3">
            {ecosystem.map((s) => (
              <StreamCard
                key={s.address}
                stream={s}
                copied={copied}
                onCopy={copy}
              />
            ))}
          </div>
        </div>

        <p className="text-[13px] text-black/45 leading-relaxed">
          Liquidity is a separate Raydium pool balance, not a Streamflow lock.
          The LP position is not locked. Training, audit and community rows
          remain treasury policy until they get their own contracts.
        </p>
      </div>
    </motion.section>
  )
}
