import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../components/ThemeToggle'
import { STORAGE_KEYS } from '../utils/storage'
import { renderWithProviders } from './renderWithProviders'

function mockSystemTheme(dark: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: dark && query.includes('dark'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

describe('tema (TC-29 / RF-14)', () => {
  it('sem escolha salva usa prefers-color-scheme', () => {
    mockSystemTheme(true)
    renderWithProviders(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBeNull()
  })

  it('alternar muda data-theme e persiste a escolha', async () => {
    mockSystemTheme(false)
    renderWithProviders(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /modo escuro/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(button)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.theme)!)).toBe('dark')
  })

  it('escolha salva tem prioridade sobre o sistema', () => {
    mockSystemTheme(true)
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify('light'))
    renderWithProviders(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('valor corrompido no storage é ignorado', () => {
    mockSystemTheme(false)
    localStorage.setItem(STORAGE_KEYS.theme, '{quebrado')
    renderWithProviders(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
