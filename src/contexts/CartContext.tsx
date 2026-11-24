import { type ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react'
import { coffees } from '../data/coffees'
import { type CartAction, cartReducer, initialCartState } from '../reducers/cartReducer'
import type { CartState } from '../types/cart'
import { buildCartLines, calcTotals } from '../utils/pricing'
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage'
import { type CartContextValue, CartContext } from './context'

const hydrate = (items: unknown): CartAction => ({ type: 'HYDRATE', payload: { items } })

/**
 * Inicializador preguiçoso do useReducer: roda UMA vez, lê o localStorage e passa
 * pelo HYDRATE, que descarta itens inválidos ou fora do catálogo (RF-06, RN-10).
 */
function loadCart(): CartState {
  const stored = readStorage<unknown>(STORAGE_KEYS.cart, (value) => value)
  return cartReducer(initialCartState, hydrate(stored))
}

/**
 * Estado global do carrinho (Context API + useReducer).
 * Fluxo: componente chama addItem → dispatch(ADD_ITEM) → cartReducer devolve
 * novo estado → quem usa useCart() re-renderiza com lines/totals recalculados.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)

  // Persiste a cada mudança dos itens (o reducer continua puro, sem efeitos).
  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, state.items)
  }, [state.items])

  // Mantém abas abertas sincronizadas: outra aba alterou o carrinho → HYDRATE.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEYS.cart) return
      dispatch(hydrate(readStorage<unknown>(STORAGE_KEYS.cart, (value) => value)))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Estado derivado: recalculado só quando os itens mudam.
  const lines = useMemo(() => buildCartLines(state.items, coffees), [state.items])
  const totals = useMemo(() => calcTotals(lines), [lines])

  // useCallback: funções estáveis, não forçam re-render de quem as recebe.
  const addItem = useCallback(
    (coffeeId: string, quantity: number) =>
      dispatch({ type: 'ADD_ITEM', payload: { coffeeId, quantity } }),
    [],
  )
  const increment = useCallback(
    (coffeeId: string) => dispatch({ type: 'INCREMENT', payload: { coffeeId } }),
    [],
  )
  const decrement = useCallback(
    (coffeeId: string) => dispatch({ type: 'DECREMENT', payload: { coffeeId } }),
    [],
  )
  const removeItem = useCallback(
    (coffeeId: string) => dispatch({ type: 'REMOVE_ITEM', payload: { coffeeId } }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      lines,
      totals,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
    }),
    [state.items, lines, totals, addItem, increment, decrement, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
