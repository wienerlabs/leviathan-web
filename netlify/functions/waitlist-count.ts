// GET /api/waitlist/count
// Public, best-effort total of verified signups for the social-proof counter.
// Returns { count: 0 } (never an error) when storage isn't configured yet, so
// the UI can show it unconditionally.

import { missingEnv, readEnv } from './_lib/auth'
import { json } from './_lib/http'
import { countWaitlist } from './_lib/supabase'

export default async function handler(): Promise<Response> {
  const env = readEnv()
  if (missingEnv(env).length > 0) {
    return json({ count: 0 })
  }
  try {
    return json({ count: await countWaitlist(env) })
  } catch {
    return json({ count: 0 })
  }
}

export const config = { path: '/api/waitlist/count' }
