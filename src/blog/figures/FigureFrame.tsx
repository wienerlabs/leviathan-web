import type { ReactNode } from 'react'

export function FigureFrame({
  label,
  caption,
  children,
}: {
  label?: string
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-[14px] border border-black/12 bg-[#fafafa] px-4 py-4 sm:px-5 sm:py-5">
        {label ? (
          <p className="mb-3 text-[11px] sm:text-[12px] tracking-[0.08em] text-black/40">
            {label}
          </p>
        ) : null}
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2.5 px-1 text-[13px] sm:text-[14px] leading-relaxed text-black/45">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
