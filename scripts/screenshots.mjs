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

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })

for (const theme of themesArg.split(',')) {
  for (const width of widthsArg.split(',').map(Number)) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme })
    for (const route of routesArg.split(',')) {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle' })
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
