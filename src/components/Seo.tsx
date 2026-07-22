import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, applyDocumentTitle, ogImageUrl, SITE } from '../seo'
import { getBlogPost } from '../blog/posts'

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function pageMeta(pathname: string): { title: string; description: string } {
  if (pathname === '/blog' || pathname === '/blog/') {
    return {
      title: `Updates · ${SITE.name}`,
      description:
        'Product and engineering updates from the Leviathan network.',
    }
  }
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (blogMatch) {
    const post = getBlogPost(blogMatch[1])
    if (post) {
      return {
        title: `${post.title} · ${SITE.name}`,
        description: post.description,
      }
    }
  }
  return { title: SITE.title, description: SITE.description }
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description } = pageMeta(pathname)
    document.title = title === SITE.title ? SITE.title : title
    if (title === SITE.title) {
      applyDocumentTitle()
    }
    const url = absoluteUrl(pathname === '/' ? '/' : pathname)
    const image = ogImageUrl()

    upsertLink('canonical', url)
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:secure_url', image)
    upsertMeta('property', 'og:image:type', 'image/jpeg')
    upsertMeta('property', 'og:image:width', String(SITE.imageWidth))
    upsertMeta('property', 'og:image:height', String(SITE.imageHeight))
    upsertMeta('property', 'og:image:alt', SITE.imageAlt)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', SITE.imageAlt)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
  }, [pathname])

  return null
}
