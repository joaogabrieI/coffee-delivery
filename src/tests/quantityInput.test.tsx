import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { App } from '../App'
import { QuantityInput } from '../components/QuantityInput'
import { renderWithProviders } from './renderWithProviders'

function Controlled({ initial = 1 }: { initial?: number }) {
  const [value, setValue] = useState(initial)
  return <QuantityInput label="Latte" value={value} onChange={setValue} min={1} max={3} />
}

describe('QuantityInput (RF-02, RN-01)', () => {
  it('− fica desabilitado no mínimo e + no máximo', async () => {
    renderWithProviders(<Controlled />)
    const minus = screen.getByRole('button', { name: 'Diminuir quantidade de Latte' })
    const plus = screen.getByRole('button', { name: 'Aumentar quantidade de Latte' })
    expect(minus).toBeDisabled()

    await userEvent.click(plus)
    await userEvent.click(plus)
    expect(screen.getByRole('status')).toHaveTextContent('3')
    expect(plus).toBeDisabled()
    expect(minus).toBeEnabled()
  })
})

describe('CoffeeCard: adicionar ao carrinho (T-14)', () => {
  it('escolhe a quantidade, adiciona e volta para 1', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade de Latte' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Latte ao carrinho' }))

    expect(screen.getByText('Latte adicionado ao carrinho')).toBeInTheDocument()
    const group = screen.getByRole('group', { name: 'Quantidade de Latte' })
    expect(group).toHaveTextContent('1')
  })
})
