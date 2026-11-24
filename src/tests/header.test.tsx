import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { renderWithProviders } from './renderWithProviders'

describe('Header (TC-33 parcial)', () => {
  it('mostra a logo como link para a Home e o botão de tema', () => {
    renderWithProviders(<App />, { route: '/checkout' })
    const home = screen.getByRole('link', { name: /coffee delivery — página inicial/i })
    expect(home).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /modo escuro/i })).toBeInTheDocument()
  })

  it('o primeiro Tab foca o link "Pular para o conteúdo"', async () => {
    renderWithProviders(<App />)
    await userEvent.tab()
    expect(screen.getByRole('link', { name: /pular para o conteúdo/i })).toHaveFocus()
  })
})
