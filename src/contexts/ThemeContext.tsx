import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { GlobalStyle } from '../styles/GlobalStyle'
import { type ThemeMode, themes } from '../styles/themes'
import { STORAGE_KEYS } from '../utils/storage'
import { ThemeContext } from './context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isThemeMode = (value: unknown): ThemeMode | null =>
  value === 'light' || value === 'dark' ? value : null

function getSystemTheme(): ThemeMode {
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Tema da aplicação (RF-14):
 * 1. escolha salva pelo usuário (localStorage);
 * 2. senão, preferência do sistema (`prefers-color-scheme`), acompanhando mudanças.
 * Só grava no localStorage quando o usuário escolhe — assim a 1ª visita continua
 * seguindo o sistema (decisão D-08).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [savedTheme, setSavedTheme] = useLocalStorage<ThemeMode | null>(
    STORAGE_KEYS.theme,
    null,
    isThemeMode,
  )
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme)

  useEffect(() => {
    const media = window.matchMedia?.(DARK_QUERY)
    if (!media) return
    const onChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const theme = savedTheme ?? systemTheme

  // Expõe o tema no <html> (data-theme + color-scheme dos controles nativos).
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setSavedTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setSavedTheme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={themes[theme]}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}
