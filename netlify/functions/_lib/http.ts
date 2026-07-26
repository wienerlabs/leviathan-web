// Generic HTTP helpers for the waitlist edge functions: cookie (de)serialization
// and small Response builders. Kept framework-free so every endpoint stays a
// plain Web `Request -> Response` handler.

type CookieOptions = {
  maxAge?: number
  httpOnly?: boolean
  path?: string
  sameSite?: 'Lax' | 'Strict' | 'None'
  secure?: boolean
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  const parts = [`${name}=${value}`]
  parts.push(`Path=${options.path ?? '/'}`)
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  parts.push(`SameSite=${options.sameSite ?? 'Lax'}`)
  return parts.join('; ')
}

// Set-Cookie value that clears a cookie the browser previously stored.
export function clearCookie(name: string): string {
  return serializeCookie(name, '', { maxAge: 0, httpOnly: true, secure: true })
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (key) out[key] = value
  }
  return out
}

export function json(
  data: unknown,
  status = 200,
  cookies: string[] = [],
): Response {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  for (const cookie of cookies) headers.append('Set-Cookie', cookie)
  return new Response(JSON.stringify(data), { status, headers })
}

export function redirect(location: string, cookies: string[] = []): Response {
  const headers = new Headers({ Location: location })
  for (const cookie of cookies) headers.append('Set-Cookie', cookie)
  return new Response(null, { status: 302, headers })
}

// Redirect back to the on-site /waitlist page with a status query param.
export function waitlistRedirect(
  origin: string,
  query: Record<string, string>,
  cookies: string[] = [],
): Response {
  const target = new URL('/waitlist', origin)
  for (const [key, value] of Object.entries(query)) {
    target.searchParams.set(key, value)
  }
  return redirect(target.toString(), cookies)
}
