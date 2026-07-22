import type { BlogPost } from '../types'
import { verifierDaemonFusion } from './verifier-daemon-fusion'

export const BLOG_POSTS: BlogPost[] = [verifierDaemonFusion]

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export function sortedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  )
}
