import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'og')

const catalog = JSON.parse(
  readFileSync(join(root, 'src/blog/catalog.json'), 'utf8'),
)

function truncate(text, max) {
  const t = String(text || '').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 3).trimEnd()}...`
}

async function loadFont() {
  const cachePath = join(root, 'scripts', '.lm-roman.ttf')
  if (existsSync(cachePath)) {
    return readFileSync(cachePath)
  }
  const urls = [
    'https://cdn.jsdelivr.net/fontsource/fonts/latin-modern-roman@5.2.5/latin-400-normal.ttf',
    'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-Regular.ttf',
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 1000) continue
      writeFileSync(cachePath, buf)
      return buf
    } catch {
      // try next
    }
  }
  throw new Error('Could not download a serif font for OG cards')
}

function cardTree({ title, description, dateLabel, slug }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f6f3ec',
        color: '#0a0a0a',
        padding: '56px 64px',
        fontFamily: 'Serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: 22,
                    color: '#444',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          backgroundColor: '#0a0a0a',
                        },
                      },
                    },
                    'Leviathan update',
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 22,
                    color: '#666',
                    fontStyle: 'italic',
                  },
                  children: dateLabel || '',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              width: '100%',
              maxWidth: 1040,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: title.length > 70 ? 48 : 56,
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 72,
                    height: 2,
                    backgroundColor: '#0a0a0a',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 28,
                    lineHeight: 1.4,
                    color: '#333',
                    maxWidth: 980,
                  },
                  children: description,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              borderTop: '1px solid rgba(0,0,0,0.12)',
              paddingTop: 22,
              fontSize: 20,
              color: '#555',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex' },
                  children: 'leviathan.run/blog',
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex' },
                  children: slug ? `/${slug}` : '',
                },
              },
            ],
          },
        },
      ],
    },
  }
}

async function renderPng(meta, font) {
  const title = truncate(meta.title, 110)
  const description = truncate(meta.description, 200)
  const svg = await satori(
    cardTree({
      title,
      description,
      dateLabel: meta.dateLabel || meta.date || '',
      slug: meta.slug,
    }),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Serif',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  })
  return resvg.render().asPng()
}

mkdirSync(outDir, { recursive: true })
const font = await loadFont()

for (const post of catalog) {
  const png = await renderPng(post, font)
  const file = join(outDir, `${post.slug}.png`)
  writeFileSync(file, png)
  console.log(`wrote public/og/${post.slug}.png (${png.length} bytes)`)
}

// default blog listing card
const blogCard = await renderPng(
  {
    slug: '',
    title: 'Updates from the Leviathan network',
    description: 'Product and engineering updates from the Leviathan network.',
    dateLabel: 'Blog',
    date: '',
  },
  font,
)
writeFileSync(join(outDir, 'blog.png'), blogCard)
console.log(`wrote public/og/blog.png (${blogCard.length} bytes)`)
