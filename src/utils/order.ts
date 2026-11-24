import { orderSchema } from '../schemas/orderSchema'
import type { DeliveryAddress } from '../types/address'
import type { CartLine } from '../types/cart'
import type { Order, PaymentMethod } from '../types/order'
import { calcTotals } from './pricing'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

function newOrderId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/**
 * Cria o SNAPSHOT do pedido (RN-06): copia nome, preço unitário e quantidade de
 * cada linha e congela os totais. Depois disso o pedido não depende mais do
 * carrinho nem do catálogo — limpar o carrinho não muda o pedido (RF-13).
 */
export function createOrder(
  lines: CartLine[],
  address: DeliveryAddress,
  paymentMethod: PaymentMethod,
  now: Date = new Date(),
): Order {
  const totals = calcTotals(lines)
  return {
    id: newOrderId(),
    createdAt: now.toISOString(),
    items: lines.map((line) => ({
      coffeeId: line.coffeeId,
      name: line.coffee.name,
      unitPriceCents: line.unitPriceCents,
      quantity: line.quantity,
    })),
    address: { ...address, complement: address.complement || undefined },
    paymentMethod,
    subtotalCents: totals.subtotalCents,
    deliveryFeeCents: totals.deliveryFeeCents,
    totalCents: totals.totalCents,
  }
}

export function saveLastOrder(order: Order): void {
  writeStorage(STORAGE_KEYS.lastOrder, order)
}

/** Lê e valida o último pedido; `null` se não existir ou estiver inválido. */
export function loadLastOrder(): Order | null {
  return readStorage(STORAGE_KEYS.lastOrder, (value) => {
    const result = orderSchema.safeParse(value)
    return result.success ? result.data : null
  })
}
