import { CheckFat, ShoppingCart } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useCart } from '../../hooks/useCart'
import type { Coffee } from '../../types/coffee'
import { formatPrice } from '../../utils/format'
import { MIN_QTY, clampQuantity } from '../../utils/pricing'
import { QuantityInput } from '../QuantityInput'
import { Actions, AddButton, Card, CardFooter, Description, Price, Tags, Title } from './styles'

interface CoffeeCardProps {
  coffee: Coffee
}

/** Card do catálogo (RF-01): escolhe a quantidade (RF-02) e adiciona ao carrinho (RF-03). */
export function CoffeeCard({ coffee }: CoffeeCardProps) {
  const { addItem } = useCart()
  // Estado LOCAL: a quantidade só vai para o carrinho quando o usuário clica em adicionar.
  const [quantity, setQuantity] = useState(MIN_QTY)
  const [justAdded, setJustAdded] = useState(false)
  const titleId = `coffee-${coffee.id}`

  // Volta o ícone do botão ao normal 1,5 s depois de adicionar.
  useEffect(() => {
    if (!justAdded) return
    const timer = setTimeout(() => setJustAdded(false), 1500)
    return () => clearTimeout(timer)
  }, [justAdded])

  function handleAdd() {
    addItem(coffee.id, quantity)
    setJustAdded(true)
    setQuantity(MIN_QTY)
  }

  return (
    <Card aria-labelledby={titleId}>
      <img
        src={coffee.imageUrl}
        alt={`Xícara de ${coffee.name} vista de cima`}
        width={120}
        height={120}
        loading="lazy"
      />

      <Tags aria-label="Categorias">
        {coffee.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </Tags>

      <Title id={titleId}>{coffee.name}</Title>
      <Description>{coffee.description}</Description>

      <CardFooter>
        <Price>
          <span>R$</span>
          <strong>{formatPrice(coffee.priceCents)}</strong>
        </Price>

        <Actions>
          <QuantityInput
            label={coffee.name}
            value={quantity}
            onChange={(next) => setQuantity(clampQuantity(next))}
          />
          <AddButton
            type="button"
            onClick={handleAdd}
            $added={justAdded}
            aria-label={`Adicionar ${coffee.name} ao carrinho`}
          >
            {justAdded ? (
              <CheckFat size={22} weight="fill" aria-hidden />
            ) : (
              <ShoppingCart size={22} weight="fill" aria-hidden />
            )}
          </AddButton>
        </Actions>
      </CardFooter>

      <span className="sr-only" role="status">
        {justAdded ? `${coffee.name} adicionado ao carrinho` : ''}
      </span>
    </Card>
  )
}
