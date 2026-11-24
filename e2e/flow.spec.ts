import { expect, test } from '@playwright/test'
import { mockViaCep, seed } from './fixtures.ts'

test.beforeEach(async ({ page }) => {
  await mockViaCep(page)
})

test('TC-30: fluxo completo Home → Checkout → Sucesso, sem recarregar a página (RF-07)', async ({
  page,
}) => {
  await page.goto('/')
  // Marca a janela: se houver recarregamento completo, a marca some.
  await page.evaluate(() => ((window as unknown as { spaMarker: number }).spaMarker = 1))

  await page.getByRole('button', { name: 'Aumentar quantidade de Latte' }).click()
  await page.getByRole('button', { name: 'Adicionar Latte ao carrinho' }).click()
  await page.getByRole('button', { name: 'Adicionar Cubano ao carrinho' }).click()
  await expect(page.getByTestId('cart-badge')).toHaveText('3')

  await page.getByRole('link', { name: /3 itens no carrinho/ }).click()
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Complete seu pedido')

  await page.getByLabel('CEP').fill('01001000')
  await expect(page.getByLabel('Rua')).toHaveValue('Praça da Sé')
  await expect(page.getByLabel('Número')).toBeFocused()
  await page.getByLabel('Número').fill('102')
  await page.getByText('Dinheiro').click()
  await expect(page.getByText('R$ 33,20')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  await expect(page).toHaveURL(/\/success$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Uhu! Pedido confirmado')
  await expect(page.getByText('Praça da Sé, 102')).toBeVisible()
  await expect(page.getByText('Dinheiro')).toBeVisible()
  await expect(page.getByTestId('cart-badge')).toHaveCount(0)
  expect(await page.evaluate(() => (window as unknown as { spaMarker?: number }).spaMarker)).toBe(1)

  // F5 na tela de sucesso: pedido continua lá (snapshot), carrinho continua vazio.
  await page.reload()
  await expect(page.getByText('Uhu! Pedido confirmado')).toBeVisible()
  await expect(page.getByTestId('cart-badge')).toHaveCount(0)
})

test('TC-31: compra feita só com o teclado', async ({ page, isMobile }) => {
  test.skip(isMobile, 'teclado físico: só no desktop')
  await seed(page, { cart: [{ coffeeId: 'latte', quantity: 1 }] })
  await page.goto('/checkout')

  await page.keyboard.press('Tab') // skip link
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')

  await page.getByLabel('CEP').focus()
  await page.keyboard.type('01001000')
  await expect(page.getByLabel('Número')).toBeFocused()
  await page.keyboard.type('102')

  // Tab até o grupo de pagamento e escolhe com espaço
  const credit = page.getByRole('radio', { name: /cartão de crédito/i })
  for (let i = 0; i < 15 && !(await credit.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press('Tab')
  }
  await expect(credit).toBeFocused()
  await page.keyboard.press('Space')
  await expect(credit).toBeChecked()

  // segue com Tab até o botão Confirmar e aperta Enter
  const confirm = page.getByRole('button', { name: 'Confirmar pedido' })
  for (let i = 0; i < 20 && !(await confirm.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press('Tab')
  }
  await expect(confirm).toBeFocused()
  // foco visível: o botão tem outline aplicado
  expect(await confirm.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Uhu! Pedido confirmado')
})

test('TC-32: sem rolagem horizontal em 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await seed(page, { cart: [{ coffeeId: 'expresso-tradicional', quantity: 12 }] })
  for (const route of ['/', '/checkout', '/success']) {
    await page.goto(route)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, route).toBe(0)
  }
})

test('TC-33: logo no Header nos 2 temas, favicon e nenhuma imagem quebrada', async ({ page }) => {
  await page.goto('/')
  const logo = page.getByRole('link', { name: /coffee delivery/i })
  await expect(logo.locator('svg')).toBeVisible()

  const favicon = await page.request.get('/favicon.svg')
  expect(favicon.ok()).toBe(true)

  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
  })
  const broken = await page.$$eval('img', (imgs) =>
    imgs.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
  )
  expect(broken).toEqual([])

  await page.getByRole('button', { name: 'Modo escuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(logo.locator('svg')).toBeVisible()
})

test('RF-14: tema escolhido vale em todas as telas e sobrevive ao F5', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Modo escuro' }).click()
  for (const route of ['/checkout', '/success']) {
    await page.goto(route)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    // espera a transição de cor (0,2 s) terminar
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe('rgb(22, 18, 15)')
  }
})

test('F5 em /checkout mantém o carrinho e não dá 404', async ({ page }) => {
  await seed(page, { cart: [{ coffeeId: 'arabe', quantity: 2 }] })
  await page.goto('/checkout')
  await page.reload()
  await expect(page.getByText('Árabe')).toBeVisible()
  await expect(page.getByTestId('cart-badge')).toHaveText('2')
})
