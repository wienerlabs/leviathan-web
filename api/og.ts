export const config = {
  runtime: 'edge',
}

export default function handler(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') || ''
  const target = slug
    ? new URL(`/og/${encodeURIComponent(slug)}.png`, url.origin)
    : new URL('/og/blog.png', url.origin)
  return Response.redirect(target.toString(), 302)
}
