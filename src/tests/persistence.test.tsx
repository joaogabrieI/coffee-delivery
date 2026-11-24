import { act, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { App } from '../App'
import { CartProvider } from '../contexts/CartContext'
import { useCart } from '../hooks/useCart'
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage'
import { renderWithProviders } from './renderWithProviders'

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

describe('storage (TC-16)', () => {
  it('JSON corrompido → null, sem lançar erro', () => {
    localStorage.setItem('x', '{quebrado')
    expect(readStorage('x', (v) => v)).toBeNull()
  })

  it('validação recusa formato inesperado', () => {
    writeStorage('x', { a: 1 })
    expect(readStorage('x', (v) => (typeof v === 'string' ? v : null))).toBeNull()
  })

  it('localStorage indisponível não quebra a escrita nem a leitura', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError')
    })
    expect(() => writeStorage('x', 1)).not.toThrow()
    expect(readStorage('x', (v) => v)).toBeNull()
  })

  it('carrinho corrompido no storage → carrinho vazio', () => {
    localStorage.setItem(STORAGE_KEYS.cart, 'não é json')
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
  })
})

describe('persistência do carrinho (TC-23 / RF-06)', () => {
  it('grava a cada mudança e recupera ao montar de novo (simula F5)', () => {
    const first = renderHook(() => useCart(), { wrapper })
    act(() => first.result.current.addItem('latte', 3))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!)).toEqual([
      { coffeeId: 'latte', quantity: 3 },
    ])
    first.unmount()

    const second = renderHook(() => useCart(), { wrapper })
    expect(second.result.current.items).toEqual([{ coffeeId: 'latte', quantity: 3 }])
    expect(second.result.current.totals.totalUnits).toBe(3)
  })

  it('TC-17 na prática: itens inválidos salvos são descartados na hidratação', () => {
    localStorage.setItem(
      STORAGE_KEYS.cart,
      JSON.stringify([
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'removido-do-catalogo', quantity: 5 },
      ]),
    )
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
  })

  it('o contador do Header aparece já preenchido após "recarregar"', async () => {
    const user = userEvent.setup()
    const view = renderWithProviders(<App />)
    await user.click(screen.getByRole('button', { name: 'Adicionar Cubano ao carrinho' }))
    view.unmount()

    renderWithProviders(<App />)
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
  })
})
