import type { Coffee } from './coffee'

export interface CartItem {
  /** Referência ao catálogo. */
  coffeeId: string
  /** Inteiro de 1 a 99 (RN-01, D-03). */
  quantity: number
}

export interface CartState {
  items: CartItem[]
}

/** Linha derivada (item + dados do catálogo). Calculada, nunca persistida. */
export type CartLine = CartItem & {
  coffee: Coffee
  unitPriceCents: number
  lineTotalCents: number
}

export interface Totals {
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  /** Soma das quantidades — é o número do contador do Header (RF-04). */
  totalUnits: number
}
