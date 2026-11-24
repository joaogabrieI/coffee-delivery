import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import { App } from '../App'

describe('rotas (RF-07)', () => {
  it.each([
    ['/', /encontre o café perfeito/i],
    ['/checkout', /complete seu pedido/i],
    ['/success', /pedido confirmado/i],
    ['/qualquer-coisa', /página não encontrada/i],
  ])('renderiza %s', (path, title) => {
    renderWithProviders(<App />, { route: path })
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })
})
