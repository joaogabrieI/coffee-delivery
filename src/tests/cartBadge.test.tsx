import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { renderWithProviders } from './renderWithProviders'

describe('contador do Header (TC-21 / RF-03, RF-04)', () => {
  it('soma as unidades de todos os cafés, não o número de tipos', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /carrinho vazio/i })).toHaveAttribute(
      'href',
      '/checkout',
    )

    // 2 Lattes + 1 Cubano + mais 1 Latte = 4 unidades em 2 linhas
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Latte ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Cubano ao carrinho' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Latte ao carrinho' }))

    expect(screen.getByTestId('cart-badge')).toHaveTextContent('4')
    expect(screen.getByRole('link', { name: /4 itens no carrinho/i })).toBeInTheDocument()
  })
})
