import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

type BlogMeta = {
  slug: string
  title: string
  description: string
  date: string
  dateLabel: string
}

function truncate(text: string, max: number) {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}…`
}

async function loadCatalog(reqUrl: string): Promise<BlogMeta[]> {
  try {
    const url = new URL('/blog-catalog.json', reqUrl)
    const res = await fetch(url)
    if (!res.ok) return []
    return (await res.json()) as BlogMeta[]
  } catch {
    return []
  }
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  const catalog = await loadCatalog(req.url)
  const post = catalog.find((p) => p.slug === slug)

  const title = truncate(
    searchParams.get('title') || post?.title || 'Leviathan update',
    110,
  )
  const description = truncate(
    searchParams.get('description') ||
      post?.description ||
      'Product and engineering updates from the Leviathan network.',
    200,
  )
  const dateLabel =
    searchParams.get('date') || post?.dateLabel || post?.date || ''

  const fontRes = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/latin-modern-roman@latest/latin-400-normal.ttf',
  )
  const fontData = fontRes.ok ? await fontRes.arrayBuffer() : undefined

  const fonts = fontData
    ? [
        {
          name: 'LM Roman',
          data: fontData,
          style: 'normal' as const,
          weight: 400 as const,
        },
      ]
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f6f3ec',
          color: '#0a0a0a',
          padding: '56px 64px',
          fontFamily: fonts.length
            ? '"LM Roman", "Times New Roman", serif'
            : '"Times New Roman", Times, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: 22,
              letterSpacing: '0.04em',
              color: '#444',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: '#0a0a0a',
              }}
            />
            Leviathan update
          </div>
          <div style={{ fontSize: 22, color: '#666', fontStyle: 'italic' }}>
            {dateLabel}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            width: '100%',
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              fontSize: title.length > 70 ? 48 : 56,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              fontWeight: 400,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 72,
              height: 2,
              backgroundColor: '#0a0a0a',
            }}
          />
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: '#333',
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
            borderTop: '1px solid rgba(0,0,0,0.12)',
            paddingTop: 22,
            fontSize: 20,
            color: '#555',
          }}
        >
          <div style={{ display: 'flex' }}>leviathan.run/blog</div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {slug ? `/${slug}` : ''}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    },
  )
}
