import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { STORAGE_KEYS } from '../utils/storage'
import { fillCheckout, mockViaCep } from './flowHelpers'
import { renderWithProviders } from './renderWithProviders'

describe('tela de sucesso', () => {
  it('TC-27: mostra endereço, pagamento e valores do pedido; carrinho zerado', async () => {
    const user = userEvent.setup()
    mockViaCep()
    localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'cubano', quantity: 1 },
      ]),
    )
    renderWithProviders(<App />, { route: '/checkout' })
    await fillCheckout(user, { complement: 'Apto 12' })
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Uhu! Pedido confirmado'),
    )
    expect(screen.getByText('Praça da Sé, 102 - Apto 12')).toBeInTheDocument()
    expect(screen.getByText(/Sé - São Paulo, SP · CEP 01001-000/)).toBeInTheDocument()
    expect(screen.getByText('Cartão de crédito')).toBeInTheDocument()

    const items = screen.getByRole('region', { name: 'Itens do pedido' })
    expect(within(items).getByText('2× Latte')).toBeInTheDocument()
    expect(within(items).getByText('1× Cubano')).toBeInTheDocument()
    expect(within(items).getByText('R$ 33,20')).toBeInTheDocument()

    // RF-13: carrinho vazio, sucesso continua correto
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
  })

  it('RF-13 / RN-06: sucesso continua correto após "recarregar", mesmo com carrinho vazio', async () => {
    const user = userEvent.setup()
    mockViaCep()
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([{ coffeeId: 'arabe', quantity: 1 }]))
    const view = renderWithProviders(<App />, { route: '/checkout' })
    await fillCheckout(user)
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))
    await screen.findByText('Uhu! Pedido confirmado')
    view.unmount()

    renderWithProviders(<App />, { route: '/success' })
    expect(screen.getByText('Uhu! Pedido confirmado')).toBeInTheDocument()
    expect(screen.getByText('1× Árabe')).toBeInTheDocument()
  })

  it('TC-28: /success sem pedido mostra estado vazio com link para a Home', () => {
    renderWithProviders(<App />, { route: '/success' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nenhum pedido encontrado')
    expect(screen.getByRole('link', { name: 'Ver cafés' })).toHaveAttribute('href', '/')
  })

  it('TC-28: pedido corrompido também mostra o estado vazio', () => {
    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify({ id: 'x' }))
    renderWithProviders(<App />, { route: '/success' })
    expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument()
  })
})
