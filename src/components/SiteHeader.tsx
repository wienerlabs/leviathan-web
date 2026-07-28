import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const GITHUB_URL = 'https://github.com/wienerlabs/leviathan-net'
const X_URL = 'https://x.com/leviathanfront'

// No display utility here — each usage adds its own (`hidden lg:inline-flex`
// for nav items, `inline-flex lg:hidden` for the menu button) so the two never
// collide on the same element.
const btn =
  'items-center justify-center h-9 px-3 sm:h-11 sm:px-5 md:h-12 md:px-6 rounded-full border border-black text-black text-[13px] sm:text-[15px] md:text-[16px] font-medium hover:bg-black hover:text-white transition-colors duration-200'
const btnSolid =
  'inline-flex items-center justify-center h-9 px-3 sm:h-11 sm:px-5 md:h-12 md:px-6 rounded-full bg-black text-white text-[13px] sm:text-[15px] md:text-[16px] font-medium hover:bg-black/80 transition-colors duration-200'
const mobileItem =
  'block rounded-full border border-black px-4 py-3 text-[15px] font-medium hover:bg-black hover:text-white transition-colors'

// Internal routes shown in the nav. `match` drives the active (aria-current)
// state when the path prefix differs from the link target.
const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', match: '/dashboard' },
  { to: '/blog', label: 'Blog', match: '/blog' },
  { to: '/docs/developer/quickstart', label: 'Docs', match: '/docs' },
  { to: '/waitlist', label: 'Waitlist', match: '/waitlist' },
] as const

// Small pulsing indicator that draws the eye to the Waitlist CTA in the nav.
// bg-current makes it follow the text color in light, dark, and hover states.
function WaitlistDot() {
  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70 [animation-duration:1.6s]" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  )
}

export default function SiteHeader({
  variant = 'overlay',
}: {
  variant?: 'overlay' | 'sticky'
}) {
  const { pathname } = useLocation()
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
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className={`${btn} hidden lg:inline-flex`}
          >
            X
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`${btn} hidden lg:inline-flex`}
          >
            GitHub
          </a>
          {NAV_LINKS.map((link) => {
            const isWaitlist = link.to === '/waitlist'
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`${btn} hidden lg:inline-flex${isWaitlist ? ' gap-1.5' : ''}`}
                aria-current={
                  pathname.startsWith(link.match) ? 'page' : undefined
                }
              >
                {isWaitlist ? <WaitlistDot /> : null}
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/get-levi"
            className={btnSolid}
            aria-current={pathname.startsWith('/get-levi') ? 'page' : undefined}
          >
            Get $LEVI
          </Link>
          <button
            type="button"
            className={`${btn} inline-flex lg:hidden !px-0 w-9`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="lg:hidden border-t border-black/10 bg-white/95 backdrop-blur-md px-3 py-3 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={mobileItem}>
              {link.label}
            </Link>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={mobileItem}>
            GitHub
          </a>
          <a href={X_URL} target="_blank" rel="noreferrer" className={mobileItem}>
            X
          </a>
        </div>
      ) : null}
    </header>
  )
}
