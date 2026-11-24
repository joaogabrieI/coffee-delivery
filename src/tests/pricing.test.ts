import { coffees } from '../data/coffees'
import { formatBRL, formatPrice } from '../utils/format'
import {
  DELIVERY_FEE_CENTS,
  buildCartLines,
  calcTotals,
  clampQuantity,
  deliveryFeeCents,
  subtotalCents,
  totalUnits,
} from '../utils/pricing'

describe('pricing', () => {
  it('TC-09: subtotal, entrega e total corretos (3 × R$ 9,90 + frete)', () => {
    const totals = calcTotals([{ unitPriceCents: 990, quantity: 3 }])
    expect(totals).toEqual({
      subtotalCents: 2970,
      deliveryFeeCents: DELIVERY_FEE_CENTS,
      totalCents: 2970 + 350,
      totalUnits: 3,
    })
  })

  it('TC-10: sem erro de ponto flutuante (somas em centavos)', () => {
    // Em reais: 0.1 + 0.2 !== 0.3. Em centavos o resultado é exato.
    expect(
      subtotalCents([
        { unitPriceCents: 10, quantity: 1 },
        { unitPriceCents: 20, quantity: 1 },
      ]),
    ).toBe(30)
    expect(subtotalCents([{ unitPriceCents: 990, quantity: 7 }])).toBe(6930)
  })

  it('TC-11: entrega = 0 com carrinho vazio', () => {
    expect(deliveryFeeCents(0)).toBe(0)
    expect(calcTotals([])).toEqual({
      subtotalCents: 0,
      deliveryFeeCents: 0,
      totalCents: 0,
      totalUnits: 0,
    })
  })

  it('TC-12: totalUnits soma quantidades, não tipos', () => {
    const items = [
      { coffeeId: 'latte', quantity: 2 },
      { coffeeId: 'cubano', quantity: 3 },
    ]
    expect(totalUnits(items)).toBe(5)
    expect(items).toHaveLength(2)
  })

  it('buildCartLines junta catálogo e descarta ids inexistentes (RN-10)', () => {
    const lines = buildCartLines(
      [
        { coffeeId: 'latte', quantity: 2 },
        { coffeeId: 'nao-existe', quantity: 1 },
      ],
      coffees,
    )
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({ coffeeId: 'latte', unitPriceCents: 990, lineTotalCents: 1980 })
    expect(lines[0].coffee.name).toBe('Latte')
  })

  it('clampQuantity mantém 1..99 e inteiro', () => {
    expect(clampQuantity(0)).toBe(1)
    expect(clampQuantity(-5)).toBe(1)
    expect(clampQuantity(150)).toBe(99)
    expect(clampQuantity(2.7)).toBe(2)
  })
})

describe('format', () => {
  it('TC-13: formatBRL(1990) → "R$ 19,90"', () => {
    // Intl usa espaço não separável (U+00A0) entre "R$" e o valor.
    expect(formatBRL(1990)).toBe('R$ 19,90')
    expect(formatBRL(0)).toBe('R$ 0,00')
    expect(formatBRL(123456)).toBe('R$ 1.234,56')
  })

  it('formatPrice mostra sempre 2 casas decimais', () => {
    expect(formatPrice(990)).toBe('9,90')
    expect(formatPrice(1000)).toBe('10,00')
  })
})

describe('catálogo (RN-08)', () => {
  it('ids únicos, preços inteiros positivos e ao menos uma tag', () => {
    expect(new Set(coffees.map((c) => c.id)).size).toBe(coffees.length)
    for (const coffee of coffees) {
      expect(Number.isInteger(coffee.priceCents) && coffee.priceCents > 0).toBe(true)
      expect(coffee.tags.length).toBeGreaterThan(0)
      expect(coffee.imageUrl).toMatch(/^\/coffees\/.+\.svg$/)
    }
  })
})

it('cada imagem do catálogo existe em public/ (sem imagem quebrada)', () => {
  // import.meta.glob (Vite) lista os arquivos existentes em tempo de build/teste.
  const files = Object.keys(import.meta.glob('../../public/coffees/*.svg')).map((path) =>
    path.replace('../../public', ''),
  )
  for (const coffee of coffees) {
    expect(files, coffee.imageUrl).toContain(coffee.imageUrl)
  }
})
