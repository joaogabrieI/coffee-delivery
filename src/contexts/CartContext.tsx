import { type ReactNode, useCallback, useMemo, useReducer } from 'react'
import { coffees } from '../data/coffees'
import { cartReducer, initialCartState } from '../reducers/cartReducer'
import { buildCartLines, calcTotals } from '../utils/pricing'
import { type CartContextValue, CartContext } from './context'

/**
 * Estado global do carrinho (Context API + useReducer).
 * Fluxo: componente chama addItem → dispatch(ADD_ITEM) → cartReducer devolve
 * novo estado → quem usa useCart() re-renderiza com lines/totals recalculados.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

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
