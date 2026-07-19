export type DocsNavItem = {
  title: string
  path: string
}

export type DocsNavGroup = {
  title: string
  items: DocsNavItem[]
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    title: 'Overview',
    items: [{ title: 'Introduction', path: '/docs/introduction' }],
  },
  {
    title: 'Developer',
    items: [
      { title: 'Quickstart', path: '/docs/developer/quickstart' },
      { title: 'Reproduce the sim', path: '/docs/developer/sim' },
      { title: 'Network tests', path: '/docs/developer/network-tests' },
      { title: 'Run a training node', path: '/docs/developer/run-a-node' },
      { title: 'Conviction demo', path: '/docs/developer/conviction-demo' },
    ],
  },
  {
    title: 'Protocol',
    items: [
      { title: 'Architecture', path: '/docs/protocol/architecture' },
      { title: 'Security model', path: '/docs/protocol/security' },
      { title: 'Verification', path: '/docs/protocol/verification' },
      { title: 'Economics', path: '/docs/protocol/economics' },
      { title: 'Round lifecycle', path: '/docs/protocol/round-lifecycle' },
    ],
  },
  {
    title: 'Network',
    items: [
      { title: 'Substrate', path: '/docs/network/substrate' },
      { title: 'Devnet programs', path: '/docs/network/devnet' },
    ],
  },
  {
    title: 'Project',
    items: [
      { title: 'Decisions', path: '/docs/project/decisions' },
      { title: 'Roadmap', path: '/docs/project/roadmap' },
      { title: 'Repositories', path: '/docs/project/repositories' },
    ],
  },
]

export const DOCS_DEFAULT = '/docs/developer/quickstart'

export function flatDocsNav() {
  return DOCS_NAV.flatMap((group) => group.items)
}

export function docsNeighbors(path: string) {
  const flat = flatDocsNav()
  const i = flat.findIndex((item) => item.path === path)
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  }
}
