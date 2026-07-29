import { useState } from 'react'
import { motion } from 'motion/react'
import {
  LEVI,
  explorerUrl,
  poolExplorerUrl,
  shortAddress,
} from '../../data/levi'

export default function ContractBar({
  position,
}: {
  position: 'top' | 'bottom'
}) {
  const [copied, setCopied] = useState<'mint' | 'pool' | null>(null)
  const mint = LEVI.mint
  const pool = LEVI.pool

  const copy = async (value: string, kind: 'mint' | 'pool') => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[22px] border border-black bg-white overflow-hidden"
    >
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
            Mint address
          </p>
          <p className="font-mono text-[14px] sm:text-[16px] tracking-tight truncate">
            {mint ? mint : 'Mint pending · set VITE_LEVI_MINT when live'}
          </p>
          <p className="text-[13px] text-black/45 mt-1">
            Solana · {mint ? shortAddress(mint, 6) : 'TBA'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => copy(mint, 'mint')}
            disabled={!mint}
            className="inline-flex h-11 items-center justify-center rounded-full border border-black px-5 text-[14px] font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            {copied === 'mint' ? 'Copied' : 'Copy'}
          </button>
          <a
            href={explorerUrl(mint)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-[14px] font-medium text-white hover:bg-black/80 transition-colors"
          >
            Explorer
          </a>
        </div>
      </div>

      {pool ? (
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/[0.015]">
          <div className="min-w-0">
            <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
              Raydium pool
            </p>
            <p className="font-mono text-[14px] sm:text-[16px] tracking-tight truncate">
              {pool}
            </p>
            <p className="text-[13px] text-black/45 mt-1">
              LEVI / SOL · {shortAddress(pool, 6)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => copy(pool, 'pool')}
              className="inline-flex h-11 items-center justify-center rounded-full border border-black px-5 text-[14px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              {copied === 'pool' ? 'Copied' : 'Copy'}
            </button>
            <a
              href={poolExplorerUrl(pool)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black px-5 text-[14px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              Explorer
            </a>
            <a
              href={`${LEVI.raydiumBase}${mint}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-[14px] font-medium text-white hover:bg-black/80 transition-colors"
            >
              Trade
            </a>
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
