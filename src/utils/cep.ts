/** Mantém só os dígitos (máx. 8). */
export const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 8)

/** "01001000" → "01001-000" (máscara aplicada enquanto o usuário digita). */
export function maskCep(value: string): string {
  const digits = onlyDigits(value)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export const isCompleteCep = (value: string) => onlyDigits(value).length === 8

export interface CepAddress {
  street: string
  neighborhood: string
  city: string
  uf: string
}

/** CEP com formato válido que não existe na base do ViaCEP ({ "erro": true }). */
export class CepNotFoundError extends Error {
  constructor() {
    super('CEP não encontrado')
    this.name = 'CepNotFoundError'
  }
}

interface ViaCepResponse {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean | string
}

const VIACEP_URL = 'https://viacep.com.br/ws'

/**
 * GET https://viacep.com.br/ws/{cep}/json/ (TECH_SPEC §8.1).
 * - `{ erro: true }` → CepNotFoundError
 * - falha de rede, HTTP ≠ 2xx ou JSON inválido → Error (tratado como "error" na UI)
 * Mapeia logradouro→street, bairro→neighborhood, localidade→city, uf→uf.
 */
export async function fetchAddressByCep(cep: string, signal?: AbortSignal): Promise<CepAddress> {
  const digits = onlyDigits(cep)
  if (digits.length !== 8) throw new Error('CEP incompleto')

  const response = await fetch(`${VIACEP_URL}/${digits}/json/`, { signal })
  if (!response.ok) throw new Error(`ViaCEP respondeu ${response.status}`)

  const data = (await response.json()) as ViaCepResponse
  if (data.erro) throw new CepNotFoundError()

  return {
    street: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade ?? '',
    uf: (data.uf ?? '').toUpperCase(),
  }
}
