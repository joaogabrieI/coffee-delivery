import type { PaymentMethod } from '../types/order'

/** Rótulos exibidos no checkout e na confirmação (RN-05: apenas informativo). */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  cash: 'Dinheiro',
}

export const PAYMENT_METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]
