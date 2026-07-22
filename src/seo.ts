export const SITE = {
  name: 'Leviathan AI',
  title: 'Leviathan AI',
  description:
    'Leviathan AI is a Solana-coordinated trustless training network. Anyone with a GPU joins by posting a bond, earns Proof of Gradient for verified work, and owns the model the swarm trains.',
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
    'https://leviathan.run',
  twitter: '@leviathanfront',
  locale: 'en_US',
  imagePath: '/banner.jpg',
  imageWidth: 1400,
  imageHeight: 653,
  imageAlt: 'Leviathan AI banner',
  themeColor: '#ffffff',
} as const

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path
  const base = SITE.url
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function ogImageUrl(): string {
  return absoluteUrl(SITE.imagePath)
}

export function applyDocumentTitle() {
  document.title = SITE.title
}
