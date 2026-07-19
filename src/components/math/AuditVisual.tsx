import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathTex } from './Math'

const WORKERS = 16
const MALICIOUS = new Set([0, 1, 2, 3, 4])
const CATCH = [12, 20, 1, 5, 11]
const MAX_ROUND = 22
const TICK_MS = 320
const HOLD_MS = 1600
const THEORY = 10
const EASE = [0.16, 1, 0.3, 1] as const

function RoundCounter({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const display = useTransform(mv, (v) => Math.round(v).toString())

  useEffect(() => {
    const c = animate(mv, value, { duration: 0.22, ease: 'easeOut' })
    return () => c.stop()
  }, [value, mv])

  return <motion.span className="tabular-nums">{display}</motion.span>
}

export default function AuditVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.25 })
  const [round, setRound] = useState(0)
  const [flash, setFlash] = useState<number | null>(null)
  const [events, setEvents] = useState<string[]>([])
  const prevCaught = useRef(0)

  useEffect(() => {
    if (!inView) return
    let r = 0
    let timer = 0
    setEvents([])
    prevCaught.current = 0

    const tick = () => {
      r += 1
      if (r > MAX_ROUND) {
        timer = window.setTimeout(() => {
          r = 0
          setRound(0)
          setFlash(null)
          setEvents([])
          prevCaught.current = 0
          timer = window.setTimeout(tick, TICK_MS)
        }, HOLD_MS)
        return
      }
      setRound(r)

      const newly = CATCH.filter((c) => c === r)
      if (newly.length) {
        const idx = CATCH.indexOf(r)
        setFlash(idx)
        setEvents((e) =>
          [`M${idx + 1} convicted at r${r}`, ...e].slice(0, 4),
        )
        window.setTimeout(() => setFlash(null), 500)
      }

      timer = window.setTimeout(tick, TICK_MS)
    }

    setRound(0)
    timer = window.setTimeout(tick, TICK_MS)
    return () => window.clearTimeout(timer)
  }, [inView])

  const caughtCount = useMemo(
    () => CATCH.filter((c) => round >= c).length,
    [round],
  )
  const mean = CATCH.reduce((a, b) => a + b, 0) / CATCH.length
  const progress = Math.min(1, round / MAX_ROUND)
  const theoryProgress = THEORY / MAX_ROUND

  useEffect(() => {
    if (caughtCount > prevCaught.current) prevCaught.current = caughtCount
  }, [caughtCount])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, ease: EASE }}
      className="rounded-[32px] border border-black overflow-hidden bg-white"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className="text-[13px] tracking-[0.1em] text-black/40 mb-2">
            Scene 03 · Audit lottery
          </p>
          <h3 className="text-[26px] md:text-[34px] leading-[1.12]">
            Spot-check until conviction
          </h3>
          <p className="mt-2 text-[16px] text-black/55 max-w-[520px] leading-relaxed">
            Each contribution is audited with probability{' '}
            <MathTex tex="p" className="text-[16px]" />. Expected catch time is{' '}
            <MathTex tex="1/p" className="text-[16px]" />.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative h-[72px] w-[72px]">
            <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="4"
              />
              <motion.circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 30}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 30 * (1 - progress),
                }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="rgba(0,0,0,0.18)"
                strokeWidth="1.5"
                strokeDasharray="2 6"
                strokeDashoffset={2 * Math.PI * 30 * (1 - theoryProgress)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-black/40 tracking-wide">r</span>
              <span className="text-[22px] leading-none">
                <RoundCounter value={round} />
              </span>
            </div>
          </div>
          <div>
            <p className="text-[12px] text-black/40 mb-1">caught</p>
            <p className="text-[28px] tabular-nums leading-none">
              {caughtCount}
              <span className="text-black/30 text-[18px]">/5</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-8">
        <div className="relative mb-3 h-8">
          <div className="absolute inset-x-0 top-1/2 h-px bg-black/10" />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-black border-2 border-white shadow-[0_0_0_1px_#000]"
            animate={{ left: `${(round / MAX_ROUND) * 100}%` }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{ x: '-50%' }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-black/25"
            style={{ left: `${(THEORY / MAX_ROUND) * 100}%` }}
          >
            <span className="absolute -top-0.5 left-2 text-[11px] text-black/40 whitespace-nowrap">
              E[1/p]=10
            </span>
          </div>
        </div>

        <div className="relative mb-8">
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-[18%] bg-gradient-to-r from-transparent via-black/[0.04] to-transparent"
            animate={{
              left: [`-18%`, `100%`],
            }}
            transition={{
              duration: TICK_MS / 1000,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{ display: inView ? 'block' : 'none' }}
          />

          <div className="grid grid-cols-8 gap-2 md:gap-2.5">
            {Array.from({ length: WORKERS }, (_, i) => {
              const bad = MALICIOUS.has(i)
              const catchRound = bad ? CATCH[i] : null
              const hit = catchRound != null && round >= catchRound
              const pending = bad && !hit
              const justCaught = flash === i

              return (
                <motion.div
                  key={i}
                  layout
                  animate={{
                    backgroundColor: hit
                      ? '#000000'
                      : pending
                        ? 'rgba(0,0,0,0.1)'
                        : '#ffffff',
                    color: hit ? '#ffffff' : '#000000',
                    scale: justCaught ? [1, 1.12, 1] : 1,
                    boxShadow: justCaught
                      ? '0 0 0 3px rgba(0,0,0,0.2)'
                      : '0 0 0 0px rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative aspect-square rounded-[14px] border border-black flex flex-col items-center justify-center text-[11px] md:text-[13px] tabular-nums overflow-hidden"
                >
                  {pending ? (
                    <motion.span
                      className="absolute inset-0 bg-black/[0.06]"
                      animate={{ opacity: [0.2, 0.55, 0.2] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ) : null}
                  <span className="relative z-[1] font-medium">
                    {bad ? `M${i + 1}` : `H${i + 1}`}
                  </span>
                  {hit && catchRound != null ? (
                    <span className="relative z-[1] text-[10px] opacity-70 mt-0.5">
                      r{catchRound}
                    </span>
                  ) : null}
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_220px] gap-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-[20px] border border-black/15 px-4 py-3">
              <p className="text-[12px] text-black/40 mb-1">Audit rate</p>
              <div className="text-[22px]">
                <MathTex tex="p = 0.1" />
              </div>
            </div>
            <div className="rounded-[20px] border border-black/15 px-4 py-3">
              <p className="text-[12px] text-black/40 mb-1">Theory</p>
              <div className="text-[22px]">
                <MathTex tex="\mathbb{E}[T]=1/p=10" />
              </div>
            </div>
            <div className="rounded-[20px] border border-black/15 px-4 py-3">
              <p className="text-[12px] text-black/40 mb-1">Observed mean</p>
              <p className="text-[22px] tabular-nums">{mean.toFixed(1)} rounds</p>
            </div>
          </div>

          <div className="rounded-[20px] border border-black/15 px-4 py-3 min-h-[108px]">
            <p className="text-[12px] text-black/40 mb-2">Event log</p>
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {events.length === 0 ? (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[13px] text-black/30"
                  >
                    Scanning contributions…
                  </motion.p>
                ) : (
                  events.map((e) => (
                    <motion.p
                      key={e}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] text-black/70"
                    >
                      {e}
                    </motion.p>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
