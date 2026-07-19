import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-italiana text-[42px] md:text-[56px] leading-[1.08] tracking-tight mb-5">
      {children}
    </h1>
  )
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-italiana text-[30px] md:text-[38px] leading-[1.12] mt-14 mb-5 scroll-mt-24"
    >
      {children}
    </h2>
  )
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="text-[20px] md:text-[24px] font-semibold mt-10 mb-4 scroll-mt-24"
    >
      {children}
    </h3>
  )
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[18px] md:text-[20px] leading-relaxed text-black/80 mb-5">
      {children}
    </p>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-[20px] border border-black/15 px-5 py-4 text-[17px] leading-relaxed text-black/75">
      {children}
    </div>
  )
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[15px] font-mono text-black">
      {children}
    </code>
  )
}

export function Pre({ children }: { children: string }) {
  return (
    <pre className="my-5 overflow-x-auto rounded-[18px] border border-black/10 bg-black/[0.03] px-4 py-4 text-[14px] md:text-[15px] leading-relaxed font-mono text-black">
      <code>{children}</code>
    </pre>
  )
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-5 ml-5 list-disc space-y-2.5 text-[18px] md:text-[20px] leading-relaxed text-black/80">
      {children}
    </ul>
  )
}

export function Ol({ children }: { children: ReactNode }) {
  return (
    <ol className="mb-5 ml-5 list-decimal space-y-2.5 text-[18px] md:text-[20px] leading-relaxed text-black/80">
      {children}
    </ol>
  )
}

export function Li({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>
}

export function Table({
  headers,
  rows,
}: {
  headers: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-[18px] border border-black/10">
      <table className="w-full min-w-[560px] border-collapse text-left text-[15px] md:text-[17px]">
        <thead>
          <tr className="border-b border-black/10 bg-black/[0.03]">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-black">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/8 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-black/75">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const className =
    'underline underline-offset-2 decoration-black/30 hover:decoration-black'
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[20px] md:text-[24px] leading-relaxed text-black/70 mb-10 max-w-[52rem]">
      {children}
    </p>
  )
}
