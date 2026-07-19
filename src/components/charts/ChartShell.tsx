import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'

export function ChartShell({
  eyebrow,
  title,
  subtitle,
  meta,
  children,
  footer,
  heightClass = 'h-[340px] md:h-[400px]',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: ReactNode
  children: ReactNode
  footer?: ReactNode
  heightClass?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.28 })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[32px] border border-black bg-white overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10">
        <div className="max-w-[640px]">
          {eyebrow ? (
            <p className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] text-black/40 mb-2">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="font-italiana text-[28px] md:text-[36px] leading-[1.05] tracking-tight">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-[15px] md:text-[16px] leading-relaxed text-black/55">
              {subtitle}
            </p>
          ) : null}
        </div>
        {meta ? <div className="md:pt-1 md:text-right shrink-0">{meta}</div> : null}
      </div>

      <div className={`px-3 md:px-5 pt-5 pb-3 ${heightClass}`}>
        {inView ? children : (
          <div className="h-full w-full rounded-[20px] bg-black/[0.03] animate-pulse" />
        )}
      </div>

      {footer ? (
        <div className="px-6 md:px-8 pb-6 md:pb-7 pt-2 border-t border-black/8">
          {footer}
        </div>
      ) : null}
    </motion.section>
  )
}

export function ChartTooltipBox({
  label,
  rows,
  footer,
}: {
  label: string
  rows: { name: string; value: string; muted?: boolean; swatch?: string }[]
  footer?: string
}) {
  return (
    <div className="min-w-[200px] rounded-[18px] border border-black bg-white/95 backdrop-blur-sm px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
      <p className="text-[11px] font-medium tracking-[0.12em] text-black/40 mb-2.5">
        {label}
      </p>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-8 text-[13px]"
          >
            <span className="inline-flex items-center gap-2 text-black/65">
              {row.swatch ? (
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-black/80"
                  style={{ background: row.swatch }}
                />
              ) : null}
              {row.name}
            </span>
            <span
              className={[
                'font-mono tabular-nums font-medium',
                row.muted ? 'text-black/40' : 'text-black',
              ].join(' ')}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {footer ? (
        <p className="mt-3 pt-2.5 border-t border-black/10 text-[11px] text-black/40 leading-snug">
          {footer}
        </p>
      ) : null}
    </div>
  )
}

export function MetricPill({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-3 min-w-[140px]">
      <p className="text-[11px] tracking-[0.1em] text-black/40 mb-1">{label}</p>
      <p className="text-[22px] md:text-[24px] font-semibold font-mono tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="text-[12px] text-black/45 mt-0.5 leading-snug">{hint}</p>
      ) : null}
    </div>
  )
}
