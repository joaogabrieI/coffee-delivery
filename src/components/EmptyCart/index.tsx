import { Coffee } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { EmptyBox } from './styles'

/** Estado vazio do carrinho (RN-09). */
export function EmptyCart() {
  return (
    <EmptyBox role="status">
      <Coffee size={40} weight="duotone" aria-hidden />
      <p>Seu carrinho está vazio.</p>
      <Link to="/">Escolher cafés</Link>
    </EmptyBox>
  )
}
