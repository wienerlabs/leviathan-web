import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { sortedBlogPosts } from './posts'
import { postPath } from './types'

export default function BlogIndex() {
  const posts = sortedBlogPosts()

  return (
    <div className="min-h-screen bg-white text-black font-manrope">
      <SiteHeader variant="sticky" />
      <main className="mx-auto max-w-[820px] px-4 sm:px-5 py-10 md:px-8 md:py-14">
        <p className="mb-3 text-[14px] text-black/45 tracking-[0.06em]">
          Blog
        </p>
        <h1 className="font-italiana text-[42px] md:text-[56px] leading-[1.08] tracking-tight mb-4">
          Updates
        </h1>
        <p className="text-[18px] md:text-[20px] leading-relaxed text-black/70 mb-12 max-w-[40rem]">
          Product and engineering updates from the Leviathan network.
        </p>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to={postPath(post.slug)}
                className="block rounded-[24px] border border-black/10 px-5 py-5 sm:px-6 sm:py-6 hover:border-black transition-colors"
              >
                <time
                  dateTime={post.date}
                  className="block text-[13px] sm:text-[14px] text-black/45 mb-2 tracking-[0.04em]"
                >
                  {post.dateLabel}
                </time>
                <h2 className="text-[22px] md:text-[26px] font-semibold leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-[16px] md:text-[17px] leading-relaxed text-black/65">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
