import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CartProvider } from '../contexts/CartContext'
import { useCart } from '../hooks/useCart'

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

describe('CartProvider + useCart (T-13)', () => {
  it('adicionar/remover atualiza linhas e totais derivados', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem('latte', 2)
      result.current.addItem('cubano', 1)
      result.current.addItem('latte', 1)
    })
    expect(result.current.lines.map((l) => [l.coffeeId, l.quantity])).toEqual([
      ['latte', 3],
      ['cubano', 1],
    ])
    expect(result.current.totals).toEqual({
      subtotalCents: 4 * 990,
      deliveryFeeCents: 350,
      totalCents: 4 * 990 + 350,
      totalUnits: 4,
    })

    act(() => result.current.decrement('latte'))
    act(() => result.current.removeItem('cubano'))
    expect(result.current.totals.totalUnits).toBe(2)

    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(result.current.totals.totalCents).toBe(0)
  })

  it('lança erro claro fora do provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useCart())).toThrow(/dentro de <CartProvider>/)
  })
})
