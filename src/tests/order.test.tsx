import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { coffees } from '../data/coffees'
import { buildCartLines } from '../utils/pricing'
import { createOrder, loadLastOrder, saveLastOrder } from '../utils/order'
import { STORAGE_KEYS } from '../utils/storage'
import { fillCheckout, mockViaCep } from './flowHelpers'
import { renderWithProviders } from './renderWithProviders'

const seedCart = () =>
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([
      { coffeeId: 'latte', quantity: 2 },
      { coffeeId: 'cubano', quantity: 1 },
    ]),
  )

const address = {
  cep: '01001000',
  street: 'Praça da Sé',
  number: '102',
  complement: '',
  neighborhood: 'Sé',
  city: 'São Paulo',
  uf: 'SP' as const,
}

describe('createOrder / last-order (RN-06)', () => {
  it('copia os dados das linhas e congela os totais', () => {
    const lines = buildCartLines([{ coffeeId: 'latte', quantity: 2 }], coffees)
    const order = createOrder(lines, address, 'cash', new Date('2026-11-24T12:00:00Z'))
    expect(order).toMatchObject({
      createdAt: '2026-11-24T12:00:00.000Z',
      items: [{ coffeeId: 'latte', name: 'Latte', unitPriceCents: 990, quantity: 2 }],
      address: { ...address, complement: undefined },
      paymentMethod: 'cash',
      subtotalCents: 1980,
      deliveryFeeCents: 350,
      totalCents: 2330,
    })
  })

  it('salva e lê de volta; dado inválido vira null', () => {
    const lines = buildCartLines([{ coffeeId: 'latte', quantity: 1 }], coffees)
    const order = createOrder(lines, address, 'debit')
    saveLastOrder(order)
    expect(loadLastOrder()).toEqual(order)

    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify({ ...order, totalCents: 1 }))
    expect(loadLastOrder()).toBeNull()
    localStorage.setItem(STORAGE_KEYS.lastOrder, '{lixo')
    expect(loadLastOrder()).toBeNull()
  })
})

describe('confirmar pedido', () => {
  it('TC-26: formulário inválido é bloqueado, com alerta e foco no 1º erro', async () => {
    const user = userEvent.setup()
    seedCart()
    renderWithProviders(<App />, { route: '/checkout' })

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/revise os campos/i)
    expect(screen.getByLabelText('CEP')).toHaveFocus()
    expect(screen.getByText('Selecione a forma de pagamento')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Complete seu pedido')
    expect(localStorage.getItem(STORAGE_KEYS.lastOrder)).toBeNull()
  })

  it('TC-26: carrinho vazio mantém o confirmar desabilitado', async () => {
    renderWithProviders(<App />, { route: '/checkout' })
    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled()
  })

  it('pedido válido: salva snapshot, zera o carrinho e vai para /success', async () => {
    const user = userEvent.setup()
    mockViaCep()
    seedCart()
    renderWithProviders(<App />, { route: '/checkout' })

    await fillCheckout(user)
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/pedido confirmado/i),
    )
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!)).toEqual([])
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()

    const saved = loadLastOrder()
    expect(saved).toMatchObject({
      address: { cep: '01001000', street: 'Praça da Sé', number: '102', uf: 'SP' },
      paymentMethod: 'credit',
      subtotalCents: 3 * 990,
      totalCents: 3 * 990 + 350,
    })
  })
})
