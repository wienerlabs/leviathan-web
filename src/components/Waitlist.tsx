import { useState, type FormEvent } from 'react'

const ROLES = [
  { id: 'gpu', label: 'GPU volunteer' },
  { id: 'verifier', label: 'Verifier' },
  { id: 'datacenter', label: 'Datacenter supply' },
  { id: 'spectator', label: 'Spectator' },
] as const

type RoleId = (typeof ROLES)[number]['id']

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoleId>('gpu')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email.')
      return
    }

    try {
      const key = 'leviathan-waitlist'
      const prev = JSON.parse(localStorage.getItem(key) || '[]') as unknown[]
      const entry = {
        email: trimmed,
        role,
        at: new Date().toISOString(),
      }
      const next = Array.isArray(prev) ? [...prev, entry] : [entry]
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      setError('Could not save. Try again.')
      return
    }

    setDone(true)
    setEmail('')
  }

  return (
    <section
      id="waitlist"
      className="border-t border-black/10 px-5 md:px-12 py-20 md:py-28 scroll-mt-8"
    >
      <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <p className="text-[15px] md:text-[17px] text-black/50 font-medium mb-6 tracking-[0.06em]">
            Waitlist
          </p>
          <h2 className="font-italiana text-[38px] md:text-[64px] leading-[1.08] mb-6">
            Be early for the Genesis Run
          </h2>
          <p className="text-[18px] md:text-[22px] leading-relaxed text-black/70 max-w-[520px]">
            One-line join lands in Phase 2. Leave a contact and role so we can
            ping you when the public swarm opens.
          </p>
        </div>

        <div className="rounded-[28px] border border-black p-6 md:p-8">
          {done ? (
            <div className="py-6">
              <p className="text-[22px] md:text-[26px] font-semibold mb-3">
                You are on the list
              </p>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-black/70 mb-8">
                We stored your interest on this device. Follow{' '}
                <a
                  href="https://x.com/leviathanfront"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  @leviathanfront
                </a>{' '}
                for network updates.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-black px-6 text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
              >
                Add another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="waitlist-email"
                  className="block text-[15px] md:text-[16px] font-medium mb-2"
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
                  className="w-full h-14 rounded-full border border-black/20 bg-white px-5 text-[16px] md:text-[17px] outline-none focus:border-black placeholder:text-black/30"
                />
              </div>

              <div>
                <p className="block text-[15px] md:text-[16px] font-medium mb-3">
                  Role
                </p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const active = role === r.id
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={[
                          'inline-flex h-11 items-center justify-center rounded-full border px-4 text-[14px] md:text-[15px] font-medium transition-colors',
                          active
                            ? 'border-black bg-black text-white'
                            : 'border-black/25 text-black hover:border-black',
                        ].join(' ')}
                      >
                        {r.label}
                      </button>
                    )
                  })}
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
              <p className="text-[14px] md:text-[15px] text-black/45 leading-relaxed">
                No spam. Phase 2 one-line install is the signal you care about.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
