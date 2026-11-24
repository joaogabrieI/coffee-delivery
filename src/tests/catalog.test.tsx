import { screen, within } from '@testing-library/react'
import { App } from '../App'
import { coffees } from '../data/coffees'
import { renderWithProviders } from './renderWithProviders'

describe('catálogo (TC-20 / RF-01)', () => {
  it('renderiza todos os cafés com nome, descrição, preço, tag e imagem', () => {
    renderWithProviders(<App />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(coffees.length)

    for (const coffee of coffees) {
      const card = screen.getByRole('article', { name: coffee.name })
      expect(within(card).getByText(coffee.description)).toBeInTheDocument()
      expect(within(card).getByText('9,90')).toBeInTheDocument()
      for (const tag of coffee.tags) {
        expect(within(card).getByText(tag)).toBeInTheDocument()
      }
      expect(
        within(card).getByRole('img', { name: `Xícara de ${coffee.name} vista de cima` }),
      ).toHaveAttribute('src', coffee.imageUrl)
    }
  })
})
