import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const FRAME_COUNT = 145
const PIXELS_PER_FRAME = 28

function frameSrc(index: number) {
  return `/frames/frame-${String(index + 1).padStart(3, '0')}.jpg`
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const unlockedRef = useRef(false)
  const touchYRef = useRef<number | null>(null)
  const rafRef = useRef(0)
  const drawnRef = useRef(-1)
  const heroRef = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let cancelled = false
    const frames: HTMLImageElement[] = []
    let done = 0

    const mark = () => {
      done += 1
      if (!cancelled) {
        setLoaded(done)
        if (done >= FRAME_COUNT) setReady(true)
      }
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = mark
      img.onerror = mark
      img.src = frameSrc(i)
      frames.push(img)
    }

    framesRef.current = frames
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      const canvas = canvasRef.current
      const frames = framesRef.current
      if (!canvas || frames.length === 0) return

      const index = frameRef.current
      if (index === drawnRef.current) return

      const img = frames[index]
      if (!img || !img.complete || img.naturalWidth === 0) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
      }

      ctx.drawImage(img, 0, 0)
      drawnRef.current = index
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    const setFrameIndex = (next: number) => {
      const clamped = clamp(Math.round(next), 0, FRAME_COUNT - 1)
      if (clamped === frameRef.current) return
      frameRef.current = clamped
      setFrame(clamped)
      if (clamped >= FRAME_COUNT - 1) {
        unlockedRef.current = true
      } else {
        unlockedRef.current = false
      }
    }

    const heroStillPinned = () => {
      const hero = heroRef.current
      if (!hero) return true
      return hero.getBoundingClientRect().bottom > window.innerHeight * 0.5
    }

    const onWheel = (e: WheelEvent) => {
      const atLast = frameRef.current >= FRAME_COUNT - 1
      const atFirst = frameRef.current <= 0
      const scrollingDown = e.deltaY > 0
      const scrollingUp = e.deltaY < 0

      if (scrollingDown && !atLast) {
        e.preventDefault()
        const steps = Math.max(1, Math.round(Math.abs(e.deltaY) / PIXELS_PER_FRAME))
        setFrameIndex(frameRef.current + steps)
        return
      }

      if (scrollingUp && unlockedRef.current && window.scrollY <= 0 && !atFirst) {
        e.preventDefault()
        const steps = Math.max(1, Math.round(Math.abs(e.deltaY) / PIXELS_PER_FRAME))
        setFrameIndex(frameRef.current - steps)
        return
      }

      if (scrollingUp && window.scrollY <= 0 && !atFirst && heroStillPinned()) {
        e.preventDefault()
        const steps = Math.max(1, Math.round(Math.abs(e.deltaY) / PIXELS_PER_FRAME))
        setFrameIndex(frameRef.current - steps)
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
      const atLast = frameRef.current >= FRAME_COUNT - 1
      const atFirst = frameRef.current <= 0

      if (delta > 0 && !atLast) {
        e.preventDefault()
        const steps = Math.max(1, Math.round(Math.abs(delta) / (PIXELS_PER_FRAME * 0.45)))
        setFrameIndex(frameRef.current + steps)
        return
      }

      if (delta < 0 && window.scrollY <= 0 && !atFirst) {
        e.preventDefault()
        const steps = Math.max(1, Math.round(Math.abs(delta) / (PIXELS_PER_FRAME * 0.45)))
        setFrameIndex(frameRef.current - steps)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (frameRef.current < FRAME_COUNT - 1) {
          e.preventDefault()
          setFrameIndex(frameRef.current + (e.key === 'PageDown' ? 8 : 2))
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (window.scrollY <= 0 && frameRef.current > 0) {
          e.preventDefault()
          setFrameIndex(frameRef.current - (e.key === 'PageUp' ? 8 : 2))
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
  const progress = frame / (FRAME_COUNT - 1)

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full bg-white"
    >
      <div className="h-full w-full bg-white flex flex-col">
        <header className="flex-shrink-0 z-20 flex items-center justify-between px-4 pt-3 pb-1 md:px-8 md:pt-5 md:pb-2">
          <div className="flex items-center gap-2.5 md:gap-3">
            <img
              src="/mascot.png"
              alt="Leviathan"
              className="h-10 w-10 md:h-12 md:w-12 object-contain grayscale"
            />
            <span className="text-black text-[18px] md:text-[22px] font-semibold tracking-tight">
              Leviathan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/leviathanfront"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-11 px-5 md:h-12 md:px-8 rounded-full border border-black text-black text-[15px] md:text-[17px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
            >
              X
            </a>
            <a
              href="#waitlist"
              className="hidden sm:inline-flex items-center justify-center h-11 px-5 md:h-12 md:px-8 rounded-full border border-black text-black text-[15px] md:text-[17px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
            >
              Waitlist
            </a>
            <Link
              to="/docs/developer/quickstart"
              className="inline-flex items-center justify-center h-11 px-5 md:h-12 md:px-8 rounded-full border border-black text-black text-[15px] md:text-[17px] font-medium hover:bg-black hover:text-white transition-colors duration-200"
            >
              Docs
            </Link>
            <a
              href="https://github.com/wienerlabs/leviathan-net"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-11 px-5 md:h-12 md:px-8 rounded-full bg-black text-white text-[15px] md:text-[17px] font-medium hover:bg-black/80 transition-colors duration-200"
            >
              Network
            </a>
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-start md:justify-center px-3 md:px-6 pt-1 md:pt-2 pb-3 gap-2 md:gap-3">
          <div className="text-center flex-shrink-0 max-w-[920px]">
            <p className="text-black/55 text-[14px] md:text-[17px] font-medium tracking-[0.08em] mb-1 md:mb-1.5">
              Trustless training for the people's model
            </p>
            <h1 className="text-black font-italiana text-[32px] leading-[1.05] sm:text-[42px] md:text-[56px] md:leading-[1.02]">
              The people own their frontier model
            </h1>
          </div>

          <div
            className="relative flex-shrink-0 overflow-hidden rounded-[18px] md:rounded-[28px] border border-black/10 bg-black/[0.03]"
            style={{
              width: 'min(94vw, calc(100svh - 9.5rem))',
              height: 'min(94vw, calc(100svh - 9.5rem))',
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <p className="text-black/50 text-[15px] md:text-[16px]">
                  Loading {loadPct}%
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 w-full max-w-[min(94vw,calc(100svh-9.5rem))] h-[2px] bg-black/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-black transition-[width] duration-75 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
