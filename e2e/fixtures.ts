import type { Page } from '@playwright/test'

export const viaCepSe = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  bairro: 'Sé',
  localidade: 'São Paulo',
  uf: 'SP',
}

/** Responde o ViaCEP localmente: os testes não dependem da internet. */
export async function mockViaCep(page: Page, body: unknown = viaCepSe) {
  await page.route('https://viacep.com.br/ws/**', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) }),
  )
}

export const demoOrder = {
  id: 'demo-0001',
  createdAt: '2026-11-24T12:00:00.000Z',
  items: [{ coffeeId: 'latte', name: 'Latte', unitPriceCents: 990, quantity: 2 }],
  address: {
    cep: '01001000',
    street: 'Praça da Sé',
    number: '102',
    neighborhood: 'Sé',
    city: 'São Paulo',
    uf: 'SP',
  },
  paymentMethod: 'credit',
  subtotalCents: 1980,
  deliveryFeeCents: 350,
  totalCents: 2330,
}

/** Preenche localStorage antes da página carregar (tema, carrinho, último pedido). */
export async function seed(
  page: Page,
  { theme, cart, order }: { theme?: 'light' | 'dark'; cart?: unknown; order?: unknown },
) {
  await page.addInitScript(
    ([t, c, o]) => {
      if (t) localStorage.setItem('coffee-delivery:theme', JSON.stringify(t))
      if (c) localStorage.setItem('coffee-delivery:cart:v1', JSON.stringify(c))
      if (o) localStorage.setItem('coffee-delivery:last-order:v1', JSON.stringify(o))
    },
    [theme, cart, order] as const,
  )
}
