// Supabase access via the PostgREST REST API using the service-role key.
// No SDK dependency: a couple of fetch calls keep the edge bundle tiny and work
// identically on the Edge runtime. The service-role key must never reach the
// browser, so every call here happens server-side only.

import type { WaitlistEnv } from './auth'
import type { TwitterUser } from './twitter'

export type WaitlistSubmission = {
  email: string | null
  role: string | null
}

function restHeaders(env: WaitlistEnv): Record<string, string> {
  return {
    apikey: env.supabaseServiceKey,
    Authorization: `Bearer ${env.supabaseServiceKey}`,
  }
}

// Insert the verified entry, or update it in place if this X account already
// applied (on_conflict on twitter_id + merge-duplicates = idempotent submits).
export async function upsertWaitlistEntry(
  env: WaitlistEnv,
  user: TwitterUser,
  submission: WaitlistSubmission,
): Promise<void> {
  const res = await fetch(
    `${env.supabaseUrl}/rest/v1/waitlist?on_conflict=twitter_id`,
    {
      method: 'POST',
      headers: {
        ...restHeaders(env),
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        twitter_id: user.id,
        twitter_username: user.username,
        twitter_name: user.name,
        twitter_avatar_url: user.avatar,
        twitter_verified: user.verified,
        followers_count: user.followers,
        email: submission.email,
        role: submission.role,
        updated_at: new Date().toISOString(),
      }),
    },
  )
  if (!res.ok) {
    throw new Error(`supabase_upsert_failed:${res.status}:${await res.text()}`)
  }
}

// Exact row count via the Content-Range header (PostgREST's count=exact).
export async function countWaitlist(env: WaitlistEnv): Promise<number> {
  const res = await fetch(`${env.supabaseUrl}/rest/v1/waitlist?select=id`, {
    method: 'GET',
    headers: {
      ...restHeaders(env),
      Prefer: 'count=exact',
      'Range-Unit': 'items',
      Range: '0-0',
    },
  })
  if (!res.ok) {
    throw new Error(`supabase_count_failed:${res.status}:${await res.text()}`)
  }
  const range = res.headers.get('content-range') // e.g. "0-0/42" or "*/42"
  const total = range ? Number(range.split('/')[1]) : NaN
  return Number.isFinite(total) ? total : 0
}
