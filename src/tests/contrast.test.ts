import { darkTheme, lightTheme, type ThemeColors } from '../styles/themes'

/** Contraste WCAG 2.x entre duas cores hex (#RRGGBB). */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

type Pair = [fg: keyof ThemeColors, bg: keyof ThemeColors, min: number]

// Pares realmente usados na interface. 4.5 = texto normal; 3 = texto grande, ícones e bordas.
const pairs: Pair[] = [
  ['text', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['title', 'bg', 4.5],
  ['subtitle', 'surface', 4.5],
  ['textMuted', 'surface', 4.5],
  ['textMuted', 'bg', 4.5],
  ['primaryInk', 'primarySoft', 4.5],
  ['accentInk', 'accentSoft', 4.5],
  ['accentInk', 'bg', 4.5],
  ['error', 'errorSoft', 4.5],
  ['accentText', 'accent', 4.5],
  ['primaryText', 'primaryStrong', 4.5],
  ['error', 'bg', 4.5],
  ['error', 'surface', 4.5],
  ['accentStrong', 'bg', 3],
  ['accentStrong', 'accentSoft', 3],
  ['primary', 'surfaceAlt', 3],
  ['primary', 'surface', 3],
  ['focusRing', 'bg', 3],
  ['focusRing', 'surface', 3],
]

describe.each([
  ['claro', lightTheme.colors],
  ['escuro', darkTheme.colors],
])('contraste WCAG AA — tema %s', (_name, colors) => {
  it.each(pairs)('%s sobre %s ≥ %s:1', (fg, bg, min) => {
    expect(contrast(colors[fg], colors[bg])).toBeGreaterThanOrEqual(min)
  })
})

it('os dois temas implementam as mesmas chaves de cor', () => {
  expect(Object.keys(darkTheme.colors).sort()).toEqual(Object.keys(lightTheme.colors).sort())
})
