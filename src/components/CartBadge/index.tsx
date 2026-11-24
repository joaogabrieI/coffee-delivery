import { ShoppingCart } from '@phosphor-icons/react'
import { useCart } from '../../hooks/useCart'
import { Badge, CartLink } from './styles'

const describe = (units: number) =>
  units === 0 ? 'Carrinho vazio' : `${units} ${units === 1 ? 'item' : 'itens'} no carrinho`

/** Link para o checkout com o total de UNIDADES (RF-04), não de tipos de café. */
export function CartBadge() {
  const { totals } = useCart()
  const units = totals.totalUnits
  const label = describe(units)

  return (
    <>
      <CartLink to="/checkout" aria-label={`${label} — ir para o checkout`}>
        <ShoppingCart size={22} weight="fill" aria-hidden />
        {units > 0 && (
          <Badge aria-hidden data-testid="cart-badge">
            {units > 99 ? '99+' : units}
          </Badge>
        )}
      </CartLink>
      {/* Anuncia mudanças do contador sem mover o foco. */}
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
    </>
  )
}
