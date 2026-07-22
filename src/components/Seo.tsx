import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, applyDocumentTitle, ogImageUrl, SITE } from '../seo'
import { getBlogPost } from '../blog/posts'
import { blogOgImageUrl } from '../blog/catalog'

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

function pageMeta(pathname: string): {
  title: string
  description: string
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  imageType: string
  type: string
} {
  if (pathname === '/blog' || pathname === '/blog/') {
    return {
      title: `Updates · ${SITE.name}`,
      description:
        'Product and engineering updates from the Leviathan network.',
      image: ogImageUrl(),
      imageAlt: SITE.imageAlt,
      imageWidth: SITE.imageWidth,
      imageHeight: SITE.imageHeight,
      imageType: 'image/jpeg',
      type: 'website',
    }
  }
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (blogMatch) {
    const post = getBlogPost(blogMatch[1])
    if (post) {
      return {
        title: `${post.title} · ${SITE.name}`,
        description: post.description,
        image: blogOgImageUrl(post),
        imageAlt: post.title,
        imageWidth: SITE.cardWidth,
        imageHeight: SITE.cardHeight,
        imageType: 'image/png',
        type: 'article',
      }
    }
  }
  return {
    title: SITE.title,
    description: SITE.description,
    image: ogImageUrl(),
    imageAlt: SITE.imageAlt,
    imageWidth: SITE.imageWidth,
    imageHeight: SITE.imageHeight,
    imageType: 'image/jpeg',
    type: 'website',
  }
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = pageMeta(pathname)
    document.title = meta.title
    if (meta.title === SITE.title) {
      applyDocumentTitle()
    }
    const url = absoluteUrl(pathname === '/' ? '/' : pathname)

    upsertLink('canonical', url)
    upsertLink('image_src', meta.image)
    upsertMeta('name', 'description', meta.description)
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:type', meta.type)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', meta.image)
    upsertMeta('property', 'og:image:secure_url', meta.image)
    upsertMeta('property', 'og:image:type', meta.imageType)
    upsertMeta('property', 'og:image:width', String(meta.imageWidth))
    upsertMeta('property', 'og:image:height', String(meta.imageHeight))
    upsertMeta('property', 'og:image:alt', meta.imageAlt)
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)
    upsertMeta('name', 'twitter:image', meta.image)
    upsertMeta('name', 'twitter:image:alt', meta.imageAlt)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    const dark = document.documentElement.classList.contains('dark')
    upsertMeta('name', 'theme-color', dark ? '#0b0b0b' : '#ffffff')
    upsertMeta('name', 'color-scheme', dark ? 'dark' : 'light')
  }, [pathname])

  return null
}
