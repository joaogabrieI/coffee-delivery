import type { ThemeMode } from '../types/theme'
import { fonts, fontSize, radius, shadow, space } from './tokens'

export type { ThemeMode }

/**
 * Cores SEMÂNTICAS: o nome diz o papel ("primary", "textMuted"), não a cor.
 * Os dois temas implementam exatamente a mesma interface (TECH_SPEC §10.1).
 * Contraste dos pares usados na UI é verificado em `src/tests/contrast.test.ts`.
 */
export interface ThemeColors {
  /** Fundo da página. */
  bg: string
  /** Cards, resumo do pedido, formulário. */
  surface: string
  /** Controles sobre a superfície (quantidade, botões neutros). */
  surfaceAlt: string
  /** Fundo dos campos de texto. */
  inputBg: string
  /** Hover de controles neutros. */
  hover: string
  border: string

  /** Títulos (h1–h3). */
  title: string
  /** Subtítulos e textos fortes. */
  subtitle: string
  text: string
  textMuted: string

  /** Roxo da marca: ícones de ação, foco, seleção. */
  primary: string
  /** Roxo escuro: botão de adicionar ao carrinho. */
  primaryStrong: string
  /** Fundo roxo claro: chip de localização, opção selecionada. */
  primarySoft: string
  /** Texto roxo legível sobre `primarySoft`. */
  primaryInk: string
  /** Texto/ícone sobre `primary`/`primaryStrong`. */
  primaryText: string

  /** Amarelo da marca: botão confirmar. */
  accent: string
  /** Amarelo escuro: títulos de destaque, ícone do carrinho. */
  accentStrong: string
  /** Fundo amarelo claro: tags e botão do carrinho. */
  accentSoft: string
  /** Texto amarelo legível sobre `accentSoft` (tags). */
  accentInk: string
  /** Texto sobre `accent` (botão confirmar, contador do carrinho). */
  accentText: string

  focusRing: string
  success: string
  error: string
  errorSoft: string
  warning: string
  overlay: string
}

export interface AppTheme {
  mode: ThemeMode
  colors: ThemeColors
  fonts: typeof fonts
  fontSize: typeof fontSize
  space: typeof space
  radius: typeof radius
  shadow: typeof shadow
}

const shared = { fonts, fontSize, space, radius, shadow }

export const lightTheme: AppTheme = {
  mode: 'light',
  ...shared,
  colors: {
    bg: '#FAFAFA',
    surface: '#F3F2F2',
    surfaceAlt: '#E6E5E5',
    inputBg: '#EDEDED',
    hover: '#D7D5D5',
    border: '#E6E5E5',

    title: '#272221',
    subtitle: '#403937',
    text: '#574F4D',
    textMuted: '#736B69', // Figma: #8D8686 (3,2:1) → escurecido para 4,6:1

    primary: '#8047F8',
    primaryStrong: '#4B2995',
    primarySoft: '#EBE5F9',
    primaryInk: '#4B2995',
    primaryText: '#FFFFFF',

    accent: '#DBAC2C',
    accentStrong: '#B06F0F', // Figma: #C47F17 → escurecido para passar 3:1 sobre accentSoft
    accentSoft: '#F1E9C9',
    accentInk: '#8A5710',
    accentText: '#272221', // texto escuro sobre amarelo (7,4:1); branco ficaria 2,2:1

    focusRing: '#8047F8',
    success: '#2E7D32',
    error: '#C0392B',
    errorSoft: '#FBEAE8',
    warning: '#8A5710',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
}

export const darkTheme: AppTheme = {
  mode: 'dark',
  ...shared,
  colors: {
    bg: '#16120F',
    surface: '#231D1A',
    surfaceAlt: '#3A322E',
    inputBg: '#2B2420',
    hover: '#4A403B',
    border: '#3A322E',

    title: '#F4EFEC',
    subtitle: '#E2DAD6',
    text: '#CBC2BE',
    textMuted: '#A59C98',

    primary: '#A98BFF',
    primaryStrong: '#6A44D6',
    primarySoft: '#2C2346',
    primaryInk: '#C9B5FF',
    primaryText: '#FFFFFF',

    accent: '#E7BE4F',
    accentStrong: '#E9A63A',
    accentSoft: '#3A2F17',
    accentInk: '#F0C062',
    accentText: '#1A1410',

    focusRing: '#E7BE4F',
    success: '#7BD88F',
    error: '#FF8A7A',
    errorSoft: '#3D1F1B',
    warning: '#F0C062',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
}

export const themes: Record<ThemeMode, AppTheme> = { light: lightTheme, dark: darkTheme }
