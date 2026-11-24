import { Receipt } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderSuccess } from '../components/OrderSuccess'
import { loadLastOrder } from '../utils/order'
import { EmptyState } from './Success.styles'

export function Success() {
  // Lido uma única vez do localStorage (snapshot); não depende do carrinho (RF-13).
  const [order] = useState(loadLastOrder)

  if (!order) {
    // RN-09: acesso direto sem pedido válido.
    return (
      <EmptyState>
        <Receipt size={48} weight="duotone" aria-hidden />
        <h1>Nenhum pedido encontrado</h1>
        <p>Escolha seus cafés e finalize um pedido para ver a confirmação aqui.</p>
        <Link to="/">Ver cafés</Link>
      </EmptyState>
    )
  }

  return <OrderSuccess order={order} />
}
