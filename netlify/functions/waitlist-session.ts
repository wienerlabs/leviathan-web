// GET /api/waitlist/session
// Reports whether the caller has a valid verified-identity session cookie, and
// if so returns the public-safe fields the page shows. The X id stays server-side.

import { SESSION_COOKIE, readEnv, verifySession } from './_lib/auth'
import { json, parseCookies } from './_lib/http'

export default async function handler(req: Request): Promise<Response> {
  const env = readEnv()
  if (!env.sessionSecret) {
    return json({ verified: false })
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const identity = await verifySession(cookies[SESSION_COOKIE], env.sessionSecret)
  if (!identity) {
    return json({ verified: false })
  }

  return json({
    verified: true,
    identity: {
      username: identity.username,
      name: identity.name,
      avatar: identity.avatar,
      verified: identity.verified,
      followers: identity.followers,
    },
  })
}

export const config = { path: '/api/waitlist/session' }
