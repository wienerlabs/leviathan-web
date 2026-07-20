import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'motion/react'
import { useRef, useState, useEffect, type ReactNode } from 'react'
import { MathTex } from './Math'

export type FormulaStep = {
  label: string
  tex: string
  note?: string
}

const STEP_MS = 2800
const EASE = [0.16, 1, 0.3, 1] as const

function ProgressBar({ active, duration }: { active: boolean; duration: number }) {
  const progress = useMotionValue(0)
  const width = useTransform(progress, (v) => `${v * 100}%`)

  useEffect(() => {
    if (!active) {
      progress.set(0)
      return
    }
    progress.set(0)
    const controls = animate(progress, 1, {
      duration: duration / 1000,
      ease: 'linear',
    })
    return () => controls.stop()
  }, [active, duration, progress])

  return (
    <div className="h-[2px] w-full bg-black/10 overflow-hidden rounded-full">
      <motion.div className="h-full bg-black origin-left" style={{ width }} />
    </div>
  )
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
  const inView = useInView(ref, { amount: 0.28 })
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!inView || steps.length <= 1 || manual) return
    const id = window.setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % steps.length
        if (next === 0) setCycle((c) => c + 1)
        return next
      })
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [inView, steps.length, manual])

  useEffect(() => {
    if (!manual) return
    const id = window.setTimeout(() => setManual(false), STEP_MS * 2)
    return () => window.clearTimeout(id)
  }, [manual, step])

  const active = steps[Math.min(step, steps.length - 1)]
  const history = steps.slice(0, step)

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, ease: EASE }}
      className="rounded-[32px] border border-black bg-white overflow-hidden"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10">
        <div className="flex items-start justify-between gap-4">
          <div>
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
          <div className="shrink-0 text-right pt-1">
            <p className="text-[12px] text-black/35 tracking-[0.08em] mb-1">
              step
            </p>
            <p className="text-[28px] md:text-[32px] tabular-nums leading-none">
              <span className="text-black">{String(step + 1).padStart(2, '0')}</span>
              <span className="text-black/25">
                /{String(steps.length).padStart(2, '0')}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-5">
          <ProgressBar
            key={`${step}-${cycle}-${manual}`}
            active={inView && !manual}
            duration={STEP_MS}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] min-h-0 md:min-h-[360px]">
        <div className="border-b md:border-b-0 md:border-r border-black/10 px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-8 overflow-x-auto">
          <ol className="flex md:block gap-2 md:gap-0 md:space-y-1 min-w-0">
            {steps.map((s, i) => {
              const state =
                i === step ? 'active' : i < step ? 'done' : 'todo'
              return (
                <li key={s.label} className="shrink-0 md:shrink md:w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(i)
                      setManual(true)
                    }}
                    className={[
                      'w-full text-left rounded-[16px] px-3 py-2.5 transition-colors whitespace-nowrap md:whitespace-normal',
                      state === 'active'
                        ? 'bg-black text-white'
                        : state === 'done'
                          ? 'bg-black/[0.04] text-black hover:bg-black/[0.07]'
                          : 'text-black/35 hover:text-black/55',
                    ].join(' ')}
                  >
                    <span className="block text-[11px] tracking-[0.1em] opacity-60 mb-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="block text-[13px] sm:text-[14px] md:text-[15px]">
                      {s.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="relative px-4 sm:px-5 md:px-10 py-6 sm:py-8 md:py-10 flex flex-col justify-center overflow-hidden min-w-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-[1] space-y-3 mb-6 min-h-[72px]">
            <AnimatePresence initial={false}>
              {history.map((s, i) => (
                <motion.div
                  key={`${s.tex}-hist-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 0.28, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="text-[15px] md:text-[18px] text-center md:text-left scale-[0.92] origin-left"
                >
                  <MathTex tex={s.tex} display />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="relative z-[1] rounded-[28px] border border-black bg-white px-5 md:px-8 py-8 md:py-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.tex}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-center text-[18px] sm:text-[24px] md:text-[38px] leading-relaxed overflow-x-auto"
              >
                <MathTex tex={active.tex} display />
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="mx-auto mt-6 h-px bg-black/15"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              key={`line-${active.tex}`}
              transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
              style={{ originX: 0.5, maxWidth: 280 }}
            />

            <AnimatePresence mode="wait">
              {active.note ? (
                <motion.p
                  key={active.note}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
                  className="mt-5 text-center text-[14px] md:text-[16px] text-black/50 max-w-[520px] mx-auto leading-relaxed"
                >
                  {active.note}
                </motion.p>
              ) : null}
            </AnimatePresence>
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
