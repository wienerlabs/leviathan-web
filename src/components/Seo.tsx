import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, applyDocumentTitle, ogImageUrl, SITE } from '../seo'

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

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyDocumentTitle()
    const url = absoluteUrl(pathname === '/' ? '/' : pathname)
    const image = ogImageUrl()

    upsertLink('canonical', url)
    upsertMeta('name', 'description', SITE.description)
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:title', SITE.title)
    upsertMeta('property', 'og:description', SITE.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:secure_url', image)
    upsertMeta('property', 'og:image:type', 'image/jpeg')
    upsertMeta('property', 'og:image:width', String(SITE.imageWidth))
    upsertMeta('property', 'og:image:height', String(SITE.imageHeight))
    upsertMeta('property', 'og:image:alt', SITE.imageAlt)
    upsertMeta('name', 'twitter:title', SITE.title)
    upsertMeta('name', 'twitter:description', SITE.description)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', SITE.imageAlt)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
  }, [pathname])

  return null
}
