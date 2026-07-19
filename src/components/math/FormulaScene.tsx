import { motion, useInView } from 'motion/react'
import { useRef, useState, useEffect, type ReactNode } from 'react'
import { MathTex } from './Math'

export type FormulaStep = {
  label: string
  tex: string
  note?: string
}

const STEP_MS = 2200

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
  const inView = useInView(ref, { amount: 0.25 })
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (!inView || steps.length <= 1 || manual) return
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % steps.length)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [inView, steps.length, manual])

  useEffect(() => {
    if (!manual) return
    const id = window.setTimeout(() => setManual(false), STEP_MS * 2.5)
    return () => window.clearTimeout(id)
  }, [manual, step])

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
              onClick={() => {
                setStep(i)
                setManual(true)
              }}
              className={[
                'h-9 px-3.5 rounded-full border text-[13px] transition-colors',
                i === step
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 text-black/55 hover:border-black',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-black/[0.02] px-5 md:px-8 py-8 md:py-10">
          <motion.div
            key={active.tex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-[22px] md:text-[34px] leading-relaxed"
          >
            <MathTex tex={active.tex} display />
          </motion.div>

          {active.note ? (
            <motion.p
              key={active.note}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.35 }}
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
