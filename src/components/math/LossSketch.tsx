import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { MathTex } from './Math'
import { lossChartData } from '../../data/phase0'

function pathFrom(key: 'honest' | 'signflipMean', w: number, h: number) {
  const pad = 12
  const xs = lossChartData.map((d) => d.round)
  const ys = lossChartData.map((d) => d[key])
  const minX = 1
  const maxX = 30
  const minY = 2
  const maxY = 12
  const pts = xs.map((x, i) => {
    const px = pad + ((x - minX) / (maxX - minX)) * (w - pad * 2)
    const py =
      pad + (1 - (ys[i] - minY) / (maxY - minY)) * (h - pad * 2)
    return `${px},${py}`
  })
  return `M ${pts.join(' L ')}`
}

export default function LossSketch() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const w = 560
  const h = 220

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[32px] border border-black overflow-hidden bg-white"
    >
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-black/10">
        <p className="text-[13px] tracking-[0.1em] text-black/40 mb-2">
          Scene 00 · Intuition
        </p>
        <h3 className="text-[26px] md:text-[34px] leading-[1.12]">
          When trust fails, loss leaves the page
        </h3>
        <p className="mt-2 text-[16px] text-black/55 max-w-[560px] leading-relaxed">
          Honest training settles. Naive aggregation under a sign-flip attack
          diverges. The gap is the cost of unverified gradients.
        </p>
      </div>

      <div className="px-4 md:px-8 py-6 md:py-8">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-auto"
          role="img"
          aria-label="Loss sketch honest vs sign flip"
        >
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1="12"
              x2={w - 12}
              y1={12 + t * (h - 24)}
              y2={12 + t * (h - 24)}
              stroke="#000"
              strokeOpacity="0.06"
              strokeDasharray="3 6"
            />
          ))}

          <motion.path
            d={pathFrom('signflipMean', w, h)}
            fill="none"
            stroke="#000"
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeDasharray="3 5"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
          <motion.path
            d={pathFrom('honest', w, h)}
            fill="none"
            stroke="#000"
            strokeWidth="2.75"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.15 }}
          />

          <text
            x={w - 16}
            y={28}
            textAnchor="end"
            fontSize="12"
            fill="rgba(0,0,0,0.4)"
            fontFamily="KaTeX_Main, serif"
          >
            attack mean → 12
          </text>
          <text
            x={w - 16}
            y={h - 20}
            textAnchor="end"
            fontSize="12"
            fill="rgba(0,0,0,0.55)"
            fontFamily="KaTeX_Main, serif"
          >
            honest → 2.17
          </text>
        </svg>

        <div className="mt-4 flex flex-wrap gap-4 text-[14px] text-black/55">
          <span className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-black" /> Honest mean
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-black/30 border-t border-dashed border-black" />{' '}
            Sign-flip vs mean
          </span>
          <span>
            Final gap ≈ <MathTex tex="12.0 - 2.17" className="text-[14px]" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}
