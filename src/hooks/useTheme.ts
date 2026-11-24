import { useContext } from 'react'
import { ThemeContext } from '../contexts/context'

/** Tema atual + alternância. Falha cedo se usado fora do <ThemeProvider>. */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  return context
}
