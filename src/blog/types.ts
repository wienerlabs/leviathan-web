import type { ReactNode } from 'react'

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  dateLabel: string
  body: ReactNode
}

export function postPath(slug: string) {
  return `/blog/${slug}`
}
