/**
 * Tokens que NÃO mudam entre os temas: tipografia, espaçamento, raios, sombras
 * e breakpoints. As cores ficam em `themes.ts`.
 */

export const fonts = {
  title: "'Baloo 2', 'Arial Rounded MT Bold', system-ui, sans-serif",
  text: "'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
} as const

/** Escala tipográfica do Style Guide (rem, base 16 px). */
export const fontSize = {
  titleXL: '3rem', // 48
  titleL: '2rem', // 32
  titleM: '1.5rem', // 24
  titleS: '1.25rem', // 20
  titleXS: '1.125rem', // 18
  textL: '1.25rem', // 20
  textM: '1rem', // 16
  textS: '0.875rem', // 14
  textXS: '0.75rem', // 12
  tag: '0.625rem', // 10
} as const

export const space = {
  xxs: '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '2.5rem',
  xxxl: '3.5rem',
} as const

export const radius = {
  sm: '6px',
  md: '8px',
  pill: '999px',
  /** Card de café: cantos assimétricos do Figma. */
  card: '6px 36px',
  /** Resumo do carrinho / caixa de sucesso. */
  cart: '6px 44px',
} as const

export const shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 16px rgba(0, 0, 0, 0.08)',
} as const

/** Breakpoints mobile first (min-width) — TECH_SPEC §10.2. */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export const media = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
} as const

/** Alvo de toque mínimo (WCAG 2.5.5 / PRD §6.1). */
export const TOUCH_TARGET = '2.75rem' // 44 px

/** Largura máxima do conteúdo (1120 px no Figma). */
export const CONTAINER_WIDTH = '70rem'
