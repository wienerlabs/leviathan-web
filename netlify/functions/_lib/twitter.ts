// Thin wrapper over the three X (Twitter) OAuth 2.0 calls we make:
// build the authorize URL, exchange the code for a token, and read the user.
// Uses the Authorization Code flow with PKCE against a confidential client
// (client id + secret), so the token request is Basic-authenticated.

const AUTHORIZE_ENDPOINT = 'https://twitter.com/i/oauth2/authorize'
const TOKEN_ENDPOINT = 'https://api.twitter.com/2/oauth2/token'
const ME_ENDPOINT =
  'https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username,verified,public_metrics'

// users.read needs tweet.read alongside it on X's OAuth 2.0.
export const OAUTH_SCOPES = ['tweet.read', 'users.read']

export function buildAuthorizeUrl(params: {
  clientId: string
  redirectUri: string
  state: string
  codeChallenge: string
}): string {
  const url = new URL(AUTHORIZE_ENDPOINT)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', params.clientId)
  url.searchParams.set('redirect_uri', params.redirectUri)
  url.searchParams.set('scope', OAUTH_SCOPES.join(' '))
  url.searchParams.set('state', params.state)
  url.searchParams.set('code_challenge', params.codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  return url.toString()
}

export type TwitterUser = {
  id: string
  username: string
  name: string
  avatar: string
  verified: boolean
  followers: number
}

export async function exchangeCode(params: {
  code: string
  redirectUri: string
  codeVerifier: string
  clientId: string
  clientSecret: string
}): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  })
  const basic = btoa(`${params.clientId}:${params.clientSecret}`)
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
  if (!res.ok) {
    throw new Error(`token_exchange_failed:${res.status}:${await res.text()}`)
  }
  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) throw new Error('token_exchange_no_access_token')
  return data.access_token
}

export async function fetchTwitterUser(
  accessToken: string,
): Promise<TwitterUser> {
  const res = await fetch(ME_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    throw new Error(`me_failed:${res.status}:${await res.text()}`)
  }
  const json = (await res.json()) as {
    data?: {
      id: string
      name: string
      username: string
      profile_image_url?: string
      verified?: boolean
      public_metrics?: { followers_count?: number }
    }
  }
  const data = json.data
  if (!data) throw new Error('me_no_data')
  return {
    id: data.id,
    username: data.username,
    name: data.name,
    // The default avatar URL is the tiny _normal variant; ask for a larger one.
    avatar: (data.profile_image_url ?? '').replace('_normal', '_400x400'),
    verified: Boolean(data.verified),
    followers: data.public_metrics?.followers_count ?? 0,
  }
}
