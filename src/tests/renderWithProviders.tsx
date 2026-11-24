import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../contexts/CartContext'
import { ThemeProvider } from '../contexts/ThemeContext'

/** Renderiza com os mesmos providers do main.tsx, numa rota inicial. */
export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  return render(
    <ThemeProvider>
      <CartProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </CartProvider>
    </ThemeProvider>,
  )
}
