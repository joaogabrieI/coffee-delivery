import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { fetchAddressByCep } from '../utils/cep'
import { STORAGE_KEYS } from '../utils/storage'
import { renderWithProviders } from './renderWithProviders'

const viaCepOk = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  complemento: 'lado ímpar',
  bairro: 'Sé',
  localidade: 'São Paulo',
  uf: 'SP',
}

const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }))

function setup() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([{ coffeeId: 'latte', quantity: 1 }]))
  const user = userEvent.setup()
  renderWithProviders(<App />, { route: '/checkout' })
  return { user, cep: screen.getByLabelText('CEP') }
}

describe('fetchAddressByCep', () => {
  it('chama a URL do ViaCEP só com dígitos e mapeia os campos', async () => {
    const fetchMock = vi.fn(() => jsonResponse(viaCepOk))
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchAddressByCep('01001-000')).resolves.toEqual({
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      uf: 'SP',
    })
    expect(fetchMock).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/', {
      signal: undefined,
    })
  })
})

describe('CEP no checkout (RF-08, RN-07)', () => {
  it('TC-24: CEP válido preenche rua/bairro/cidade/UF, foca o número e não toca no complemento', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => jsonResponse(viaCepOk)),
    )
    const { user, cep } = setup()

    await user.type(screen.getByLabelText(/complemento/i), 'Apto 12')
    await user.type(cep, '01001000')

    await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Praça da Sé'))
    expect(screen.getByLabelText('Bairro')).toHaveValue('Sé')
    expect(screen.getByLabelText('Cidade')).toHaveValue('São Paulo')
    expect(screen.getByLabelText('UF')).toHaveValue('SP')
    expect(screen.getByLabelText('Número')).toHaveValue('')
    expect(screen.getByLabelText('Número')).toHaveFocus()
    // o "complemento" que a API devolveu NÃO sobrescreve o do usuário
    expect(screen.getByLabelText(/complemento/i)).toHaveValue('Apto 12')
    expect(screen.getByText(/endereço encontrado/i)).toBeInTheDocument()
  })

  it('não consulta a API com menos de 8 dígitos', async () => {
    const fetchMock = vi.fn(() => jsonResponse(viaCepOk))
    vi.stubGlobal('fetch', fetchMock)
    const { user, cep } = setup()
    await user.type(cep, '0100100')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('TC-25: CEP não encontrado mostra mensagem e mantém campos editáveis', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => jsonResponse({ erro: true })),
    )
    const { user, cep } = setup()
    await user.type(cep, '99999999')

    expect(await screen.findByText(/cep não encontrado/i)).toBeInTheDocument()
    const street = screen.getByLabelText('Rua')
    await user.type(street, 'Rua Digitada à Mão')
    expect(street).toHaveValue('Rua Digitada à Mão')
  })

  it('TC-25: falha de rede mostra erro e "Tentar novamente" refaz a consulta', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockImplementationOnce(() => jsonResponse(viaCepOk))
    vi.stubGlobal('fetch', fetchMock)
    const { user, cep } = setup()
    await user.type(cep, '01001000')

    expect(await screen.findByText(/não foi possível consultar o cep/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }))

    await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Praça da Sé'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('erro HTTP (ex.: 500) também é tratado como indisponibilidade', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => jsonResponse({}, 500)),
    )
    const { user, cep } = setup()
    await user.type(cep, '01001000')
    expect(await screen.findByText(/não foi possível consultar o cep/i)).toBeInTheDocument()
  })

  it('cancela a requisição anterior quando o CEP muda', async () => {
    const signals: AbortSignal[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        signals.push(init!.signal!)
        return new Promise<Response>(() => {}) // nunca responde
      }),
    )
    const { user, cep } = setup()
    await user.type(cep, '01001000')
    await user.type(cep, '{backspace}1')

    expect(signals).toHaveLength(2)
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
    expect(cep).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(/buscando endereço/i)).toBeInTheDocument()
  })
})
