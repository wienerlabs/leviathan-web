import katex from 'katex'
import { useMemo } from 'react'

export function MathTex({
  tex,
  display = false,
  className = '',
}: {
  tex: string
  display?: boolean
  className?: string
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: display,
        strict: 'ignore',
        output: 'html',
      })
    } catch {
      return tex
    }
  }, [tex, display])

  return (
    <span
      className={['chart-latex', className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
