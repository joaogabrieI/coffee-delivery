import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import type { PaymentMethod } from '../types/order'
import { renderWithProviders } from './renderWithProviders'

function Controlled({ error }: { error?: string }) {
  const [value, setValue] = useState<PaymentMethod>()
  return <PaymentMethodSelector value={value} onChange={setValue} error={error} />
}

describe('PaymentMethodSelector (RF-09, RN-05)', () => {
  it('3 opções num grupo nomeado; só uma fica marcada', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Controlled />)
    expect(screen.getByRole('group', { name: /pagamento/i })).toBeInTheDocument()

    const credit = screen.getByRole('radio', { name: /cartão de crédito/i })
    const cash = screen.getByRole('radio', { name: /dinheiro/i })
    await user.click(credit)
    expect(credit).toBeChecked()
    await user.click(cash)
    expect(cash).toBeChecked()
    expect(credit).not.toBeChecked()
  })

  it('navegável por teclado (setas trocam a opção)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Controlled />)
    await user.click(screen.getByRole('radio', { name: /cartão de crédito/i }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: /cartão de débito/i })).toBeChecked()
  })

  it('erro acessível ligado ao grupo', () => {
    renderWithProviders(<Controlled error="Selecione a forma de pagamento" />)
    expect(screen.getByRole('group', { name: /pagamento/i })).toHaveAccessibleDescription(
      /selecione a forma de pagamento/i,
    )
    expect(screen.getByRole('radio', { name: /dinheiro/i })).toHaveAttribute('aria-invalid', 'true')
  })

  it('não existe nenhum campo de dados de cartão (RN-05)', () => {
    renderWithProviders(<Controlled />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
