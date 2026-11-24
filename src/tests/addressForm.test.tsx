import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { STORAGE_KEYS } from '../utils/storage'
import { renderWithProviders } from './renderWithProviders'

describe('formulário de endereço (T-18)', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([{ coffeeId: 'latte', quantity: 1 }]))
  })

  it('todos os campos têm label; complemento marcado como opcional', () => {
    renderWithProviders(<App />, { route: '/checkout' })
    for (const label of ['CEP', 'Rua', 'Número', 'Bairro', 'Cidade', 'UF']) {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    }
    expect(screen.getByLabelText(/complemento \(opcional\)/i)).toBeInTheDocument()
  })

  it('aplica máscara no CEP', async () => {
    renderWithProviders(<App />, { route: '/checkout' })
    const cep = screen.getByLabelText('CEP')
    await userEvent.type(cep, '01001000')
    expect(cep).toHaveValue('01001-000')
  })

  it('erro ao sair do campo fica ligado por aria-describedby e aria-invalid', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />, { route: '/checkout' })
    const street = screen.getByLabelText('Rua')
    await user.click(street)
    await user.tab()

    expect(street).toHaveAttribute('aria-invalid', 'true')
    expect(street).toHaveAccessibleDescription('Informe a rua')
  })
})

it('o grupo de endereço tem nome acessível (fieldset + legend)', () => {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([{ coffeeId: 'latte', quantity: 1 }]))
  renderWithProviders(<App />, { route: '/checkout' })
  expect(screen.getByRole('group', { name: /endereço de entrega/i })).toBeInTheDocument()
})
