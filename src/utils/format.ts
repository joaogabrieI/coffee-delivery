/** Formatação de dinheiro — apenas apresentação (RN-04). Os cálculos são em centavos. */

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const decimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 1990 → "R$ 19,90" */
export const formatBRL = (cents: number) => brl.format(cents / 100)

/** 990 → "9,90" (no card o "R$" tem estilo próprio, como no Figma). */
export const formatPrice = (cents: number) => decimal.format(cents / 100)
