import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const NONE = '·'

export function shortAddress(value: string, edge = 4): string {
  return value.length > edge * 2 + 2
    ? `${value.slice(0, edge)}…${value.slice(-edge)}`
    : value
}

export function explorerUrl(
  address: string,
  cluster: 'devnet' | 'mainnet' = 'devnet',
): string {
  return `https://solscan.io/account/${address}${cluster === 'devnet' ? '?cluster=devnet' : ''}`
}

export function formatCount(value: number | bigint): string {
  return value.toLocaleString('en-US')
}

export function formatDuration(seconds: number | bigint): string {
  const total = Number(seconds)
  if (!Number.isFinite(total) || total <= 0) return 'off'
  if (total < 60) return `${total}s`
  if (total < 3600) return `${Math.round(total / 60)}m`
  if (total < 86400) return `${(total / 3600).toFixed(1)}h`
  return `${(total / 86400).toFixed(1)}d`
}

export function Panel({
  eyebrow,
  title,
  badge,
  children,
  footer,
  className = '',
}: {
  eyebrow: string
  title: string
  badge?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className={`mb-8 rounded-[24px] border border-black bg-white overflow-hidden ${className}`}
    >
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.08em] text-black/40 mb-1.5">
            {eyebrow}
          </p>
          <h2 className="text-[24px] sm:text-[28px] leading-tight tracking-tight font-normal">
            {title}
          </h2>
        </div>
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>
      {children}
      {footer ? (
        <div className="border-t border-black/10 px-5 sm:px-6 py-4 text-[13px] text-black/50 leading-relaxed">
          {footer}
        </div>
      ) : null}
    </motion.section>
  )
}

export function Badge({
  tone = 'quiet',
  children,
}: {
  tone?: 'solid' | 'quiet'
  children: ReactNode
}) {
  return (
    <span
      className={[
        'inline-flex h-8 items-center rounded-full px-3 text-[13px] shrink-0',
        tone === 'solid'
          ? 'bg-black text-white'
          : 'border border-black/20 text-black/60',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export function Tile({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <div className="rounded-[20px] border border-black/12 bg-white px-5 py-5 flex flex-col gap-1.5 min-h-[112px]">
      <span className="text-[13px] text-black/45">{label}</span>
      <span className="text-[28px] sm:text-[32px] tabular-nums tracking-tight leading-none text-black break-all">
        {value}
      </span>
      {note ? (
        <span className="text-[12px] text-black/40 leading-snug">{note}</span>
      ) : null}
    </div>
  )
}

export function MiniStat({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <div className="rounded-[16px] border border-black/10 bg-black/[0.02] px-3.5 py-3">
      <p className="text-[12px] text-black/40 mb-1">{label}</p>
      <p className="text-[19px] tabular-nums tracking-tight break-all">{value}</p>
      {note ? <p className="text-[11px] text-black/35 mt-1">{note}</p> : null}
    </div>
  )
}

export function AddressLink({
  address,
  cluster = 'devnet',
  edge = 4,
}: {
  address: string
  cluster?: 'devnet' | 'mainnet'
  edge?: number
}) {
  return (
    <a
      href={explorerUrl(address, cluster)}
      target="_blank"
      rel="noreferrer"
      title={address}
      className="font-mono text-[13px] text-black/55 underline underline-offset-2 decoration-black/20 hover:text-black hover:no-underline"
    >
      {shortAddress(address, edge)}
    </a>
  )
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 sm:px-6 py-10 text-center text-[15px] text-black/45">
      {children}
    </div>
  )
}

export function Meter({
  value,
  max,
  label,
}: {
  value: number
  max: number
  label?: string
}) {
  const share = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div>
      <div className="h-1.5 w-full rounded-full bg-black/[0.08] overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-[width] duration-500"
          style={{ width: `${share}%` }}
        />
      </div>
      {label ? (
        <p className="mt-1.5 text-[12px] text-black/40 tabular-nums">{label}</p>
      ) : null}
    </div>
  )
}
