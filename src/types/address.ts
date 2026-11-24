export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export type UF = (typeof UFS)[number]

export interface DeliveryAddress {
  /** Somente dígitos, 8 caracteres. */
  cep: string
  street: string
  number: string
  /** Opcional (RN-07). */
  complement?: string
  neighborhood: string
  city: string
  uf: UF
}

/** Type guard: confere se uma string é uma UF válida (ex.: vinda da API). */
export const isUF = (value: string): value is UF => (UFS as readonly string[]).includes(value)
