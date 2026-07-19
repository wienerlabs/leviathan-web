import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MathTex } from './Math'

const WORKERS = 16
const MALICIOUS = new Set([0, 1, 2, 3, 4])
const CATCH = [12, 20, 1, 5, 11]
const MAX_ROUND = 22
const TICK_MS = 280
const HOLD_MS = 1400

export default function AuditVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.25 })
  const [round, setRound] = useState(0)

  useEffect(() => {
    if (!inView) return
    let r = 0
    let timer = 0

    const tick = () => {
      r += 1
      if (r > MAX_ROUND) {
        timer = window.setTimeout(() => {
          r = 0
          setRound(0)
          timer = window.setTimeout(tick, TICK_MS)
        }, HOLD_MS)
        return
      }
      setRound(r)
      timer = window.setTimeout(tick, TICK_MS)
    }

    setRound(0)
    timer = window.setTimeout(tick, TICK_MS)
    return () => window.clearTimeout(timer)
  }, [inView])

  const caught = CATCH.map((c, i) => ({ id: i, round: c, done: round >= c }))
  const mean = CATCH.reduce((a, b) => a + b, 0) / CATCH.length

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[32px] border border-black overflow-hidden bg-white"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
        <div className="text-right">
          <p className="text-[13px] text-black/40 mb-1">round</p>
          <p className="text-[32px] tabular-nums leading-none">{round}</p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-8 gap-2 md:gap-2.5 mb-8">
          {Array.from({ length: WORKERS }, (_, i) => {
            const bad = MALICIOUS.has(i)
            const hit = bad && CATCH[i] != null && round >= CATCH[i]
            return (
              <motion.div
                key={`${i}-${hit}`}
                animate={{
                  scale: hit ? 1 : 1,
                  backgroundColor: hit
                    ? '#000000'
                    : bad
                      ? 'rgba(0,0,0,0.12)'
                      : '#ffffff',
                  color: hit ? '#ffffff' : '#000000',
                }}
                transition={{ duration: 0.3 }}
                className="aspect-square rounded-[12px] border border-black flex items-center justify-center text-[12px] md:text-[13px] tabular-nums"
              >
                {bad ? `M${i + 1}` : `H${i + 1}`}
              </motion.div>
            )
          })}
        </div>

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
            <p className="text-[22px] tabular-nums">
              {mean.toFixed(1)} rounds
              <span className="text-black/40 text-[14px] ml-2">
                ({caught.filter((c) => c.done).length}/5 caught)
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
