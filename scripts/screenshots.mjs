/**
 * Gera capturas de tela das páginas em várias larguras e nos 2 temas.
 * Requer o servidor rodando (npm run dev) e o Google Chrome instalado.
 *
 * Uso: node scripts/screenshots.mjs [baseUrl] [saída] [larguras] [rotas] [temas]
 *  ex.: node scripts/screenshots.mjs http://localhost:5173 docs/screenshots 390,1280 /,/checkout light,dark
 */
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const [
  baseUrl = 'http://localhost:5173',
  outDir = 'docs/screenshots',
  widthsArg = '390,1280',
  routesArg = '/',
  themesArg = 'light',
] = process.argv.slice(2)

// Dados de exemplo para que Checkout e Sucesso apareçam preenchidos.
const seedCart = [
  { coffeeId: 'expresso-tradicional', quantity: 1 },
  { coffeeId: 'latte', quantity: 2 },
]
const seedOrder = {
  id: 'demo-0001',
  createdAt: '2026-11-24T12:00:00.000Z',
  items: [
    {
      coffeeId: 'expresso-tradicional',
      name: 'Expresso Tradicional',
      unitPriceCents: 990,
      quantity: 1,
    },
    { coffeeId: 'latte', name: 'Latte', unitPriceCents: 990, quantity: 2 },
  ],
  address: {
    cep: '01001000',
    street: 'Praça da Sé',
    number: '102',
    complement: 'Apto 12',
    neighborhood: 'Sé',
    city: 'São Paulo',
    uf: 'SP',
  },
  paymentMethod: 'credit',
  subtotalCents: 2970,
  deliveryFeeCents: 350,
  totalCents: 3320,
}

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })

for (const theme of themesArg.split(',')) {
  for (const width of widthsArg.split(',').map(Number)) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme })
    await page.addInitScript(
      ([cart, order, mode]) => {
        localStorage.setItem('coffee-delivery:cart:v1', JSON.stringify(cart))
        localStorage.setItem('coffee-delivery:last-order:v1', JSON.stringify(order))
        localStorage.setItem('coffee-delivery:theme', JSON.stringify(mode))
      },
      [seedCart, seedOrder, theme],
    )
    for (const route of routesArg.split(',')) {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle' })
      // Rola até o fim para carregar as imagens com loading="lazy".
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      const name = `${route === '/' ? 'home' : route.slice(1)}-${width}-${theme}.png`
      await page.screenshot({ path: `${outDir}/${name}`, fullPage: true })
      console.log(name, overflow ? '⚠ rolagem horizontal' : 'ok')
    }
    await page.close()
  }
}
await browser.close()
