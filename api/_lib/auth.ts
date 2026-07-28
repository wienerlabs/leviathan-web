// Environment access plus signed, tamper-proof cookie payloads for the two
// pieces of server-side state the OAuth flow needs:
//   - the short-lived OAuth transaction (state + PKCE verifier), and
//   - the verified-identity session that `submit` trusts instead of the client.
// Both are HMAC-signed with WAITLIST_SESSION_SECRET so the browser can hold them
// without being able to forge or read a valid one.

import {
  base64UrlDecodeText,
  base64UrlEncodeText,
  hmacSign,
  timingSafeEqual,
} from './webcrypto'

export const OAUTH_COOKIE = 'lw_oauth'
export const SESSION_COOKIE = 'lw_sess'

export const OAUTH_TTL_SECONDS = 60 * 10 // 10 minutes to complete the round-trip
export const SESSION_TTL_SECONDS = 60 * 60 // 1 hour to fill in the form

export type WaitlistEnv = {
  twitterClientId: string
  twitterClientSecret: string
  sessionSecret: string
  supabaseUrl: string
  supabaseServiceKey: string
  callbackUrlOverride: string | null
}

export function readEnv(): WaitlistEnv {
  // The Edge runtime exposes process.env, but this project ships no @types/node,
  // so reach it through globalThis to keep the api/ sources type-clean.
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } })
      .process?.env ?? {}
  return {
    twitterClientId: env.TWITTER_CLIENT_ID ?? '',
    twitterClientSecret: env.TWITTER_CLIENT_SECRET ?? '',
    sessionSecret: env.WAITLIST_SESSION_SECRET ?? '',
    supabaseUrl: (env.SUPABASE_URL ?? '').replace(/\/+$/, ''),
    supabaseServiceKey: env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    callbackUrlOverride: env.TWITTER_CALLBACK_URL || null,
  }
}

// Env needed for the OAuth + storage flow. If anything is missing we fail soft
// (the UI shows a friendly "not configured yet" state) rather than 500-ing.
export function missingEnv(env: WaitlistEnv): string[] {
  const missing: string[] = []
  if (!env.twitterClientId) missing.push('TWITTER_CLIENT_ID')
  if (!env.twitterClientSecret) missing.push('TWITTER_CLIENT_SECRET')
  if (!env.sessionSecret) missing.push('WAITLIST_SESSION_SECRET')
  if (!env.supabaseUrl) missing.push('SUPABASE_URL')
  if (!env.supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  return missing
}

// The redirect_uri must match X app config byte-for-byte and be identical in the
// authorize step and the token exchange, so both call this one function.
export function callbackUrl(env: WaitlistEnv, requestUrl: URL): string {
  if (env.callbackUrlOverride) return env.callbackUrlOverride
  return `${requestUrl.origin}/api/waitlist/twitter/callback`
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

async function encodeSigned(payload: unknown, secret: string): Promise<string> {
  const body = base64UrlEncodeText(JSON.stringify(payload))
  const signature = await hmacSign(body, secret)
  return `${body}.${signature}`
}

async function decodeSigned<T>(
  token: string | undefined,
  secret: string,
): Promise<T | null> {
  if (!token) return null
  const dot = token.indexOf('.')
  if (dot === -1) return null
  const body = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  const expected = await hmacSign(body, secret)
  if (!timingSafeEqual(signature, expected)) return null
  try {
    return JSON.parse(base64UrlDecodeText(body)) as T
  } catch {
    return null
  }
}

export type OAuthState = { state: string; verifier: string; exp: number }

export async function signOAuthState(
  data: { state: string; verifier: string },
  secret: string,
): Promise<string> {
  const payload: OAuthState = {
    state: data.state,
    verifier: data.verifier,
    exp: nowSeconds() + OAUTH_TTL_SECONDS,
  }
  return encodeSigned(payload, secret)
}

export async function verifyOAuthState(
  token: string | undefined,
  secret: string,
): Promise<OAuthState | null> {
  const data = await decodeSigned<OAuthState>(token, secret)
  if (!data || typeof data.exp !== 'number' || data.exp < nowSeconds()) {
    return null
  }
  return data
}

export type VerifiedIdentity = {
  id: string
  username: string
  name: string
  avatar: string
  verified: boolean
  followers: number
  exp: number
}

export async function signSession(
  identity: Omit<VerifiedIdentity, 'exp'>,
  secret: string,
): Promise<string> {
  const payload: VerifiedIdentity = {
    ...identity,
    exp: nowSeconds() + SESSION_TTL_SECONDS,
  }
  return encodeSigned(payload, secret)
}

export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<VerifiedIdentity | null> {
  const data = await decodeSigned<VerifiedIdentity>(token, secret)
  if (!data || typeof data.exp !== 'number' || data.exp < nowSeconds()) {
    return null
  }
  return data
}
