import { addressSchema, checkoutSchema } from '../schemas/checkoutSchema'
import { maskCep } from '../utils/cep'

const validAddress = {
  cep: '01001-000',
  street: 'Praça da Sé',
  number: '100',
  complement: '',
  neighborhood: 'Sé',
  city: 'São Paulo',
  uf: 'SP',
}

const errorsOf = (input: unknown) => {
  const result = addressSchema.safeParse(input)
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
}

describe('addressSchema (TC-14 / RF-08, RN-07)', () => {
  it('aceita endereço válido e normaliza o CEP para 8 dígitos', () => {
    const parsed = addressSchema.parse(validAddress)
    expect(parsed.cep).toBe('01001000')
  })

  it.each(['', '123', '0100100', '01001-0000', 'abcde-fgh'])('recusa CEP inválido "%s"', (cep) => {
    expect(errorsOf({ ...validAddress, cep }).cep).toBe('Informe um CEP válido (8 dígitos)')
  })

  it('recusa UF inválida', () => {
    expect(errorsOf({ ...validAddress, uf: 'XX' }).uf).toBe('Selecione a UF')
    expect(errorsOf({ ...validAddress, uf: '' }).uf).toBe('Selecione a UF')
  })

  it('campos obrigatórios vazios (ou só espaços) geram mensagens', () => {
    const errors = errorsOf({
      ...validAddress,
      street: ' ',
      number: '',
      neighborhood: '',
      city: '',
    })
    expect(errors).toMatchObject({
      street: 'Informe a rua',
      number: 'Informe o número',
      neighborhood: 'Informe o bairro',
      city: 'Informe a cidade',
    })
  })

  it('complemento é opcional (vazio ou ausente)', () => {
    const { complement, ...withoutComplement } = validAddress
    void complement
    expect(addressSchema.safeParse(withoutComplement).success).toBe(true)
    expect(addressSchema.safeParse({ ...validAddress, complement: '' }).success).toBe(true)
    expect(errorsOf({ ...validAddress, complement: 'x'.repeat(61) }).complement).toBeDefined()
  })
})

describe('checkoutSchema (TC-15 / RF-09, RN-05)', () => {
  it('pagamento ausente é rejeitado', () => {
    const result = checkoutSchema.safeParse({ address: validAddress })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toMatchObject({
      path: ['paymentMethod'],
      message: 'Selecione a forma de pagamento',
    })
  })

  it.each(['credit', 'debit', 'cash'])('aceita "%s"', (paymentMethod) => {
    expect(checkoutSchema.safeParse({ address: validAddress, paymentMethod }).success).toBe(true)
  })

  it('recusa método desconhecido', () => {
    expect(checkoutSchema.safeParse({ address: validAddress, paymentMethod: 'pix' }).success).toBe(
      false,
    )
  })
})

describe('maskCep', () => {
  it.each([
    ['01001000', '01001-000'],
    ['01001', '01001'],
    ['01a00-1000999', '01001-000'],
  ])('%s → %s', (raw, masked) => {
    expect(maskCep(raw)).toBe(masked)
  })
})
