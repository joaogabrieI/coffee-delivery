import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '../../hooks/useTheme'
import { ToggleButton } from './styles'

/** Botão acessível de tema: rótulo diz a AÇÃO, `aria-pressed` diz o ESTADO. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label="Modo escuro"
      aria-pressed={isDark}
      title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDark ? (
        <Sun size={22} weight="fill" aria-hidden />
      ) : (
        <Moon size={22} weight="fill" aria-hidden />
      )}
    </ToggleButton>
  )
}
