import { useTheme } from 'styled-components'
import { LogoWrapper, Wordmark } from './styles'

/**
 * Logo original criada com IA (PRD §7.4). SVG inline para usar as cores do tema
 * atual — no dark mode ela troca sozinha, sem precisar de outro arquivo.
 * O texto é decorativo: o nome acessível vem do link que envolve a logo.
 */
export function Logo() {
  const { colors } = useTheme()

  return (
    <LogoWrapper>
      <svg viewBox="0 0 44 46" width="40" height="42" aria-hidden="true" focusable="false">
        <path
          d="M22 1.5a9.5 9.5 0 0 0-9.5 9.5c0 7.2 9.5 14.5 9.5 14.5s9.5-7.3 9.5-14.5A9.5 9.5 0 0 0 22 1.5z"
          fill={colors.accent}
        />
        <ellipse
          cx="22"
          cy="11"
          rx="3.6"
          ry="5"
          fill={colors.primaryStrong}
          transform="rotate(20 22 11)"
        />
        <path
          d="M21 6.6c-1.6 2.8-.6 6.4 2 8.8"
          stroke={colors.accent}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M8 27h28v6.5A10.5 10.5 0 0 1 25.5 44h-7A10.5 10.5 0 0 1 8 33.5z"
          fill={colors.primary}
        />
        <path
          d="M36 29.5h1.8a4.6 4.6 0 0 1 0 9.2H35"
          stroke={colors.primary}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M1.5 31.5h4M3 36.5h3.5"
          stroke={colors.accent}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <Wordmark aria-hidden="true">
        <span>Coffee</span>
        <span>Delivery</span>
      </Wordmark>
    </LogoWrapper>
  )
}
