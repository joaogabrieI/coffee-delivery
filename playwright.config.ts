import { defineConfig, devices } from '@playwright/test'

/**
 * Testes E2E (opcionais na TECH_SPEC §11): rodam contra o build de produção.
 * Usa o Google Chrome instalado (channel: 'chrome'); para usar o Chromium do
 * Playwright, troque por `npx playwright install chromium` e remova o channel.
 */
/** Para testar a versão publicada: PLAYWRIGHT_BASE_URL=https://... npm run test:e2e */
const remoteUrl = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: remoteUrl ?? 'http://localhost:4173',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: remoteUrl
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
