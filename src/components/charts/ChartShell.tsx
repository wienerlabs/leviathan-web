import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'

export function ChartShell({
  title,
  subtitle,
  children,
  legend,
}: {
  title: string
  subtitle: string
  children: ReactNode
  legend?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[28px] border border-black overflow-hidden bg-white"
    >
      <div className="px-5 md:px-6 pt-5 md:pt-6 pb-3 border-b border-black/10">
        <p className="text-[18px] md:text-[20px] font-semibold mb-1">{title}</p>
        <p className="text-[14px] md:text-[15px] text-black/50 leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="px-2 md:px-4 pt-4 pb-2 h-[300px] md:h-[340px]">
        {inView ? children : null}
      </div>
      {legend ? (
        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1">{legend}</div>
      ) : null}
    </motion.div>
  )
}

export function ChartTooltipBox({
  label,
  rows,
}: {
  label: string
  rows: { name: string; value: string }[]
}) {
  return (
    <div className="rounded-[16px] border border-black bg-white px-3.5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <p className="text-[12px] font-medium text-black/45 mb-2">{label}</p>
      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-6 text-[13px]"
          >
            <span className="text-black/65">{row.name}</span>
            <span className="font-mono font-medium text-black">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
