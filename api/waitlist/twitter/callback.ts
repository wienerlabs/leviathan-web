// GET /api/waitlist/twitter/callback?code=...&state=...
// X redirects here after the user approves. We verify state, exchange the code
// for a token, read the verified profile, and drop a signed identity session
// cookie. No DB write happens yet — the user still fills in the form, and only
// `submit` (which re-reads this cookie) persists the entry.

import {
  OAUTH_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  callbackUrl,
  missingEnv,
  readEnv,
  signSession,
  verifyOAuthState,
} from '../../_lib/auth'
import {
  clearCookie,
  parseCookies,
  serializeCookie,
  waitlistRedirect,
} from '../../_lib/http'
import { exchangeCode, fetchTwitterUser } from '../../_lib/twitter'

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const origin = url.origin
  const env = readEnv()

  if (missingEnv(env).length > 0) {
    return waitlistRedirect(origin, { error: 'config' })
  }

  // The user denied access or X returned an error.
  if (url.searchParams.get('error')) {
    return waitlistRedirect(origin, { error: 'denied' }, [clearCookie(OAUTH_COOKIE)])
  }

  const code = url.searchParams.get('code') ?? ''
  const state = url.searchParams.get('state') ?? ''
  if (!code || !state) {
    return waitlistRedirect(origin, { error: 'twitter' }, [clearCookie(OAUTH_COOKIE)])
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const oauth = await verifyOAuthState(cookies[OAUTH_COOKIE], env.sessionSecret)
  if (!oauth) {
    return waitlistRedirect(origin, { error: 'expired' }, [clearCookie(OAUTH_COOKIE)])
  }
  if (oauth.state !== state) {
    return waitlistRedirect(origin, { error: 'state' }, [clearCookie(OAUTH_COOKIE)])
  }

  try {
    const accessToken = await exchangeCode({
      code,
      redirectUri: callbackUrl(env, url),
      codeVerifier: oauth.verifier,
      clientId: env.twitterClientId,
      clientSecret: env.twitterClientSecret,
    })
    const user = await fetchTwitterUser(accessToken)

    const session = await signSession(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
        followers: user.followers,
      },
      env.sessionSecret,
    )

    const sessionCookie = serializeCookie(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'Lax',
      maxAge: SESSION_TTL_SECONDS,
    })

    return waitlistRedirect(origin, { verified: '1' }, [
      sessionCookie,
      clearCookie(OAUTH_COOKIE),
    ])
  } catch {
    return waitlistRedirect(origin, { error: 'twitter' }, [clearCookie(OAUTH_COOKIE)])
  }
}

export const config = { runtime: 'edge' }
