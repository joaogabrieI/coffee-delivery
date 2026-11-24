import type { Coffee } from '../../types/coffee'
import { formatPrice } from '../../utils/format'
import { Card, CardFooter, Description, Price, Tags, Title } from './styles'

interface CoffeeCardProps {
  coffee: Coffee
}

/** Card do catálogo: imagem, tags, nome, descrição e preço (RF-01). */
export function CoffeeCard({ coffee }: CoffeeCardProps) {
  const titleId = `coffee-${coffee.id}`

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
      </CardFooter>
    </Card>
  )
}
