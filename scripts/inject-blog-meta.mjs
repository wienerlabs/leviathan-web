import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const siteUrl = (process.env.VITE_SITE_URL || 'https://leviathan.run').replace(
  /\/$/,
  '',
)

const catalogPath = join(root, 'src/blog/catalog.json')
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))

const publicCatalog = join(root, 'public/blog-catalog.json')
const catalogJson = `${JSON.stringify(catalog, null, 2)}\n`
writeFileSync(publicCatalog, catalogJson)
if (existsSync(dist)) {
  writeFileSync(join(dist, 'blog-catalog.json'), catalogJson)
}

const indexPath = join(dist, 'index.html')
if (!existsSync(indexPath)) {
  console.error('dist/index.html missing; run vite build first')
  process.exit(1)
}

const baseHtml = readFileSync(indexPath, 'utf8')

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function inject(
  html,
  { title, description, url, image, imageAlt, type = 'website', date },
) {
  let out = html
  const pairs = [
    [/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`],
    [
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${esc(description)}" />`,
    ],
    [
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${esc(url)}" />`,
    ],
    [
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${esc(type)}" />`,
    ],
    [
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${esc(url)}" />`,
    ],
    [
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${esc(title)}" />`,
    ],
    [
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${esc(description)}" />`,
    ],
    [
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${esc(image)}" />`,
    ],
    [
      /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image:secure_url" content="${esc(image)}" />`,
    ],
    [
      /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image:type" content="image/png" />`,
    ],
    [
      /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image:width" content="1200" />`,
    ],
    [
      /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image:height" content="630" />`,
    ],
    [
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    ],
    [
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${esc(title)}" />`,
    ],
    [
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${esc(description)}" />`,
    ],
    [
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    ],
    [
      /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
    ],
    [
      /<link\s+rel="image_src"\s+href="[^"]*"\s*\/?>/,
      `<link rel="image_src" href="${esc(image)}" />`,
    ],
  ]

  for (const [re, rep] of pairs) {
    if (!re.test(out)) {
      console.warn('pattern not found:', re)
      continue
    }
    out = out.replace(re, rep)
  }

  if (date && !out.includes('article:published_time')) {
    out = out.replace(
      '</head>',
      `    <meta property="article:published_time" content="${esc(date)}" />\n  </head>`,
    )
  }

  return out
}

function ogUrl(slug) {
  return `${siteUrl}/og/${encodeURIComponent(slug)}.png`
}

{
  const dir = join(dist, 'blog')
  mkdirSync(dir, { recursive: true })
  const html = inject(baseHtml, {
    title: 'Updates · Leviathan AI',
    description: 'Product and engineering updates from the Leviathan network.',
    url: `${siteUrl}/blog`,
    image: `${siteUrl}/og/blog.png`,
    imageAlt: 'Leviathan updates',
    type: 'website',
  })
  writeFileSync(join(dir, 'index.html'), html)
  console.log('wrote dist/blog/index.html')
}

for (const post of catalog) {
  const dir = join(dist, 'blog', post.slug)
  mkdirSync(dir, { recursive: true })
  const title = `${post.title} · Leviathan AI`
  const html = inject(baseHtml, {
    title,
    description: post.description,
    url: `${siteUrl}/blog/${post.slug}`,
    image: ogUrl(post.slug),
    imageAlt: post.title,
    type: 'article',
    date: post.date,
  })
  writeFileSync(join(dir, 'index.html'), html)
  console.log(`wrote dist/blog/${post.slug}/index.html`)
}

console.log(`injected meta for ${catalog.length} post(s)`)
