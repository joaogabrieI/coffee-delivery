import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar para a Home</Link>
    </section>
  )
}
