import { z } from 'zod'
import { MAX_QTY, MIN_QTY } from '../utils/pricing'
import { addressSchema, paymentMethodSchema } from './checkoutSchema'

const cents = z.number().int().nonnegative()

/**
 * Valida o pedido salvo no localStorage antes de exibi-lo (RN-06, RN-09).
 * Dado corrompido ou editado à mão → tratado como "nenhum pedido".
 */
export const orderSchema = z
  .object({
    id: z.string().min(1),
    createdAt: z.iso.datetime(),
    items: z
      .array(
        z.object({
          coffeeId: z.string().min(1),
          name: z.string().min(1),
          unitPriceCents: cents,
          quantity: z.number().int().min(MIN_QTY).max(MAX_QTY),
        }),
      )
      .min(1),
    address: addressSchema,
    paymentMethod: paymentMethodSchema,
    subtotalCents: cents,
    deliveryFeeCents: cents,
    totalCents: cents,
  })
  .refine((order) => order.totalCents === order.subtotalCents + order.deliveryFeeCents, {
    message: 'Total inconsistente',
  })
