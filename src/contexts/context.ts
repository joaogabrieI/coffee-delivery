import { createContext } from 'react'
import type { CartItem, CartLine, Totals } from '../types/cart'
import type { ThemeMode } from '../types/theme'

/**
 * Objetos de contexto ficam separados dos Providers (arquivos .tsx), para que o
 * Fast Refresh do Vite funcione: arquivos de componente só exportam componentes.
 */

export interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface CartContextValue {
  items: CartItem[]
  /** Derivado: itens + dados do catálogo. */
  lines: CartLine[]
  /** Derivado: subtotal, entrega, total e unidades. */
  totals: Totals
  addItem: (coffeeId: string, quantity: number) => void
  increment: (coffeeId: string) => void
  decrement: (coffeeId: string) => void
  removeItem: (coffeeId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
