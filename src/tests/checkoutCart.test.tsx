import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { STORAGE_KEYS } from '../utils/storage'
import { renderWithProviders } from './renderWithProviders'

const seedCart = (items: { coffeeId: string; quantity: number }[]) =>
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items))

const summaryValue = (label: string) =>
  within(screen.getByText(label).closest('div')!).getByRole('definition')

describe('carrinho no checkout (TC-22 / RF-05, RF-10)', () => {
  it('alterar quantidades e remover atualiza totais e contador na hora', async () => {
    const user = userEvent.setup()
    seedCart([
      { coffeeId: 'latte', quantity: 2 },
      { coffeeId: 'cubano', quantity: 1 },
    ])
    renderWithProviders(<App />, { route: '/checkout' })

    expect(summaryValue('Total de itens')).toHaveTextContent('R$ 29,70')
    expect(summaryValue('Entrega')).toHaveTextContent('R$ 3,50')
    expect(summaryValue('Total')).toHaveTextContent('R$ 33,20')

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    expect(summaryValue('Total')).toHaveTextContent('R$ 43,10')
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('4')

    // D-02: no carrinho, "−" fica desabilitado em 1
    expect(screen.getByRole('button', { name: 'Diminuir quantidade de Cubano' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Remover Cubano do carrinho' }))
    expect(screen.queryByText('Cubano')).not.toBeInTheDocument()
    expect(summaryValue('Total')).toHaveTextContent('R$ 33,20')
  })

  it('carrinho vazio mostra EmptyCart, frete 0 e confirmar desabilitado (RN-09)', () => {
    renderWithProviders(<App />, { route: '/checkout' })
    expect(screen.getByText('Seu carrinho está vazio.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Escolher cafés' })).toHaveAttribute('href', '/')
    expect(summaryValue('Entrega')).toHaveTextContent('R$ 0,00')
    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled()
  })
})
