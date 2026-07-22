import catalogJson from './catalog.json'
import type { BlogMeta } from './types'
import { absoluteUrl } from '../seo'

export const BLOG_CATALOG: BlogMeta[] = catalogJson as BlogMeta[]

export function getBlogMeta(slug: string) {
  return BLOG_CATALOG.find((post) => post.slug === slug) ?? null
}

export function sortedBlogMeta() {
  return [...BLOG_CATALOG].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  )
}

export function blogOgImageUrl(meta: BlogMeta) {
  return absoluteUrl(`/og/${meta.slug}.png`)
}

export function blogPageUrl(slug?: string) {
  if (!slug) return absoluteUrl('/blog')
  return absoluteUrl(`/blog/${slug}`)
}
