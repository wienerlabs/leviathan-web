import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const btn =
  'inline-flex items-center justify-center h-9 px-3 sm:h-11 sm:px-5 md:h-12 md:px-6 rounded-full border border-black text-black text-[13px] sm:text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors duration-200'
const btnSolid =
  'inline-flex items-center justify-center h-9 px-3 sm:h-11 sm:px-5 md:h-12 md:px-6 rounded-full bg-black text-white text-[13px] sm:text-[15px] md:text-[16px] font-medium hover:bg-black/80 transition-colors duration-200'

export default function SiteHeader({
  variant = 'overlay',
}: {
  variant?: 'overlay' | 'sticky'
}) {
  const { pathname } = useLocation()
  const onLevi = pathname.startsWith('/get-levi')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const shell =
    variant === 'sticky'
      ? 'sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md'
      : 'flex-shrink-0 z-20'

  return (
    <header className={shell}>
      <div
        className={[
          'flex items-center justify-between gap-2',
          variant === 'sticky'
            ? 'mx-auto max-w-[1400px] h-14 md:h-16 px-4 md:px-6'
            : 'px-3 pt-3 pb-1 sm:px-4 md:px-8 md:pt-5 md:pb-2',
        ].join(' ')}
      >
        <Link to="/" className="flex items-center gap-2 md:gap-3 min-w-0">
          <img
            src="/mascot.png"
            alt="Leviathan"
            className="theme-mark h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain shrink-0"
          />
          <span className="text-black text-[16px] sm:text-[18px] md:text-[22px] font-semibold tracking-tight truncate">
            Leviathan
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          <a
            href="https://x.com/leviathanfront"
            target="_blank"
            rel="noreferrer"
            className={`${btn} hidden sm:inline-flex`}
          >
            X
          </a>
          <Link to="/blog" className={`${btn} hidden sm:inline-flex`}>
            Blog
          </Link>
          <Link
            to="/docs/developer/quickstart"
            className={`${btn} hidden sm:inline-flex`}
          >
            Docs
          </Link>
          <Link
            to="/get-levi"
            className={`${btnSolid} hidden sm:inline-flex`}
            aria-current={onLevi ? 'page' : undefined}
          >
            Get $LEVI
          </Link>
          <Link
            to="/get-levi"
            className={`${btnSolid} sm:hidden`}
            aria-current={onLevi ? 'page' : undefined}
          >
            $LEVI
          </Link>
          <button
            type="button"
            className={`${btn} sm:hidden !px-0 w-9`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="sm:hidden border-t border-black/10 bg-white/95 backdrop-blur-md px-3 py-3 space-y-2">
          <Link
            to="/blog"
            className="block rounded-full border border-black px-4 py-3 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/docs/developer/quickstart"
            className="block rounded-full border border-black px-4 py-3 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
          >
            Docs
          </Link>
          <a
            href="https://x.com/leviathanfront"
            target="_blank"
            rel="noreferrer"
            className="block rounded-full border border-black px-4 py-3 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
          >
            X
          </a>
        </div>
      ) : null}
    </header>
  )
}
