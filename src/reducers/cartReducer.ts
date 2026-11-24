import { coffees } from '../data/coffees'
import type { CartItem, CartState } from '../types/cart'
import { MAX_QTY, MIN_QTY, clampQuantity } from '../utils/pricing'

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { coffeeId: string; quantity: number } } // RF-03, RN-01/02
  | { type: 'INCREMENT'; payload: { coffeeId: string } } // RF-05
  | { type: 'DECREMENT'; payload: { coffeeId: string } } // RF-05, RN-01
  | { type: 'REMOVE_ITEM'; payload: { coffeeId: string } } // RF-05
  | { type: 'CLEAR_CART' } // RF-13
  | { type: 'HYDRATE'; payload: { items: unknown } } // RF-06

export const initialCartState: CartState = { items: [] }

const catalogIds = new Set(coffees.map((coffee) => coffee.id))

const isValidQuantity = (quantity: unknown): quantity is number =>
  Number.isInteger(quantity) && (quantity as number) >= MIN_QTY

/**
 * Limpa uma lista vinda de fora (localStorage): descarta itens com formato
 * errado, quantidade inválida ou `coffeeId` que não existe no catálogo (RN-10),
 * limita a 99 e junta ids repetidos numa linha só (RN-02).
 */
export function sanitizeCartItems(raw: unknown, validIds: Set<string> = catalogIds): CartItem[] {
  if (!Array.isArray(raw)) return []

  return raw.reduce<CartItem[]>((acc, entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return acc
    const { coffeeId, quantity } = entry as Record<string, unknown>
    if (typeof coffeeId !== 'string' || !validIds.has(coffeeId) || !isValidQuantity(quantity)) {
      return acc
    }
    const existing = acc.find((item) => item.coffeeId === coffeeId)
    return existing
      ? acc.map((item) =>
          item.coffeeId === coffeeId
            ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
            : item,
        )
      : [...acc, { coffeeId, quantity: clampQuantity(quantity) }]
  }, [])
}

/**
 * Reducer PURO e IMUTÁVEL: recebe o estado atual e uma ação e devolve um NOVO
 * estado. Nunca usa push/splice nem altera objetos existentes — usa map/filter/spread.
 * Quando nada muda, devolve o MESMO objeto (o React então não re-renderiza).
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { coffeeId, quantity } = action.payload
      // RN-01: quantidade 0, negativa ou não inteira é ignorada.
      if (!isValidQuantity(quantity)) return state

      const exists = state.items.some((item) => item.coffeeId === coffeeId)
      if (!exists) {
        return { items: [...state.items, { coffeeId, quantity: clampQuantity(quantity) }] }
      }
      // RN-02: mesmo café → soma na linha existente (máx. 99).
      return {
        items: state.items.map((item) =>
          item.coffeeId === coffeeId
            ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
            : item,
        ),
      }
    }

    case 'INCREMENT': {
      const target = state.items.find((item) => item.coffeeId === action.payload.coffeeId)
      if (!target || target.quantity >= MAX_QTY) return state
      return {
        items: state.items.map((item) =>
          item === target ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      }
    }

    // D-02: em 1 a redução é bloqueada (mesmo estado). Remover só pelo botão "Remover".
    case 'DECREMENT': {
      const target = state.items.find((item) => item.coffeeId === action.payload.coffeeId)
      if (!target || target.quantity <= MIN_QTY) return state
      return {
        items: state.items.map((item) =>
          item === target ? { ...item, quantity: item.quantity - 1 } : item,
        ),
      }
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.coffeeId !== action.payload.coffeeId) }

    case 'CLEAR_CART':
      return { items: [] }

    case 'HYDRATE':
      return { items: sanitizeCartItems(action.payload.items) }

    default:
      return state
  }
}
