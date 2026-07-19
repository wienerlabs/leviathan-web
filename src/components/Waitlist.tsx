import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

const ROLES = [
  {
    id: 'gpu',
    label: 'GPU volunteer',
    detail: 'Consumer or workstation card. Join training rounds and earn PoG.',
  },
  {
    id: 'verifier',
    label: 'Verifier',
    detail: 'Replay audits, file fraud proofs, earn bounties from slashed bonds.',
  },
  {
    id: 'datacenter',
    label: 'Datacenter supply',
    detail: 'H100 / B200 fleets. Predictable GPU-hour yield and settlement.',
  },
  {
    id: 'builder',
    label: 'Builder',
    detail: 'Clients, tooling, research. Ship on the open stack.',
  },
  {
    id: 'spectator',
    label: 'Spectator',
    detail: 'Watch the loss curve, follow Genesis Run, join later.',
  },
] as const

const INTERESTS = [
  { id: 'genesis', label: 'Genesis Run' },
  { id: 'node', label: 'Run a node' },
  { id: 'docs', label: 'Deep docs' },
  { id: 'governance', label: 'Futarchy / next model' },
  { id: 'inference', label: 'Inference network' },
  { id: 'research', label: 'Sim & security' },
] as const

const PERKS = [
  {
    title: 'Early access',
    body: 'First in line when one-line join and the public swarm open.',
  },
  {
    title: 'Role routing',
    body: 'We match you to GPU, verifier, supply, or builder tracks.',
  },
  {
    title: 'Devnet signal',
    body: 'Conviction and multi-epoch training already live. Phase 2 is next.',
  },
]

type RoleId = (typeof ROLES)[number]['id']
type InterestId = (typeof INTERESTS)[number]['id']

type Entry = {
  email: string
  name: string
  role: RoleId
  interests: InterestId[]
  x: string
  note: string
  at: string
}

const STORAGE_KEY = 'leviathan-waitlist'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<RoleId>('gpu')
  const [interests, setInterests] = useState<InterestId[]>(['genesis', 'node'])
  const [xHandle, setXHandle] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(prev)) setCount(prev.length)
    } catch {
      setCount(0)
    }
  }, [done])

  const roleMeta = useMemo(
    () => ROLES.find((r) => r.id === role) ?? ROLES[0],
    [role],
  )

  const toggleInterest = (id: InterestId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email.')
      return
    }

    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Entry[]
      const entry: Entry = {
        email: trimmed,
        name: name.trim(),
        role,
        interests,
        x: xHandle.trim().replace(/^@/, ''),
        note: note.trim(),
        at: new Date().toISOString(),
      }
      const list = Array.isArray(prev) ? prev : []
      const next = [...list.filter((x) => x.email !== trimmed), entry]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setCount(next.length)
    } catch {
      setError('Could not save. Try again.')
      return
    }

    setDone(true)
  }

  const reset = () => {
    setDone(false)
    setEmail('')
    setName('')
    setXHandle('')
    setNote('')
    setInterests(['genesis', 'node'])
    setRole('gpu')
  }

  return (
    <section
      id="waitlist"
      className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28 scroll-mt-8"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-[15px] md:text-[17px] text-black/50 font-medium mb-6 tracking-[0.06em]">
              Waitlist
            </p>
            <h2 className="text-[38px] md:text-[64px] leading-[1.08] mb-6">
              Be early for the Genesis Run
            </h2>
            <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[520px] mb-8">
              Phase 1 trust and training are live on Solana devnet. Phase 2 opens
              the public swarm. Tell us how you show up and what you want first.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <div className="rounded-full border border-black px-4 py-2 text-[14px]">
                <span className="text-black/45">Device signups </span>
                <span className="font-medium tabular-nums">{count}</span>
              </div>
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
          </div>

          <div className="rounded-[32px] border border-black p-6 md:p-8 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.04)]">
            <AnimatePresence mode="wait">
              {done ? (
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
                  <p className="text-[28px] md:text-[34px] leading-[1.1] mb-4">
                    You are on the list
                  </p>
                  <p className="text-[16px] md:text-[18px] leading-relaxed text-black/70 mb-3">
                    Role: <span className="text-black font-medium">{roleMeta.label}</span>
                  </p>
                  <p className="text-[15px] md:text-[16px] leading-relaxed text-black/55 mb-8">
                    Saved on this device. When the public swarm opens we will
                    route by role. Follow{' '}
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
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
                    >
                      Add another
                    </button>
                    <a
                      href="https://x.com/leviathanfront"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-black text-white px-6 text-[15px] font-medium hover:bg-black/80 transition-colors"
                    >
                      Follow on X
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="waitlist-name"
                        className="block text-[14px] md:text-[15px] font-medium mb-2"
                      >
                        Name <span className="text-black/35">(optional)</span>
                      </label>
                      <input
                        id="waitlist-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada"
                        className="w-full h-12 rounded-full border border-black/20 bg-white px-5 text-[15px] md:text-[16px] outline-none focus:border-black placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="waitlist-email"
                        className="block text-[14px] md:text-[15px] font-medium mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 rounded-full border border-black/20 bg-white px-5 text-[15px] md:text-[16px] outline-none focus:border-black placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="block text-[14px] md:text-[15px] font-medium mb-2">
                      Primary role
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {ROLES.map((r) => {
                        const active = role === r.id
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={[
                              'text-left rounded-[18px] border px-4 py-3 transition-colors',
                              active
                                ? 'border-black bg-black text-white'
                                : 'border-black/20 text-black hover:border-black',
                            ].join(' ')}
                          >
                            <span className="block text-[14px] md:text-[15px] font-medium mb-1">
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

                  <div>
                    <p className="block text-[14px] md:text-[15px] font-medium mb-2">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((item) => {
                        const on = interests.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleInterest(item.id)}
                            className={[
                              'inline-flex h-10 items-center rounded-full border px-4 text-[13px] md:text-[14px] transition-colors',
                              on
                                ? 'border-black bg-black text-white'
                                : 'border-black/20 text-black/70 hover:border-black',
                            ].join(' ')}
                          >
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="waitlist-x"
                        className="block text-[14px] md:text-[15px] font-medium mb-2"
                      >
                        X handle <span className="text-black/35">(optional)</span>
                      </label>
                      <input
                        id="waitlist-x"
                        type="text"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        placeholder="@you"
                        className="w-full h-12 rounded-full border border-black/20 bg-white px-5 text-[15px] md:text-[16px] outline-none focus:border-black placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="waitlist-note"
                        className="block text-[14px] md:text-[15px] font-medium mb-2"
                      >
                        Note <span className="text-black/35">(optional)</span>
                      </label>
                      <input
                        id="waitlist-note"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="GPU model, region, link…"
                        className="w-full h-12 rounded-full border border-black/20 bg-white px-5 text-[15px] md:text-[16px] outline-none focus:border-black placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  {error ? (
                    <p className="text-[15px] text-black">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-black text-white text-[16px] md:text-[17px] font-medium hover:bg-black/80 transition-colors"
                  >
                    Join waitlist
                  </button>
                  <p className="text-[13px] md:text-[14px] text-black/45 leading-relaxed">
                    No spam. Data stays on this device until we wire a shared
                    backend. Role and interests only route early access.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
