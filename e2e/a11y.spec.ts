import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { demoOrder, seed } from './fixtures.ts'

/** TC-34 (parte automatizável): axe-core com regras WCAG 2.x A/AA, nas 3 telas × 2 temas. */
for (const theme of ['light', 'dark'] as const) {
  for (const route of ['/', '/checkout', '/success']) {
    test(`sem violações WCAG A/AA em ${route} (${theme})`, async ({ page }) => {
      await seed(page, { theme, cart: [{ coffeeId: 'latte', quantity: 2 }], order: demoOrder })
      await page.goto(route)
      await expect(page.locator('h1')).toBeVisible()

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      expect(
        results.violations.map(
          (v) =>
            `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ') + ' | ' + n.failureSummary?.split('\n').slice(1, 2)).join(' ; ')}`,
        ),
      ).toEqual([])
    })
  }
}
