import { screen, waitFor } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export const viaCepSe = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  bairro: 'Sé',
  localidade: 'São Paulo',
  uf: 'SP',
}

export function mockViaCep(body: unknown = viaCepSe) {
  const fetchMock = vi.fn(() => Promise.resolve(new Response(JSON.stringify(body))))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Preenche o checkout como um usuário faria: CEP (API preenche) + número + pagamento. */
export async function fillCheckout(user: UserEvent, { complement = '' } = {}) {
  await user.type(screen.getByLabelText('CEP'), '01001000')
  await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Praça da Sé'))
  await user.type(screen.getByLabelText('Número'), '102')
  if (complement) await user.type(screen.getByLabelText(/complemento/i), complement)
  await user.click(screen.getByRole('radio', { name: /cartão de crédito/i }))
}
