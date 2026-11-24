import { Trash } from '@phosphor-icons/react'
import type { CartLine } from '../../types/cart'
import { formatBRL } from '../../utils/format'
import { QuantityInput } from '../QuantityInput'
import { Controls, Info, ItemRow, LineTotal, RemoveButton } from './styles'

interface CartItemProps {
  item: CartLine
  onIncrement: (coffeeId: string) => void
  onDecrement: (coffeeId: string) => void
  onRemove: (coffeeId: string) => void
}

/** Linha do carrinho (RF-05). Recebe tudo por props: não conhece o contexto. */
export function CartItem({ item, onIncrement, onDecrement, onRemove }: CartItemProps) {
  const { coffee, quantity } = item

  return (
    <ItemRow>
      <img src={coffee.imageUrl} alt="" width={64} height={64} />
      <Info>
        <p>{coffee.name}</p>
        <Controls>
          <QuantityInput
            size="sm"
            label={coffee.name}
            value={quantity}
            // O reducer já limita 1..99; aqui só traduzimos a direção do clique.
            onChange={(next) => (next > quantity ? onIncrement(coffee.id) : onDecrement(coffee.id))}
          />
          <RemoveButton
            type="button"
            onClick={() => onRemove(coffee.id)}
            aria-label={`Remover ${coffee.name} do carrinho`}
          >
            <Trash size={16} aria-hidden />
            Remover
          </RemoveButton>
        </Controls>
      </Info>
      <LineTotal>{formatBRL(item.lineTotalCents)}</LineTotal>
    </ItemRow>
  )
}
