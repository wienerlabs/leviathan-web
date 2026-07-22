import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { getBlogPost, sortedBlogPosts } from './posts'
import { postPath } from './types'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = getBlogPost(slug)
  const posts = sortedBlogPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  const prev = i >= 0 && i < posts.length - 1 ? posts[i + 1] : null
  const next = i > 0 ? posts[i - 1] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="min-h-screen bg-white text-black font-manrope">
      <SiteHeader variant="sticky" />
      <main className="mx-auto max-w-[820px] px-4 sm:px-5 py-8 md:px-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-black/45">
          <Link to="/blog" className="hover:text-black underline underline-offset-2 decoration-black/25">
            Blog
          </Link>
          <span className="text-black/20">/</span>
          <time dateTime={post.date}>{post.dateLabel}</time>
        </div>
        {post.body}
        <div className="mt-16 flex flex-col sm:flex-row gap-3 border-t border-black/10 pt-8">
          {prev ? (
            <Link
              to={postPath(prev.slug)}
              className="flex-1 rounded-[24px] border border-black px-5 py-4 hover:bg-black hover:text-white transition-colors"
            >
              <p className="text-[13px] opacity-50 mb-1">Older</p>
              <p className="text-[17px] font-medium">{prev.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              to={postPath(next.slug)}
              className="flex-1 rounded-[24px] border border-black px-5 py-4 text-right hover:bg-black hover:text-white transition-colors"
            >
              <p className="text-[13px] opacity-50 mb-1">Newer</p>
              <p className="text-[17px] font-medium">{next.title}</p>
            </Link>
          ) : null}
        </div>
        <p className="mt-10 text-[14px] text-black/40">
          Source commit on{' '}
          <a
            className="underline underline-offset-2"
            href="https://github.com/wienerlabs/leviathan-net"
            target="_blank"
            rel="noreferrer"
          >
            leviathan-net
          </a>
          .
        </p>
      </main>
    </div>
  )
}
