import { render, screen } from '@testing-library/react'
import { App } from '../App'

describe('smoke', () => {
  it('renderiza a aplicação', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /coffee delivery/i })).toBeInTheDocument()
  })
})
