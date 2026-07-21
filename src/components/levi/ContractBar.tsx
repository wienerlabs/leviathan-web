import { useState } from 'react'
import { motion } from 'motion/react'
import { LEVI, explorerUrl, shortAddress } from '../../data/levi'

export default function ContractBar({
  position,
}: {
  position: 'top' | 'bottom'
}) {
  const [copied, setCopied] = useState(false)
  const mint = LEVI.mint

  const copy = async () => {
    if (!mint) return
    try {
      await navigator.clipboard.writeText(mint)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[22px] border border-black bg-white px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="min-w-0">
        <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1">
          Contract address
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
          onClick={copy}
          disabled={!mint}
          className="inline-flex h-11 items-center justify-center rounded-full border border-black px-5 text-[14px] font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
        >
          {copied ? 'Copied' : 'Copy'}
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
    </motion.div>
  )
}
