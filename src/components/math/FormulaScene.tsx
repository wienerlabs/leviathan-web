import { motion, useInView } from 'motion/react'
import { useRef, useState, useEffect, type ReactNode } from 'react'
import { MathTex } from './Math'

export type FormulaStep = {
  label: string
  tex: string
  note?: string
}

export function FormulaScene({
  index,
  title,
  lead,
  steps,
  footer,
}: {
  index: string
  title: string
  lead: string
  steps: FormulaStep[]
  footer?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView) return
    setStep(0)
    if (steps.length <= 1) return
    const timers: number[] = []
    for (let i = 1; i < steps.length; i++) {
      timers.push(
        window.setTimeout(() => setStep(i), i * 1100),
      )
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [inView, steps.length])

  const active = steps[Math.min(step, steps.length - 1)]

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[32px] border border-black bg-white overflow-hidden"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10">
        <p className="text-[13px] tracking-[0.1em] text-black/40 mb-2">
          {index}
        </p>
        <h3 className="text-[26px] md:text-[34px] leading-[1.12] font-normal">
          {title}
        </h3>
        <p className="mt-2 text-[16px] md:text-[17px] leading-relaxed text-black/55 max-w-[560px]">
          {lead}
        </p>
      </div>

      <div className="px-6 md:px-8 py-8 md:py-10 min-h-[220px] md:min-h-[260px] flex flex-col justify-center">
        <div className="flex flex-wrap gap-2 mb-6">
          {steps.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStep(i)}
              className={[
                'h-9 px-3.5 rounded-full border text-[13px] transition-colors',
                i <= step
                  ? i === step
                    ? 'border-black bg-black text-white'
                    : 'border-black bg-white text-black'
                  : 'border-black/15 text-black/30',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-black/[0.02] px-5 md:px-8 py-8 md:py-10">
          <motion.div
            key={active.tex}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-[22px] md:text-[34px] leading-relaxed"
          >
            <MathTex tex={active.tex} display />
          </motion.div>

          {active.note ? (
            <motion.p
              key={active.note}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-5 text-center text-[14px] md:text-[15px] text-black/50 max-w-[520px] mx-auto leading-relaxed"
            >
              {active.note}
            </motion.p>
          ) : null}

          <div className="mt-6 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  i === step ? 'w-6 bg-black' : 'w-1.5 bg-black/20',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>

      {footer ? (
        <div className="px-6 md:px-8 pb-6 md:pb-7 border-t border-black/10 pt-5">
          {footer}
        </div>
      ) : null}
    </motion.article>
  )
}
