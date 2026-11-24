import { cartReducer, initialCartState, sanitizeCartItems } from '../reducers/cartReducer'
import type { CartState } from '../types/cart'

const withItems = (...items: [string, number][]): CartState => ({
  items: items.map(([coffeeId, quantity]) => ({ coffeeId, quantity })),
})

describe('cartReducer', () => {
  it('TC-01: ADD_ITEM de café novo cria linha', () => {
    const state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'latte', quantity: 2 },
    })
    expect(state.items).toEqual([{ coffeeId: 'latte', quantity: 2 }])
  })

  it('TC-02: ADD_ITEM repetido soma sem duplicar linha', () => {
    const state = cartReducer(withItems(['latte', 2], ['cubano', 1]), {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'latte', quantity: 3 },
    })
    expect(state.items).toEqual([
      { coffeeId: 'latte', quantity: 5 },
      { coffeeId: 'cubano', quantity: 1 },
    ])
  })

  it.each([0, -1, 1.5, Number.NaN])('TC-03: ADD_ITEM com quantidade %s é ignorado', (quantity) => {
    const before = withItems(['latte', 1])
    const after = cartReducer(before, {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'latte', quantity },
    })
    expect(after).toBe(before)
  })

  it('TC-04: INCREMENT soma 1 e respeita o limite de 99', () => {
    expect(
      cartReducer(withItems(['latte', 1]), { type: 'INCREMENT', payload: { coffeeId: 'latte' } })
        .items[0].quantity,
    ).toBe(2)

    const atMax = withItems(['latte', 99])
    expect(cartReducer(atMax, { type: 'INCREMENT', payload: { coffeeId: 'latte' } })).toBe(atMax)

    const added = cartReducer(withItems(['latte', 98]), {
      type: 'ADD_ITEM',
      payload: { coffeeId: 'latte', quantity: 10 },
    })
    expect(added.items[0].quantity).toBe(99)
  })

  it('TC-05: DECREMENT de 2→1 funciona; em 1 permanece 1 (D-02)', () => {
    const one = cartReducer(withItems(['latte', 2]), {
      type: 'DECREMENT',
      payload: { coffeeId: 'latte' },
    })
    expect(one.items[0].quantity).toBe(1)
    expect(cartReducer(one, { type: 'DECREMENT', payload: { coffeeId: 'latte' } })).toBe(one)
  })

  it('TC-06: REMOVE_ITEM remove só a linha alvo', () => {
    const state = cartReducer(withItems(['latte', 2], ['cubano', 1]), {
      type: 'REMOVE_ITEM',
      payload: { coffeeId: 'latte' },
    })
    expect(state.items).toEqual([{ coffeeId: 'cubano', quantity: 1 }])
  })

  it('TC-07: CLEAR_CART esvazia', () => {
    expect(cartReducer(withItems(['latte', 2]), { type: 'CLEAR_CART' }).items).toEqual([])
  })

  it('TC-08: não muta o estado anterior', () => {
    const before = withItems(['latte', 2], ['cubano', 1])
    const snapshot = structuredClone(before)
    Object.freeze(before.items)
    before.items.forEach((item) => Object.freeze(item))

    const after = cartReducer(before, { type: 'INCREMENT', payload: { coffeeId: 'latte' } })

    expect(before).toEqual(snapshot) // original intacto
    expect(after).not.toBe(before) // novo objeto
    expect(after.items).not.toBe(before.items) // novo array
    expect(after.items[1]).toBe(before.items[1]) // item não alterado é reaproveitado
  })
})

describe('HYDRATE / sanitizeCartItems', () => {
  it('TC-17: descarta coffeeId inexistente e quantidade inválida', () => {
    const state = cartReducer(initialCartState, {
      type: 'HYDRATE',
      payload: {
        items: [
          { coffeeId: 'latte', quantity: 2 },
          { coffeeId: 'cafe-fantasma', quantity: 1 },
          { coffeeId: 'cubano', quantity: 0 },
          { coffeeId: 'arabe', quantity: 'muitos' },
          { coffeeId: 'irlandes', quantity: 500 },
          null,
          'lixo',
        ],
      },
    })
    expect(state.items).toEqual([
      { coffeeId: 'latte', quantity: 2 },
      { coffeeId: 'irlandes', quantity: 99 },
    ])
  })

  it('valor que não é lista vira carrinho vazio', () => {
    expect(sanitizeCartItems({ items: 'x' })).toEqual([])
    expect(sanitizeCartItems(null)).toEqual([])
  })

  it('ids repetidos são unidos numa linha (RN-02)', () => {
    expect(
      sanitizeCartItems([
        { coffeeId: 'latte', quantity: 1 },
        { coffeeId: 'latte', quantity: 2 },
      ]),
    ).toEqual([{ coffeeId: 'latte', quantity: 3 }])
  })
})
