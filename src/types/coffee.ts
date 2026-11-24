export type CoffeeTag = 'tradicional' | 'gelado' | 'com leite' | 'especial' | 'alcoólico'

export interface Coffee {
  id: string
  name: string
  description: string
  /** Inteiro em centavos (RN-04). */
  priceCents: number
  imageUrl: string
  tags: CoffeeTag[]
}
