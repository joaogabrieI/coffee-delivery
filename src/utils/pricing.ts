import type { CartItem, CartLine, Totals } from '../types/cart'
import type { Coffee } from '../types/coffee'

/** RN-03 / D-01: taxa de entrega fixa fictícia (R$ 3,50). ÚNICO ponto de definição. */
export const DELIVERY_FEE_CENTS = 350

/** RN-01 / D-03: limites de quantidade por café. */
export const MIN_QTY = 1
export const MAX_QTY = 99

/** Garante inteiro dentro de [MIN_QTY, MAX_QTY]. */
export const clampQuantity = (quantity: number) =>
  Math.min(MAX_QTY, Math.max(MIN_QTY, Math.trunc(quantity)))

/** Σ(preço unitário × quantidade), em centavos. */
export const subtotalCents = (lines: { unitPriceCents: number; quantity: number }[]) =>
  lines.reduce((acc, line) => acc + line.unitPriceCents * line.quantity, 0)

/** Sem itens, sem frete. */
export const deliveryFeeCents = (subtotal: number) => (subtotal > 0 ? DELIVERY_FEE_CENTS : 0)

/** Soma das quantidades (RF-04) — não é o número de tipos de café. */
export const totalUnits = (items: { quantity: number }[]) =>
  items.reduce((acc, item) => acc + item.quantity, 0)

export function calcTotals(lines: { unitPriceCents: number; quantity: number }[]): Totals {
  const subtotal = subtotalCents(lines)
  const fee = deliveryFeeCents(subtotal)
  return {
    subtotalCents: subtotal,
    deliveryFeeCents: fee,
    totalCents: subtotal + fee,
    totalUnits: totalUnits(lines),
  }
}

/**
 * Junta itens do carrinho com o catálogo. Itens cujo `coffeeId` não existe
 * no catálogo são descartados (RN-10).
 */
export function buildCartLines(items: CartItem[], catalog: Coffee[]): CartLine[] {
  return items.flatMap((item) => {
    const coffee = catalog.find((c) => c.id === item.coffeeId)
    if (!coffee) return []
    return [
      {
        ...item,
        coffee,
        unitPriceCents: coffee.priceCents,
        lineTotalCents: coffee.priceCents * item.quantity,
      },
    ]
  })
}
