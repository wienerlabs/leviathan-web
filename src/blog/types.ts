import type { ReactNode } from 'react'

export type BlogMeta = {
  slug: string
  title: string
  description: string
  date: string
  dateLabel: string
}

export type BlogPost = BlogMeta & {
  body: ReactNode
}

export function postPath(slug: string) {
  return `/blog/${slug}`
}
