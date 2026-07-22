export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'leviathan-theme'

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function readStoredTheme(): ThemeMode | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    return null
  }
  return null
}

export function storeTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // ignore quota / private mode
  }
}

export function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0b0b0b' : '#ffffff')
  }
  const scheme = document.querySelector('meta[name="color-scheme"]')
  if (scheme) {
    scheme.setAttribute('content', theme)
  }
}

export function resolveInitialTheme(): ThemeMode {
  return readStoredTheme() ?? getSystemTheme()
}
