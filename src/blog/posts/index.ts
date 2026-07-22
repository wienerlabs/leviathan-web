import type { BlogPost } from '../types'
import { cheatCatchingMachineIsLive } from './cheat-catching-machine-is-live'
import { verifierDaemonFusion } from './verifier-daemon-fusion'

export const BLOG_POSTS: BlogPost[] = [
  cheatCatchingMachineIsLive,
  verifierDaemonFusion,
]

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export function sortedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return BLOG_POSTS.indexOf(a) - BLOG_POSTS.indexOf(b)
  })
}
