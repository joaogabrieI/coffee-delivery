import { createContext } from 'react'
import type { ThemeMode } from '../styles/themes'

/**
 * Objetos de contexto ficam separados dos Providers (arquivos .tsx), para que o
 * Fast Refresh do Vite funcione: arquivos de componente só exportam componentes.
 */

export interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
