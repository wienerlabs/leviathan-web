import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { DOCS_DEFAULT, DOCS_NAV, docsNeighbors, flatDocsNav } from './nav'
import { getDocsPage } from './pages'

export default function DocsLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const path = location.pathname.replace(/\/$/, '') || DOCS_DEFAULT
  const page = getDocsPage(path)
  const { prev, next } = docsNeighbors(path)

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (page) {
      document.title = `${page.title} - Leviathan docs`
    }
  }, [page])

  if (!page) {
    return <Navigate to={DOCS_DEFAULT} replace />
  }

  const groupTitle =
    DOCS_NAV.find((g) => g.items.some((i) => i.path === path))?.title ?? 'Docs'

  return (
    <div className="min-h-screen bg-white text-black font-manrope">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 md:h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-black text-[14px]"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle docs menu"
            >
              ☰
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/mascot.png"
                alt=""
                className="h-7 w-7 object-contain grayscale"
              />
              <span className="text-[14px] md:text-[15px] font-semibold tracking-tight">
                Leviathan
              </span>
            </Link>
            <span className="hidden sm:inline text-black/25">/</span>
            <Link
              to={DOCS_DEFAULT}
              className="hidden sm:inline text-[13px] md:text-[14px] text-black/60 hover:text-black"
            >
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/wienerlabs/leviathan-net"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full border border-black px-4 text-[12px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              to="/"
              className="inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-[12px] font-medium text-white hover:bg-black/80 transition-colors"
            >
              Site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside
          className={[
            'fixed inset-y-0 left-0 z-30 w-[280px] border-r border-black/10 bg-white pt-14 lg:pt-0',
            'lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'transition-transform duration-200 overflow-y-auto',
          ].join(' ')}
        >
          <nav className="px-4 py-6 md:px-5">
            {DOCS_NAV.map((group) => (
              <div key={group.title} className="mb-6">
                <p className="mb-2 px-2 text-[11px] font-semibold tracking-[0.08em] text-black/45">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = path === item.path
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={[
                            'block rounded-full px-3 py-2 text-[13px] md:text-[14px] transition-colors',
                            active
                              ? 'bg-black text-white font-medium'
                              : 'text-black/70 hover:bg-black/[0.04] hover:text-black',
                          ].join(' ')}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12 lg:px-14">
          <div className="mx-auto max-w-[720px]">
            <p className="mb-3 text-[12px] text-black/45 tracking-[0.06em]">
              {groupTitle}
            </p>
            {page.body}
            <div className="mt-16 flex flex-col sm:flex-row gap-3 border-t border-black/10 pt-8">
              {prev ? (
                <Link
                  to={prev.path}
                  className="flex-1 rounded-[24px] border border-black px-5 py-4 hover:bg-black hover:text-white transition-colors"
                >
                  <p className="text-[11px] opacity-50 mb-1">Previous</p>
                  <p className="text-[14px] font-medium">{prev.title}</p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {next ? (
                <Link
                  to={next.path}
                  className="flex-1 rounded-[24px] border border-black px-5 py-4 text-right hover:bg-black hover:text-white transition-colors"
                >
                  <p className="text-[11px] opacity-50 mb-1">Next</p>
                  <p className="text-[14px] font-medium">{next.title}</p>
                </Link>
              ) : null}
            </div>
            <p className="mt-10 text-[12px] text-black/40">
              Source pages:{' '}
              {flatDocsNav().length} docs · derived from{' '}
              <a
                className="underline underline-offset-2"
                href="https://github.com/wienerlabs/leviathan"
                target="_blank"
                rel="noreferrer"
              >
                leviathan
              </a>{' '}
              and{' '}
              <a
                className="underline underline-offset-2"
                href="https://github.com/wienerlabs/leviathan-net"
                target="_blank"
                rel="noreferrer"
              >
                leviathan-net
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
