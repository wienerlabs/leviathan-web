// GET /api/waitlist/twitter/start
// Kicks off the X OAuth 2.0 flow: mint a PKCE verifier + state, stash them in a
// short-lived signed cookie, and 302 the user to X's authorize screen.

import {
  OAUTH_COOKIE,
  OAUTH_TTL_SECONDS,
  callbackUrl,
  missingEnv,
  readEnv,
  signOAuthState,
} from './_lib/auth'
import { redirect, serializeCookie, waitlistRedirect } from './_lib/http'
import { buildAuthorizeUrl } from './_lib/twitter'
import { pkceChallengeFromVerifier, randomToken } from './_lib/webcrypto'

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const env = readEnv()

  if (missingEnv(env).length > 0) {
    return waitlistRedirect(url.origin, { error: 'config' })
  }

  const verifier = randomToken(32)
  const challenge = await pkceChallengeFromVerifier(verifier)
  const state = randomToken(16)
  const redirectUri = callbackUrl(env, url)

  const authorizeUrl = buildAuthorizeUrl({
    clientId: env.twitterClientId,
    redirectUri,
    state,
    codeChallenge: challenge,
  })

  const token = await signOAuthState({ state, verifier }, env.sessionSecret)
  const cookie = serializeCookie(OAUTH_COOKIE, token, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'Lax',
    maxAge: OAUTH_TTL_SECONDS,
  })

  return redirect(authorizeUrl, [cookie])
}

export const config = { path: '/api/waitlist/twitter/start' }
