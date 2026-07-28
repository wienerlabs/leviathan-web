import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import XLogo from '../components/XLogo'

type Identity = {
  username: string
  name: string
  avatar: string
  verified: boolean
  followers: number
}

type Status = 'loading' | 'idle' | 'verified' | 'done'

const ROLES = [
  { id: 'gpu', label: 'GPU volunteer', detail: 'Join training rounds, earn PoG.' },
  { id: 'verifier', label: 'Verifier', detail: 'Replay audits, earn bounties.' },
  { id: 'datacenter', label: 'Datacenter', detail: 'H100 / B200 fleets.' },
  { id: 'builder', label: 'Builder', detail: 'Clients, tooling, research.' },
  { id: 'spectator', label: 'Spectator', detail: 'Watch the loss curve, join later.' },
] as const

const PERKS = [
  {
    title: 'Early access',
    body: 'First in line when one-line join and the public swarm open.',
  },
  {
    title: 'Verified only',
    body: 'One real X account, one spot. No bots, no burner sybils.',
  },
  {
    title: 'Role routing',
    body: 'We match you to GPU, verifier, supply, or builder tracks.',
  },
]

const ERROR_COPY: Record<string, string> = {
  denied: 'X verification was cancelled. Give it another try when you are ready.',
  expired: 'That verification link timed out. Please connect again.',
  state: 'Security check failed. Please connect with X again.',
  twitter: 'Could not reach X just now. Please try again in a moment.',
  config: 'The waitlist is not fully configured yet. Please check back shortly.',
}

function CountPill({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <div className="rounded-full border border-black px-4 py-2 text-[14px]">
      <span className="font-medium tabular-nums">{count.toLocaleString('en-US')}</span>
      <span className="text-black/45"> verified so far</span>
    </div>
  )
}

function VerifiedIdentityCard({ identity }: { identity: Identity }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-black/15 bg-black/[0.02] px-4 py-3.5">
      {identity.avatar ? (
        <img
          src={identity.avatar}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-black/10 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[16px] font-semibold truncate">{identity.name}</p>
          {identity.verified ? (
            <span
              title="Verified on X"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-black text-white text-[10px] leading-none shrink-0"
            >
              ✓
            </span>
          ) : null}
        </div>
        <p className="text-[14px] text-black/55 truncate">
          @{identity.username}
          {identity.followers > 0
            ? ` · ${identity.followers.toLocaleString('en-US')} followers`
            : ''}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-black px-3 py-1.5 text-[12px] font-medium shrink-0">
        <XLogo className="h-3 w-3" />
        Verified
      </span>
    </div>
  )
}

export default function Waitlist() {
  const [status, setStatus] = useState<Status>('loading')
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [count, setCount] = useState(0)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errParam = params.get('error')
    if (errParam) {
      setError(ERROR_COPY[errParam] ?? 'Something went wrong. Please try again.')
    }
    if (errParam || params.get('verified')) {
      window.history.replaceState({}, '', '/waitlist')
    }

    let cancelled = false
    Promise.all([
      fetch('/api/waitlist/session', { headers: { accept: 'application/json' } })
        .then((r) => r.json())
        .catch(() => ({ verified: false })),
      fetch('/api/waitlist/count', { headers: { accept: 'application/json' } })
        .then((r) => r.json())
        .catch(() => ({ count: 0 })),
    ]).then(([session, counts]) => {
      if (cancelled) return
      setCount(Number(counts?.count) || 0)
      if (session?.verified && session.identity) {
        setIdentity(session.identity as Identity)
        setStatus('verified')
      } else {
        setStatus('idle')
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const connectX = () => {
    window.location.href = '/api/waitlist/twitter/start'
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role: role || undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        if (data?.error === 'not_verified') {
          setIdentity(null)
          setStatus('idle')
          setError('Your verification expired. Please connect with X again.')
        } else if (data?.error === 'invalid_email') {
          setError('Please enter a valid email, or leave the field blank.')
        } else {
          setError('Could not save your spot. Please try again.')
        }
        return
      }
      setCount(Number(data.count) || count)
      setStatus('done')
    } catch {
      setError('Could not save your spot. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black font-manrope overflow-x-clip max-w-[100vw]">
      <SiteHeader variant="sticky" />

      <section className="px-4 sm:px-5 md:px-12 py-14 sm:py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto w-full">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 sm:gap-12 lg:gap-16 items-start">
            {/* Left: narrative */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0"
            >
              <p className="text-[14px] sm:text-[15px] md:text-[17px] text-black/50 font-medium mb-5 sm:mb-6 tracking-[0.06em]">
                Waitlist
              </p>
              <h1 className="font-italiana text-[34px] sm:text-[44px] md:text-[64px] leading-[1.06] mb-5 sm:mb-6">
                Be early for the Genesis Run
              </h1>
              <p className="text-[16px] sm:text-[18px] md:text-[21px] leading-relaxed text-black/70 max-w-[520px] mb-8">
                Phase 1 trust and training are live on Solana devnet. Phase 2
                opens the public swarm. Verify with X to claim your spot — one
                real account, one place in line.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <CountPill count={count} />
                <div className="rounded-full border border-black/20 px-4 py-2 text-[14px] text-black/55">
                  Phase 2 · public swarm
                </div>
                <a
                  href="https://x.com/leviathanfront"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/20 px-4 py-2 text-[14px] text-black/55 hover:border-black hover:text-black transition-colors"
                >
                  @leviathanfront
                </a>
              </div>

              <div className="space-y-3">
                {PERKS.map((perk, i) => (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="rounded-[22px] border border-black/15 px-5 py-4"
                  >
                    <p className="text-[16px] md:text-[17px] font-semibold mb-1">
                      {String(i + 1).padStart(2, '0')} · {perk.title}
                    </p>
                    <p className="text-[15px] md:text-[16px] text-black/60 leading-relaxed">
                      {perk.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: verification + form card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[24px] sm:rounded-[32px] border border-black p-5 sm:p-6 md:p-8 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.04)] min-w-0"
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-16"
                  >
                    <div className="h-8 w-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  </motion.div>
                ) : status === 'done' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="py-4"
                  >
                    <p className="text-[13px] tracking-[0.1em] text-black/40 mb-3">
                      Confirmed
                    </p>
                    <p className="font-italiana text-[30px] md:text-[38px] leading-[1.08] mb-4">
                      You are on the list
                    </p>
                    {identity ? (
                      <div className="mb-6">
                        <VerifiedIdentityCard identity={identity} />
                      </div>
                    ) : null}
                    <p className="text-[15px] md:text-[16px] leading-relaxed text-black/60 mb-8">
                      Your spot is saved to your verified X account. When the
                      public swarm opens we will route by role and reach out.
                      Follow{' '}
                      <a
                        href="https://x.com/leviathanfront"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 text-black"
                      >
                        @leviathanfront
                      </a>{' '}
                      for the signal.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://x.com/leviathanfront"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black text-white px-6 text-[15px] font-medium hover:bg-black/80 transition-colors"
                      >
                        <XLogo className="h-4 w-4" />
                        Follow on X
                      </a>
                      <Link
                        to="/docs/developer/quickstart"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        Read the docs
                      </Link>
                    </div>
                  </motion.div>
                ) : status === 'verified' && identity ? (
                  <motion.form
                    key="verified"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <p className="text-[13px] tracking-[0.1em] text-black/40 mb-3">
                        Step 2 · Almost there
                      </p>
                      <VerifiedIdentityCard identity={identity} />
                    </div>

                    <div>
                      <label
                        htmlFor="waitlist-email"
                        className="block text-[14px] md:text-[15px] font-medium mb-2"
                      >
                        Email <span className="text-black/35">(optional)</span>
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 rounded-full border border-black/20 bg-white px-5 text-[15px] md:text-[16px] outline-none focus:border-black placeholder:text-black/30"
                      />
                    </div>

                    <div>
                      <p className="block text-[14px] md:text-[15px] font-medium mb-2">
                        How will you show up?{' '}
                        <span className="text-black/35">(optional)</span>
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {ROLES.map((r) => {
                          const active = role === r.id
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setRole(active ? '' : r.id)}
                              aria-pressed={active}
                              className={[
                                'text-left rounded-[16px] border px-4 py-3 transition-colors',
                                active
                                  ? 'border-black bg-black text-white'
                                  : 'border-black/20 text-black hover:border-black',
                              ].join(' ')}
                            >
                              <span className="block text-[14px] md:text-[15px] font-medium mb-0.5">
                                {r.label}
                              </span>
                              <span
                                className={[
                                  'block text-[12px] md:text-[13px] leading-snug',
                                  active ? 'text-white/65' : 'text-black/50',
                                ].join(' ')}
                              >
                                {r.detail}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {error ? (
                      <p className="text-[14px] text-black bg-black/[0.04] rounded-[14px] px-4 py-3">
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-14 w-full items-center justify-center rounded-full bg-black text-white text-[16px] md:text-[17px] font-medium hover:bg-black/80 transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Saving…' : 'Join the waitlist'}
                    </button>
                    <p className="text-[13px] md:text-[14px] text-black/45 leading-relaxed">
                      Verified as @{identity.username}. Your email and role only
                      route early access — nothing is shared publicly.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-2"
                  >
                    <p className="text-[13px] tracking-[0.1em] text-black/40 mb-3">
                      Step 1 · Verify
                    </p>
                    <h2 className="text-[24px] md:text-[30px] leading-[1.12] mb-3">
                      Verify with X to join
                    </h2>
                    <p className="text-[15px] md:text-[17px] leading-relaxed text-black/60 mb-7">
                      We confirm one real X account per spot. It takes a few
                      seconds and keeps the list honest — no bots, no duplicate
                      sybils ahead of you.
                    </p>

                    {error ? (
                      <p className="text-[14px] text-black bg-black/[0.04] rounded-[14px] px-4 py-3 mb-5">
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={connectX}
                      className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-black text-white text-[16px] md:text-[17px] font-medium hover:bg-black/80 transition-colors"
                    >
                      <XLogo className="h-4 w-4" />
                      Connect X to verify
                    </button>

                    <div className="mt-6 space-y-2.5">
                      {[
                        'One account, one spot',
                        'We never post on your behalf',
                        'We only read your public profile',
                      ].map((line) => (
                        <div
                          key={line}
                          className="flex items-center gap-2.5 text-[14px] md:text-[15px] text-black/60"
                        >
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-black/30 text-[10px] shrink-0">
                            ✓
                          </span>
                          {line}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
