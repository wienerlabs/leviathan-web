import type { BlogPost } from '../types'
import { BLOG_CATALOG } from '../catalog'
import { appealsCourtForWrongfulConvictions } from './appeals-court-for-wrongful-convictions'
import { tieBreakersNeedToEatToo } from './tie-breakers-need-to-eat-too'
import { bondCanActuallyBePosted } from './bond-can-actually-be-posted'
import { bondWasTooLow } from './bond-was-too-low'
import { cheatCatchingMachineIsLive } from './cheat-catching-machine-is-live'
import { verifierNeedsToEat } from './verifier-needs-to-eat'
import { juryExecutedOnDevnet } from './jury-executed-on-devnet'
import { juryLiveOnDevnet } from './jury-live-on-devnet'
import { verifierAsJuryMember } from './verifier-as-jury-member'
import { verifierDaemonFusion } from './verifier-daemon-fusion'

export const BLOG_POSTS: BlogPost[] = [
  tieBreakersNeedToEatToo,
  appealsCourtForWrongfulConvictions,
  bondCanActuallyBePosted,
  bondWasTooLow,
  verifierNeedsToEat,
  juryExecutedOnDevnet,
  juryLiveOnDevnet,
  verifierAsJuryMember,
  cheatCatchingMachineIsLive,
  verifierDaemonFusion,
]

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export function sortedBlogPosts() {
  const order = new Map(BLOG_CATALOG.map((item, index) => [item.slug, index]))
  return [...BLOG_POSTS].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999)
  })
}
