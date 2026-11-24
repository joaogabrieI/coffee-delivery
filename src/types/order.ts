import type { DeliveryAddress } from './address'

export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface OrderItemSnapshot {
  coffeeId: string
  /** Cópia: independe do catálogo e do carrinho (RN-06). */
  name: string
  unitPriceCents: number
  quantity: number
}

export interface Order {
  /** crypto.randomUUID() */
  id: string
  /** ISO 8601 */
  createdAt: string
  items: OrderItemSnapshot[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
}
