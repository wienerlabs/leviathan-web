import { useEffect, useRef, useState } from 'react'
import SiteHeader from './SiteHeader'

const FRAME_COUNT = 145
const FRAME_MAX = FRAME_COUNT - 1
const WHEEL_SENSITIVITY = 14
const LERP = 0.22
const SNAP_EPS = 0.03

function frameSrc(index: number) {
  return `/frames/frame-${String(index + 1).padStart(3, '0')}.jpg`
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function normalizeWheelDelta(e: WheelEvent) {
  let dy = e.deltaY
  if (e.deltaMode === 1) dy *= 18
  if (e.deltaMode === 2) dy *= window.innerHeight * 0.85
  const abs = Math.abs(dy)
  if (abs > 28 && abs < 90) {
    dy *= 1.65
  } else if (abs >= 90) {
    const sign = dy < 0 ? -1 : 1
    dy = sign * Math.min(abs * 1.35, 160)
  }
  return dy
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const unlockedRef = useRef(false)
  const touchYRef = useRef<number | null>(null)
  const rafRef = useRef(0)
  const drawnRef = useRef(-1)
  const heroRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const frames: HTMLImageElement[] = []
    let done = 0

    const drawFrame = (value: number, force = false) => {
      const index = clamp(Math.round(value), 0, FRAME_MAX)
      unlockedRef.current = value >= FRAME_MAX - 0.001

      const bar = progressBarRef.current
      if (bar) {
        bar.style.width = `${(value / FRAME_MAX) * 100}%`
      }

      const canvas = canvasRef.current
      if (!canvas || frames.length === 0) return false
      if (!force && index === drawnRef.current) return true

      const img = frames[index]
      if (!img || !img.complete || img.naturalWidth === 0) return false

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return false

      if (
        canvas.width !== img.naturalWidth ||
        canvas.height !== img.naturalHeight
      ) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
      }

      ctx.drawImage(img, 0, 0)
      drawnRef.current = index
      return true
    }

    const mark = (index: number) => {
      done += 1
      if (cancelled) return
      setLoaded(done)
      if (index === 0 && drawFrame(0, true)) {
        setReady(true)
      }
      if (done >= FRAME_COUNT) setReady(true)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => mark(i)
      img.onerror = () => mark(i)
      img.src = frameSrc(i)
      frames.push(img)
    }

    framesRef.current = frames

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const target = targetRef.current
      let current = currentRef.current
      const delta = target - current

      if (Math.abs(delta) < SNAP_EPS) {
        current = target
        currentRef.current = current
        if (drawnRef.current < 0 || current !== drawnRef.current) {
          drawFrame(current, drawnRef.current < 0)
        }
        return
      }

      current += delta * LERP
      currentRef.current = current
      drawFrame(current)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const nudgeTarget = (deltaFrames: number) => {
      targetRef.current = clamp(
        targetRef.current + deltaFrames,
        0,
        FRAME_MAX,
      )
    }

    const heroStillPinned = () => {
      const hero = heroRef.current
      if (!hero) return true
      return hero.getBoundingClientRect().bottom > window.innerHeight * 0.5
    }

    const onWheel = (e: WheelEvent) => {
      const atLast = targetRef.current >= FRAME_MAX - 0.001
      const atFirst = targetRef.current <= 0.001
      const dy = normalizeWheelDelta(e)
      const scrollingDown = dy > 0
      const scrollingUp = dy < 0
      const step = dy / WHEEL_SENSITIVITY

      if (scrollingDown && !atLast) {
        e.preventDefault()
        nudgeTarget(step)
        return
      }

      if (
        scrollingUp &&
        unlockedRef.current &&
        window.scrollY <= 0 &&
        !atFirst
      ) {
        e.preventDefault()
        nudgeTarget(step)
        return
      }

      if (scrollingUp && window.scrollY <= 0 && !atFirst && heroStillPinned()) {
        e.preventDefault()
        nudgeTarget(step)
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e: TouchEvent) => {
      if (touchYRef.current == null) return
      const y = e.touches[0]?.clientY
      if (y == null) return

      const delta = touchYRef.current - y
      touchYRef.current = y
      const atLast = targetRef.current >= FRAME_MAX - 0.001
      const atFirst = targetRef.current <= 0.001

      if (delta > 0 && !atLast) {
        e.preventDefault()
        nudgeTarget(delta / (WHEEL_SENSITIVITY * 0.55))
        return
      }

      if (delta < 0 && window.scrollY <= 0 && !atFirst) {
        e.preventDefault()
        nudgeTarget(delta / (WHEEL_SENSITIVITY * 0.55))
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (targetRef.current < FRAME_MAX) {
          e.preventDefault()
          nudgeTarget(e.key === 'PageDown' ? 8 : 2.5)
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (window.scrollY <= 0 && targetRef.current > 0) {
          e.preventDefault()
          nudgeTarget(e.key === 'PageUp' ? -8 : -2.5)
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const loadPct = Math.round((loaded / FRAME_COUNT) * 100)

  return (
    <section ref={heroRef} className="relative h-svh w-full max-w-[100vw] bg-white overflow-hidden">
      <div className="h-full w-full bg-white flex flex-col min-h-0">
        <SiteHeader variant="overlay" />

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 pt-1 md:pt-2 pb-3 gap-2 md:gap-3">
          <div className="text-center flex-shrink-0 max-w-[920px] px-1">
            <p className="text-black/55 text-[12px] sm:text-[14px] md:text-[17px] font-medium tracking-[0.08em] mb-1 md:mb-1.5">
              Trustless training for the people's model
            </p>
            <h1 className="text-black font-italiana text-[28px] leading-[1.08] sm:text-[38px] md:text-[56px] md:leading-[1.02]">
              The people own their frontier model
            </h1>
          </div>

          <div
            className="relative aspect-square shrink min-h-0 w-full overflow-hidden rounded-[16px] sm:rounded-[18px] md:rounded-[28px] border border-black/10 bg-black/[0.03]"
            style={{
              maxWidth:
                'min(92vw, 58svh, calc(100svh - 14rem), 640px)',
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full object-contain"
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <p className="text-black/50 text-[14px] sm:text-[15px] md:text-[16px]">
                  Loading {loadPct}%
                </p>
              </div>
            )}
          </div>

          <div
            className="flex-shrink-0 w-full h-[2px] bg-black/10 overflow-hidden rounded-full"
            style={{
              maxWidth:
                'min(92vw, 58svh, calc(100svh - 14rem), 640px)',
            }}
          >
            <div
              ref={progressBarRef}
              className="h-full bg-black"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
