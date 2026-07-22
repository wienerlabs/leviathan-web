export const LATEX_FONT =
  'KaTeX_Main, KaTeX_Math, "Latin Modern Roman", "Computer Modern", "Times New Roman", serif'

export const LATEX_MATH_FONT =
  'KaTeX_Math, KaTeX_Main, "Latin Modern Math", serif'

export const LATEX_TYPE_FONT =
  'KaTeX_Typewriter, KaTeX_Main, "Latin Modern Mono", monospace'

export function makeLatexTick(fill: string) {
  return {
    fill,
    fontSize: 13,
    fontFamily: LATEX_FONT,
  } as const
}

export function makeLatexTickMuted(fill: string) {
  return {
    fill,
    fontSize: 12,
    fontFamily: LATEX_FONT,
  } as const
}

export function makeLatexLabel(fill: string) {
  return {
    fill,
    fontSize: 12,
    fontFamily: LATEX_FONT,
  } as const
}
