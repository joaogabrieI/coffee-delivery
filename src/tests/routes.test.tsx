import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'

describe('rotas (RF-07)', () => {
  it.each([
    ['/', /encontre o café perfeito/i],
    ['/checkout', /complete seu pedido/i],
    ['/success', /pedido confirmado/i],
    ['/qualquer-coisa', /página não encontrada/i],
  ])('renderiza %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })
})
