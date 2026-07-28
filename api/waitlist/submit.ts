// POST /api/waitlist/submit  { email?, role? }
// Persists the entry. The X identity comes from the signed session cookie, never
// from the request body, so the client cannot claim to be someone else. Idempotent:
// the same X account can resubmit to update its email/role.

import { SESSION_COOKIE, missingEnv, readEnv, verifySession } from '../_lib/auth'
import { json, parseCookies } from '../_lib/http'
import { countWaitlist, upsertWaitlistEntry } from '../_lib/supabase'

const ALLOWED_ROLES = new Set([
  'gpu',
  'verifier',
  'datacenter',
  'builder',
  'spectator',
])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405)
  }

  // Same-origin guard. SameSite=Lax already blocks the cookie on cross-site
  // POSTs; this rejects any stray cross-origin attempt outright.
  const url = new URL(req.url)
  const origin = req.headers.get('origin')
  if (origin && origin !== url.origin) {
    return json({ error: 'bad_origin' }, 403)
  }

  const env = readEnv()
  if (missingEnv(env).length > 0) {
    return json({ error: 'not_configured' }, 503)
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const identity = await verifySession(cookies[SESSION_COOKIE], env.sessionSecret)
  if (!identity) {
    return json({ error: 'not_verified' }, 401)
  }

  let payload: { email?: unknown; role?: unknown } = {}
  try {
    payload = (await req.json()) as typeof payload
  } catch {
    payload = {}
  }

  const rawEmail = typeof payload.email === 'string' ? payload.email.trim() : ''
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail.toLowerCase() : null
  if (rawEmail && !email) {
    return json({ error: 'invalid_email' }, 400)
  }

  const rawRole = typeof payload.role === 'string' ? payload.role : ''
  const role = ALLOWED_ROLES.has(rawRole) ? rawRole : null

  try {
    await upsertWaitlistEntry(
      env,
      {
        id: identity.id,
        username: identity.username,
        name: identity.name,
        avatar: identity.avatar,
        verified: identity.verified,
        followers: identity.followers,
      },
      { email, role },
    )
  } catch {
    return json({ error: 'save_failed' }, 502)
  }

  let count = 0
  try {
    count = await countWaitlist(env)
  } catch {
    count = 0
  }

  return json({ ok: true, count, username: identity.username })
}

export const config = { runtime: 'edge' }
