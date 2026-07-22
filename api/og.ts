export const config = {
  runtime: 'edge',
}

type BlogMeta = {
  slug: string
}

async function loadSlugs(origin: string): Promise<Set<string>> {
  try {
    const res = await fetch(new URL('/blog-catalog.json', origin))
    if (!res.ok) return new Set()
    const data = (await res.json()) as BlogMeta[]
    return new Set(data.map((p) => p.slug))
  } catch {
    return new Set()
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const slug = (url.searchParams.get('slug') || '').trim()
  const slugs = await loadSlugs(url.origin)

  if (slug && slugs.has(slug)) {
    return Response.redirect(
      new URL(`/og/${encodeURIComponent(slug)}.png`, url.origin),
      302,
    )
  }

  if (!slug) {
    return Response.redirect(new URL('/og/blog.png', url.origin), 302)
  }

  return new Response('Unknown blog slug', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
