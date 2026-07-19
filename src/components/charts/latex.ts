export const LATEX_FONT =
  'KaTeX_Main, KaTeX_Math, "Latin Modern Roman", "Computer Modern", "Times New Roman", serif'

export const LATEX_MATH_FONT =
  'KaTeX_Math, KaTeX_Main, "Latin Modern Math", serif'

export const LATEX_TYPE_FONT =
  'KaTeX_Typewriter, KaTeX_Main, "Latin Modern Mono", monospace'

export const latexTick = {
  fill: 'rgba(0,0,0,0.45)',
  fontSize: 13,
  fontFamily: LATEX_FONT,
} as const

export const latexTickMuted = {
  fill: 'rgba(0,0,0,0.35)',
  fontSize: 12,
  fontFamily: LATEX_FONT,
} as const

export const latexLabel = {
  fill: 'rgba(0,0,0,0.38)',
  fontSize: 12,
  fontFamily: LATEX_FONT,
} as const
